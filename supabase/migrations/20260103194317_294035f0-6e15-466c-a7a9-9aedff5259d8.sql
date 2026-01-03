-- Add hide_branding column to digital_cards for white-label management
-- Only admins can set this to true (removes "Powered by i-Wasp.com" footer)

ALTER TABLE public.digital_cards 
ADD COLUMN IF NOT EXISTS hide_branding boolean NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.digital_cards.hide_branding IS 'White-label mode: hides "Powered by i-Wasp.com" footer. Admin-controlled only.';

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_digital_cards_hide_branding ON public.digital_cards(hide_branding) WHERE hide_branding = true;