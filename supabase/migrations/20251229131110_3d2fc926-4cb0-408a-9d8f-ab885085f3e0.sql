-- Add social_links JSONB column to digital_cards table
-- This stores an array of social network links with type, value, networkId, etc.
ALTER TABLE public.digital_cards 
ADD COLUMN social_links JSONB DEFAULT '[]'::jsonb;

-- Add a comment for documentation
COMMENT ON COLUMN public.digital_cards.social_links IS 'Array of social links: [{id, networkId, value}]';