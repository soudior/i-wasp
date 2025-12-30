-- Add WhatsApp column to digital_cards table
ALTER TABLE public.digital_cards 
ADD COLUMN IF NOT EXISTS whatsapp text;