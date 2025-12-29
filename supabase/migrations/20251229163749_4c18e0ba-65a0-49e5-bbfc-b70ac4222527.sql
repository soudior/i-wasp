-- Add phone number field to orders table for COD contact
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;