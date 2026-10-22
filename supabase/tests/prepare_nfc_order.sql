-- Calls the real prepare_nfc_order function. The server clock must already be
-- 2026-10-23 (launch) or on/after 2026-12-01 (official grid). The script
-- scripts/test-prepare-nfc-order.sh sets that clock with libfaketime.
\set ON_ERROR_STOP on

DO $$
DECLARE
  v_now timestamptz := pg_catalog.now();
  v_launch boolean := v_now <= timestamptz '2026-11-30 23:59:59+01';
  v_phase text;
  v_offer text;
  v_currency text;
  v_cents integer;
  v_name text;
  v_user uuid;
  v_key uuid;
  v_order uuid;
  v_replay uuid;
  v_card jsonb;
  v_body jsonb;
  v_row public.orders%ROWTYPE;
  v_card_row public.digital_cards%ROWTYPE;
  v_sub public.subscriptions%ROWTYPE;
  v_country text;
  v_count integer;
BEGIN
  IF v_now >= timestamptz '2026-10-23 00:00:00+00'
     AND v_now < timestamptz '2026-10-24 00:00:00+00' THEN
    v_phase := 'launch';
    IF NOT v_launch THEN
      RAISE EXCEPTION 'clock % is inside 2026-10-23 but the launch predicate is false', v_now;
    END IF;
  ELSIF v_now >= timestamptz '2026-12-01 00:00:00+00' THEN
    v_phase := 'standard';
    IF v_launch THEN
      RAISE EXCEPTION 'clock % is after the offer but the launch predicate is still true', v_now;
    END IF;
  ELSE
    RAISE EXCEPTION 'set the Postgres clock to 2026-10-23 or after 2026-12-01 (now=%)', v_now;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'prepare_nfc_order'
      AND position('pg_catalog.coalesce' IN lower(p.prosrc)) > 0
  ) THEN
    RAISE EXCEPTION 'prepare_nfc_order still contains a schema-qualified coalesce';
  END IF;

  IF NOT has_function_privilege(
    'authenticated',
    'public.prepare_nfc_order(uuid, text, text, jsonb, jsonb)',
    'EXECUTE'
  ) THEN
    RAISE EXCEPTION 'authenticated cannot execute prepare_nfc_order';
  END IF;

  FOREACH v_offer IN ARRAY ARRAY['essentiel', 'signature', 'alliance', 'duo', 'team'] LOOP
    FOREACH v_currency IN ARRAY ARRAY['MAD', 'EUR'] LOOP
      v_cents := CASE
        WHEN v_offer = 'essentiel' AND v_currency = 'MAD' THEN 19900
        WHEN v_offer = 'essentiel' AND v_currency = 'EUR' THEN 2900
        WHEN v_offer = 'signature' AND v_currency = 'MAD' AND v_launch THEN 24900
        WHEN v_offer = 'signature' AND v_currency = 'MAD' THEN 34900
        WHEN v_offer = 'signature' AND v_currency = 'EUR' AND v_launch THEN 3500
        WHEN v_offer = 'signature' AND v_currency = 'EUR' THEN 4900
        WHEN v_offer = 'alliance' AND v_currency = 'MAD' THEN 59900
        WHEN v_offer = 'alliance' AND v_currency = 'EUR' THEN 7900
        WHEN v_offer = 'duo' AND v_launch AND v_currency = 'MAD' THEN 54900
        WHEN v_offer = 'duo' AND v_launch AND v_currency = 'EUR' THEN 7900
        WHEN v_offer = 'team' AND v_currency = 'MAD' AND v_launch THEN 99900
        WHEN v_offer = 'team' AND v_currency = 'MAD' THEN 129900
        WHEN v_offer = 'team' AND v_currency = 'EUR' THEN 11900
        ELSE NULL
      END;
      v_name := CASE v_offer
        WHEN 'essentiel' THEN 'Essentielle'
        WHEN 'signature' THEN 'Professionnelle'
        WHEN 'alliance' THEN 'Prestige'
        WHEN 'duo' THEN 'DUO'
        WHEN 'team' THEN 'TEAM'
      END;

      v_user := gen_random_uuid();
      v_key := gen_random_uuid();
      INSERT INTO auth.users (id, email) VALUES (v_user, v_user::text || '@nfc-test.invalid');
      PERFORM set_config('request.jwt.claim.sub', v_user::text, true);

      v_card := jsonb_build_object(
        'styleId', 'signature',
        'template', 'dark-luxury',
        'accentColor', '#B8860B',
        'firstName', 'Amina',
        'lastName', 'Alaoui',
        'publish', true,
        'email', 'public@example.invalid'
      );
      v_body := jsonb_build_object(
        'currency', v_currency,
        'customerEmail', 'buyer@example.invalid',
        'shippingPhone', '+212600000000',
        'shippingAddress', '1 rue des tests',
        'shippingCity', CASE WHEN v_currency = 'MAD' THEN 'Casablanca' ELSE 'Paris' END,
        'shippingCountry', CASE WHEN v_currency = 'EUR' THEN 'FR' ELSE 'MA' END
      );

      IF v_offer = 'duo' AND NOT v_launch THEN
        BEGIN
          EXECUTE 'SET LOCAL ROLE authenticated';
          PERFORM public.prepare_nfc_order(v_key, v_offer, 'stripe', v_card, v_body);
          EXECUTE 'RESET ROLE';
          RAISE EXCEPTION 'DUO % was stored after the launch offer', v_currency;
        EXCEPTION
          WHEN SQLSTATE '22023' THEN
            EXECUTE 'RESET ROLE';
        END;
        CONTINUE;
      END IF;

      EXECUTE 'SET LOCAL ROLE authenticated';
      v_order := public.prepare_nfc_order(v_key, v_offer, 'stripe', v_card, v_body);
      v_replay := public.prepare_nfc_order(v_key, v_offer, 'stripe', v_card, v_body);
      EXECUTE 'RESET ROLE';

      IF v_order IS NULL OR v_replay IS DISTINCT FROM v_order THEN
        RAISE EXCEPTION '% % did not replay the same order (%/%)', v_phase, v_offer, v_order, v_replay;
      END IF;

      SELECT * INTO v_row FROM public.orders WHERE id = v_order;
      IF NOT FOUND THEN
        RAISE EXCEPTION '% % % order row missing', v_phase, v_offer, v_currency;
      END IF;
      v_country := CASE WHEN v_currency = 'MAD' THEN 'MA' ELSE 'FR' END;
      IF v_row.user_id IS DISTINCT FROM v_user
         OR v_row.checkout_key IS DISTINCT FROM v_key
         OR v_row.currency IS DISTINCT FROM v_currency
         OR v_row.unit_price_cents IS DISTINCT FROM v_cents
         OR v_row.total_price_cents IS DISTINCT FROM v_cents
         OR v_row.quantity IS DISTINCT FROM 1
         OR v_row.checkout_revision IS DISTINCT FROM 1
         OR v_row.payment_method IS DISTINCT FROM 'stripe'
         OR v_row.status IS DISTINCT FROM 'pending'::public.order_status
         OR v_row.paid_at IS NOT NULL
         OR v_row.digital_card_id IS NULL
         OR v_row.subscription_id IS NULL
         OR v_row.customer_email IS DISTINCT FROM 'buyer@example.invalid'
         OR v_row.shipping_country IS DISTINCT FROM v_country
      THEN
        RAISE EXCEPTION '% % % stored % % key % card % sub % country %',
          v_phase, v_offer, v_currency, v_row.currency, v_row.total_price_cents,
          v_row.checkout_key, v_row.digital_card_id, v_row.subscription_id, v_row.shipping_country;
      END IF;
      IF jsonb_array_length(v_row.order_items) IS DISTINCT FROM 1
         OR v_row.order_items -> 0 ->> 'offerId' IS DISTINCT FROM v_offer
         OR v_row.order_items -> 0 ->> 'templateName' IS DISTINCT FROM ('Carte NFC i-Wasp ' || v_name)
         OR (v_row.order_items -> 0 ->> 'unitPriceCents')::integer IS DISTINCT FROM v_cents
         OR (v_row.order_items -> 0 ->> 'quantity')::integer IS DISTINCT FROM 1
      THEN
        RAISE EXCEPTION '% % % order item mismatch: %', v_phase, v_offer, v_currency, v_row.order_items;
      END IF;

      SELECT * INTO v_card_row FROM public.digital_cards WHERE id = v_row.digital_card_id;
      IF v_card_row.user_id IS DISTINCT FROM v_user
         OR v_card_row.first_name IS DISTINCT FROM 'Amina'
         OR v_card_row.is_active IS DISTINCT FROM false
         OR v_card_row.template IS DISTINCT FROM 'dark-luxury'
      THEN
        RAISE EXCEPTION '% % % card linkage mismatch', v_phase, v_offer, v_currency;
      END IF;

      SELECT * INTO v_sub FROM public.subscriptions WHERE id = v_row.subscription_id;
      IF v_sub.user_id IS DISTINCT FROM v_user
         OR v_sub.plan IS DISTINCT FROM 'premium'
         OR v_sub.status IS DISTINCT FROM 'pending'
         OR v_sub.currency IS DISTINCT FROM v_currency
         OR v_sub.price_cents IS DISTINCT FROM v_cents
         OR v_sub.payment_method IS DISTINCT FROM 'stripe'
      THEN
        RAISE EXCEPTION '% % % subscription linkage mismatch (% % %)',
          v_phase, v_offer, v_currency, v_sub.currency, v_sub.price_cents, v_sub.status;
      END IF;
    END LOOP;
  END LOOP;

  SELECT count(*) INTO v_count FROM public.orders;
  IF v_phase = 'launch' AND v_count IS DISTINCT FROM 10 THEN
    RAISE EXCEPTION 'launch phase stored % orders, expected 10', v_count;
  END IF;
  IF v_phase = 'standard' AND v_count IS DISTINCT FROM 8 THEN
    RAISE EXCEPTION 'standard phase stored % orders, expected 8 (DUO hidden)', v_count;
  END IF;

  RAISE NOTICE 'PREPARE_NFC_ORDER_OK phase=% now=% orders=%', v_phase, v_now, v_count;
END $$;
