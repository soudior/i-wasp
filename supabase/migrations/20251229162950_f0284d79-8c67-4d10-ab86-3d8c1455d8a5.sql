-- Add blocks column to digital_cards table for the new modular block system
ALTER TABLE public.digital_cards 
ADD COLUMN IF NOT EXISTS blocks jsonb DEFAULT '[]'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN public.digital_cards.blocks IS 'Array of CardBlock objects for the modular card editor system. Each block has type, visibility, order, and data.';