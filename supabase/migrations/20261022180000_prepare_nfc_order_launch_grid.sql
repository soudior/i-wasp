-- Additive checkout contract for the deployed NFC payment functions.
-- Not applied by this change. Apply this file before deploying the functions.
--
-- Columns, indexes and foreign keys already exist on production
-- (project vwlngxifajsziexhkafe). IF NOT EXISTS keeps a second apply a no-op.
-- prepare_nfc_order keeps its signature. Currency travels in p_order.currency
-- (MAD or EUR). Amounts are chosen here and checked again by create-nfc-payment
-- and stripe-webhook. Legacy v7 amounts 32900 / 54900 / 98900 MAD stay accepted
-- by those functions for any order that already stores them; this function
-- prices new orders on the launch grid.
--
-- COALESCE and NULLIF are SQL parser forms, not catalog functions.
-- Schema-qualifying them raises SQLSTATE 42883 and aborts CREATE FUNCTION,
-- so prepare_nfc_order never updates and PAYER never reaches Stripe.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_key uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS digital_card_id uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subscription_id uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_session_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS checkout_revision integer NOT NULL DEFAULT 1;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_activated_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS orders_user_checkout_key_unique
  ON public.orders (user_id, checkout_key)
  WHERE checkout_key IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_stripe_session_id_unique
  ON public.orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_digital_card_id_fkey'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_digital_card_id_fkey
      FOREIGN KEY (digital_card_id) REFERENCES public.digital_cards(id) ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_subscription_id_fkey'
  ) THEN
    ALTER TABLE public.orders
      ADD CONSTRAINT orders_subscription_id_fkey
      FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Widen only: 'pending' is required while Stripe has not confirmed the order.
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_status_check;
ALTER TABLE public.subscriptions
  ADD CONSTRAINT subscriptions_status_check
  CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'cancelled'::text, 'expired'::text]));

CREATE OR REPLACE FUNCTION public.prepare_nfc_order(
  p_checkout_key uuid,
  p_offer_id text,
  p_payment_method text,
  p_card jsonb,
  p_order jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_existing public.orders%ROWTYPE;
  v_order_id uuid;
  v_card_id uuid;
  v_subscription_id uuid;
  v_subscription public.subscriptions%ROWTYPE;
  v_price integer;
  v_offer_name text;
  v_template text;
  v_style_id text;
  v_accent_color text;
  v_theme text;
  v_background_color text;
  v_text_color text;
  v_custom_styles jsonb;
  v_blocks jsonb := '[]'::jsonb;
  v_booking_url text;
  v_contract_changed boolean := false;
  v_is_cod boolean := p_payment_method = 'cod';
  v_card_live boolean := v_is_cod AND COALESCE((p_card ->> 'publish')::boolean, true);
  v_slug text;
  v_currency text := pg_catalog.upper(COALESCE(p_order ->> 'currency', 'MAD'));
  v_launch boolean := pg_catalog.now() <= timestamptz '2026-11-30 23:59:59+01';
  v_shipping_country text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  IF p_checkout_key IS NULL THEN
    RAISE EXCEPTION 'Checkout key required' USING ERRCODE = '22023';
  END IF;
  IF p_payment_method NOT IN ('stripe', 'cod') THEN
    RAISE EXCEPTION 'Unsupported payment method' USING ERRCODE = '22023';
  END IF;
  IF v_currency NOT IN ('MAD', 'EUR') THEN
    RAISE EXCEPTION 'Unsupported currency' USING ERRCODE = '22023';
  END IF;

  -- Date-gated grid. Must match supabase/functions/_shared/nfcCatalog.ts.
  IF p_offer_id = 'essentiel' AND v_currency = 'MAD' THEN
    v_price := 19900; v_offer_name := 'Essentielle';
  ELSIF p_offer_id = 'essentiel' AND v_currency = 'EUR' THEN
    v_price := 2900; v_offer_name := 'Essentielle';
  ELSIF p_offer_id = 'signature' AND v_currency = 'MAD' THEN
    v_price := CASE WHEN v_launch THEN 24900 ELSE 34900 END;
    v_offer_name := 'Professionnelle';
  ELSIF p_offer_id = 'signature' AND v_currency = 'EUR' THEN
    v_price := CASE WHEN v_launch THEN 3500 ELSE 4900 END;
    v_offer_name := 'Professionnelle';
  ELSIF p_offer_id = 'alliance' AND v_currency = 'MAD' THEN
    v_price := 59900; v_offer_name := 'Prestige';
  ELSIF p_offer_id = 'alliance' AND v_currency = 'EUR' THEN
    v_price := 7900; v_offer_name := 'Prestige';
  ELSIF p_offer_id = 'duo' AND v_launch AND v_currency = 'MAD' THEN
    v_price := 54900; v_offer_name := 'DUO';
  ELSIF p_offer_id = 'duo' AND v_launch AND v_currency = 'EUR' THEN
    v_price := 7900; v_offer_name := 'DUO';
  ELSIF p_offer_id = 'team' AND v_currency = 'MAD' THEN
    v_price := CASE WHEN v_launch THEN 99900 ELSE 129900 END;
    v_offer_name := 'TEAM';
  ELSIF p_offer_id = 'team' AND v_currency = 'EUR' THEN
    v_price := 11900; v_offer_name := 'TEAM';
  ELSE
    RAISE EXCEPTION 'Unsupported NFC offer' USING ERRCODE = '22023';
  END IF;

  v_shipping_country := CASE
    WHEN v_currency = 'MAD' THEN 'MA'
    ELSE COALESCE(
      NULLIF(pg_catalog.upper(pg_catalog.btrim(p_order ->> 'shippingCountry')), ''),
      'FR'
    )
  END;
  IF v_shipping_country !~ '^[A-Z]{2}$' THEN
    v_shipping_country := CASE WHEN v_currency = 'MAD' THEN 'MA' ELSE 'FR' END;
  END IF;

  v_style_id := p_card ->> 'styleId';
  SELECT style.template_id, style.theme, style.background_color, style.text_color
  INTO v_template, v_theme, v_background_color, v_text_color
  FROM (VALUES
    ('essential'::text, 'signature'::text, 'light'::text, '#F8F5EE'::text, '#111111'::text),
    ('signature'::text, 'dark-luxury'::text, 'dark'::text, '#0B0B0B'::text, '#F5F5F5'::text),
    ('executive'::text, 'executive'::text, 'dark'::text, '#101820'::text, '#F5F5F5'::text),
    ('prestige'::text, 'dark-luxury'::text, 'dark'::text, '#050505'::text, '#F5F5F5'::text),
    ('boutique'::text, 'boutique'::text, 'dark'::text, '#1A1512'::text, '#F5F5F5'::text)
  ) AS style(style_id, template_id, theme, background_color, text_color)
  WHERE style.style_id = v_style_id;

  SELECT accent.normalized_accent
  INTO v_accent_color
  FROM (VALUES
    ('#B8860B'::text, '#B8860B'::text),
    ('#C9FF57'::text, '#C9FF57'::text),
    ('#56B4FF'::text, '#56B4FF'::text),
    ('#E7E5E4'::text, '#E7E5E4'::text),
    ('#F5B400'::text, '#B8860B'::text),
    ('#D9A441'::text, '#B8860B'::text),
    ('#C9A227'::text, '#B8860B'::text),
    ('#D4AF37'::text, '#B8860B'::text)
  ) AS accent(input_accent, normalized_accent)
  WHERE accent.input_accent = pg_catalog.upper(p_card ->> 'accentColor');

  IF v_template IS NULL OR (p_card ->> 'template') IS DISTINCT FROM v_template THEN
    RAISE EXCEPTION 'Unsupported NFC style' USING ERRCODE = '22023';
  END IF;
  IF v_accent_color IS NULL THEN
    RAISE EXCEPTION 'Unsupported NFC accent' USING ERRCODE = '22023';
  END IF;
  IF NULLIF(pg_catalog.btrim(p_card ->> 'firstName'), '') IS NULL
     OR NULLIF(pg_catalog.btrim(p_card ->> 'lastName'), '') IS NULL THEN
    RAISE EXCEPTION 'Card identity required' USING ERRCODE = '22023';
  END IF;

  v_custom_styles := pg_catalog.jsonb_build_object(
    'creatorStyleId', v_style_id,
    'accentColor', v_accent_color,
    'primaryColor', v_accent_color,
    'backgroundColor', v_background_color,
    'textColor', v_text_color,
    'theme', v_theme
  );

  IF pg_catalog.jsonb_typeof(p_card -> 'blocks') = 'array'
     AND p_card -> 'blocks' -> 0 ->> 'id' = 'creator-booking'
     AND p_card -> 'blocks' -> 0 -> 'data' ->> 'actionType' = 'custom' THEN
    v_booking_url := NULLIF(pg_catalog.btrim(p_card -> 'blocks' -> 0 -> 'data' ->> 'value'), '');
    IF v_booking_url ~ '^https?://[^[:space:]]+$' THEN
      v_blocks := pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
        'id', 'creator-booking',
        'type', 'action',
        'visible', true,
        'order', 0,
        'data', pg_catalog.jsonb_build_object(
          'actionType', 'custom',
          'label', 'Prendre rendez-vous',
          'subtitle', 'Réserver un créneau',
          'value', v_booking_url
        )
      ));
    END IF;
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_user_id::text, 0));

  SELECT * INTO v_existing
  FROM public.orders
  WHERE user_id = v_user_id AND checkout_key = p_checkout_key
  FOR UPDATE;

  IF FOUND THEN
    IF v_existing.status <> 'pending'::public.order_status THEN
      RAISE EXCEPTION 'Checkout order is no longer editable' USING ERRCODE = 'P0001';
    END IF;
    v_contract_changed := v_existing.unit_price_cents <> v_price
      OR v_existing.payment_method <> p_payment_method
      OR v_existing.currency <> v_currency;
    IF v_existing.fulfillment_activated_at IS NOT NULL AND v_contract_changed THEN
      RAISE EXCEPTION 'Fulfilled order cannot change payment contract' USING ERRCODE = 'P0001';
    END IF;
    IF v_existing.stripe_session_id IS NOT NULL AND v_contract_changed THEN
      RAISE EXCEPTION 'Stripe checkout already started for this order' USING ERRCODE = 'P0001';
    END IF;
    v_card_id := v_existing.digital_card_id;
    v_subscription_id := v_existing.subscription_id;
  END IF;

  v_slug := pg_catalog.lower(pg_catalog.regexp_replace(
    pg_catalog.btrim(p_card ->> 'firstName') || '-' || pg_catalog.btrim(p_card ->> 'lastName'),
    '[^a-zA-Z0-9-]', '-', 'g'
  )) || '-' || pg_catalog.substr(pg_catalog.replace(p_checkout_key::text, '-', ''), 1, 10);

  IF v_card_id IS NULL THEN
    INSERT INTO public.digital_cards (
      user_id, slug, first_name, last_name, title, company, email, phone,
      whatsapp, instagram, linkedin, website, blocks, tagline, photo_url,
      logo_url, template, custom_styles, is_active, nfc_enabled, wallet_enabled
    ) VALUES (
      v_user_id,
      v_slug,
      pg_catalog.btrim(p_card ->> 'firstName'),
      pg_catalog.btrim(p_card ->> 'lastName'),
      NULLIF(pg_catalog.btrim(p_card ->> 'title'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'company'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'email'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'phone'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'whatsapp'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'instagram'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'linkedin'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'website'), ''),
      v_blocks,
      NULLIF(pg_catalog.btrim(p_card ->> 'tagline'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'photoUrl'), ''),
      NULLIF(pg_catalog.btrim(p_card ->> 'logoUrl'), ''),
      v_template,
      v_custom_styles,
      v_card_live,
      v_card_live,
      v_card_live
    )
    RETURNING id INTO v_card_id;
  ELSE
    UPDATE public.digital_cards SET
      first_name = pg_catalog.btrim(p_card ->> 'firstName'),
      last_name = pg_catalog.btrim(p_card ->> 'lastName'),
      title = NULLIF(pg_catalog.btrim(p_card ->> 'title'), ''),
      company = NULLIF(pg_catalog.btrim(p_card ->> 'company'), ''),
      email = NULLIF(pg_catalog.btrim(p_card ->> 'email'), ''),
      phone = NULLIF(pg_catalog.btrim(p_card ->> 'phone'), ''),
      whatsapp = NULLIF(pg_catalog.btrim(p_card ->> 'whatsapp'), ''),
      instagram = NULLIF(pg_catalog.btrim(p_card ->> 'instagram'), ''),
      linkedin = NULLIF(pg_catalog.btrim(p_card ->> 'linkedin'), ''),
      website = NULLIF(pg_catalog.btrim(p_card ->> 'website'), ''),
      blocks = v_blocks,
      tagline = NULLIF(pg_catalog.btrim(p_card ->> 'tagline'), ''),
      photo_url = NULLIF(pg_catalog.btrim(p_card ->> 'photoUrl'), ''),
      logo_url = NULLIF(pg_catalog.btrim(p_card ->> 'logoUrl'), ''),
      template = v_template,
      custom_styles = v_custom_styles,
      is_active = CASE WHEN v_card_live THEN true ELSE is_active END,
      nfc_enabled = CASE WHEN v_card_live THEN true ELSE nfc_enabled END,
      wallet_enabled = CASE WHEN v_card_live THEN true ELSE wallet_enabled END
    WHERE id = v_card_id AND user_id = v_user_id;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Linked card ownership mismatch' USING ERRCODE = '42501';
    END IF;
  END IF;

  IF v_subscription_id IS NOT NULL THEN
    SELECT * INTO v_subscription
    FROM public.subscriptions
    WHERE id = v_subscription_id AND user_id = v_user_id
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Linked subscription ownership mismatch' USING ERRCODE = '42501';
    END IF;
  ELSE
    SELECT * INTO v_subscription
    FROM public.subscriptions
    WHERE user_id = v_user_id
    FOR UPDATE;
    v_subscription_id := v_subscription.id;
  END IF;

  IF v_subscription_id IS NULL THEN
    INSERT INTO public.subscriptions (
      user_id, plan, status, price_cents, currency, expires_at, payment_method, notes
    ) VALUES (
      v_user_id,
      'premium',
      CASE WHEN v_is_cod THEN 'active' ELSE 'pending' END,
      v_price,
      v_currency,
      CASE WHEN v_is_cod THEN pg_catalog.now() + interval '1 year' ELSE NULL END,
      p_payment_method,
      'Commande NFC - ' || v_offer_name
    )
    ON CONFLICT (user_id) DO UPDATE SET
      plan = EXCLUDED.plan,
      status = EXCLUDED.status,
      price_cents = EXCLUDED.price_cents,
      currency = EXCLUDED.currency,
      expires_at = EXCLUDED.expires_at,
      payment_method = EXCLUDED.payment_method,
      notes = EXCLUDED.notes,
      updated_at = pg_catalog.now()
    RETURNING id INTO v_subscription_id;
  ELSIF v_is_cod THEN
    UPDATE public.subscriptions SET
      plan = 'premium',
      status = 'active',
      price_cents = v_price,
      currency = v_currency,
      expires_at = pg_catalog.now() + interval '1 year',
      payment_method = 'cod',
      notes = 'Commande NFC - ' || v_offer_name,
      updated_at = pg_catalog.now()
    WHERE id = v_subscription_id AND user_id = v_user_id;
  ELSIF NOT (v_subscription.plan = 'premium' AND v_subscription.status = 'active') THEN
    UPDATE public.subscriptions SET
      plan = 'premium',
      status = 'pending',
      price_cents = v_price,
      currency = v_currency,
      expires_at = NULL,
      payment_method = 'stripe',
      notes = 'Commande NFC en attente - ' || v_offer_name,
      updated_at = pg_catalog.now()
    WHERE id = v_subscription_id AND user_id = v_user_id;
  END IF;

  INSERT INTO public.orders (
    user_id, checkout_key, digital_card_id, subscription_id, order_items,
    quantity, unit_price_cents, total_price_cents, order_type, template,
    card_color, logo_url, currency, shipping_name, shipping_phone,
    shipping_address, shipping_city, shipping_postal_code, shipping_country,
    customer_email, payment_method, status, fulfillment_activated_at
  ) VALUES (
    v_user_id,
    p_checkout_key,
    v_card_id,
    v_subscription_id,
    pg_catalog.jsonb_build_array(pg_catalog.jsonb_build_object(
      'id', COALESCE(v_existing.order_items -> 0 ->> 'id', pg_catalog.gen_random_uuid()::text),
      'offerId', p_offer_id,
      'templateId', v_template,
      'creatorStyleId', v_style_id,
      'accentColor', v_accent_color,
      'templateName', 'Carte NFC i-Wasp ' || v_offer_name,
      'cardName', pg_catalog.btrim(p_card ->> 'firstName') || ' ' || pg_catalog.btrim(p_card ->> 'lastName'),
      'quantity', 1,
      'unitPriceCents', v_price,
      'logoUrl', NULLIF(pg_catalog.btrim(p_card ->> 'logoUrl'), '')
    )),
    1,
    v_price,
    v_price,
    'personalized'::public.order_type,
    v_template,
    v_accent_color,
    NULLIF(pg_catalog.btrim(p_card ->> 'logoUrl'), ''),
    v_currency,
    pg_catalog.btrim(p_card ->> 'firstName') || ' ' || pg_catalog.btrim(p_card ->> 'lastName'),
    NULLIF(pg_catalog.btrim(p_order ->> 'shippingPhone'), ''),
    NULLIF(pg_catalog.btrim(p_order ->> 'shippingAddress'), ''),
    NULLIF(pg_catalog.btrim(p_order ->> 'shippingCity'), ''),
    '',
    v_shipping_country,
    NULLIF(pg_catalog.btrim(COALESCE(p_order ->> 'customerEmail', p_card ->> 'email')), ''),
    p_payment_method,
    'pending'::public.order_status,
    CASE WHEN v_is_cod THEN pg_catalog.now() ELSE NULL END
  )
  ON CONFLICT (user_id, checkout_key) WHERE checkout_key IS NOT NULL
  DO UPDATE SET
    digital_card_id = EXCLUDED.digital_card_id,
    subscription_id = EXCLUDED.subscription_id,
    order_items = EXCLUDED.order_items,
    quantity = 1,
    unit_price_cents = EXCLUDED.unit_price_cents,
    total_price_cents = EXCLUDED.total_price_cents,
    order_type = EXCLUDED.order_type,
    template = EXCLUDED.template,
    card_color = EXCLUDED.card_color,
    logo_url = EXCLUDED.logo_url,
    currency = EXCLUDED.currency,
    shipping_name = EXCLUDED.shipping_name,
    shipping_phone = EXCLUDED.shipping_phone,
    shipping_address = EXCLUDED.shipping_address,
    shipping_city = EXCLUDED.shipping_city,
    shipping_postal_code = '',
    shipping_country = EXCLUDED.shipping_country,
    customer_email = EXCLUDED.customer_email,
    payment_method = EXCLUDED.payment_method,
    checkout_revision = orders.checkout_revision + CASE WHEN v_contract_changed THEN 1 ELSE 0 END,
    fulfillment_activated_at = CASE
      WHEN v_is_cod THEN pg_catalog.now()
      ELSE orders.fulfillment_activated_at
    END,
    updated_at = pg_catalog.now()
  RETURNING id INTO v_order_id;

  RETURN v_order_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.prepare_nfc_order(uuid, text, text, jsonb, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.prepare_nfc_order(uuid, text, text, jsonb, jsonb) TO anon, authenticated, service_role;
