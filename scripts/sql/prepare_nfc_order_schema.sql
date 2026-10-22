-- Minimal schema so 20261022180000_prepare_nfc_order_launch_grid.sql can be
-- applied on a vanilla Postgres the way Supabase would apply it on top of
-- the existing orders, subscriptions and digital_cards tables.
-- Roles anon / authenticated / service_role exist in Supabase and are
-- required by the migration's GRANT.

CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  email text
);

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'in_production', 'shipped', 'delivered');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type') THEN
    CREATE TYPE public.order_type AS ENUM ('standard', 'personalized');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.digital_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  title text,
  company text,
  email text,
  phone text,
  whatsapp text,
  instagram text,
  linkedin text,
  website text,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  tagline text,
  photo_url text,
  logo_url text,
  template text NOT NULL DEFAULT 'default',
  custom_styles jsonb,
  is_active boolean NOT NULL DEFAULT true,
  nfc_enabled boolean NOT NULL DEFAULT true,
  wallet_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'MAD',
  expires_at timestamptz,
  payment_method text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_plan_check CHECK (plan IN ('free', 'premium')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'cancelled', 'expired'))
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  quantity integer NOT NULL DEFAULT 1,
  order_type public.order_type NOT NULL DEFAULT 'standard',
  template text NOT NULL DEFAULT 'iwasp-signature',
  card_color text NOT NULL DEFAULT 'white',
  logo_url text,
  unit_price_cents integer NOT NULL,
  total_price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status public.order_status NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text DEFAULT 'FR',
  order_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  customer_email text,
  payment_method text NOT NULL DEFAULT 'cod',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  year_prefix text;
  sequence_num integer;
BEGIN
  year_prefix := to_char(now(), 'YYMM');
  SELECT coalesce(max(substring(order_number FROM 5)::integer), 0) + 1
  INTO sequence_num
  FROM public.orders
  WHERE order_number LIKE year_prefix || '%';
  NEW.order_number := year_prefix || lpad(sequence_num::text, 4, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS generate_order_number_trigger ON public.orders;
CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION public.generate_order_number();
