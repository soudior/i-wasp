-- Add custom_styles column to digital_cards table
ALTER TABLE public.digital_cards 
ADD COLUMN IF NOT EXISTS custom_styles JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.digital_cards.custom_styles IS 'Stores custom style settings: colors, fonts, borders, shadows, theme';