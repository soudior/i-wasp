-- Fix: Restrict public access to digital_cards - remove direct public SELECT
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Anyone can view active cards by slug" ON public.digital_cards;

-- Create a restrictive policy that only allows authenticated users or via functions
-- Public access should go through the public_cards view and get_card_action_url function
CREATE POLICY "Authenticated users can view active cards"
ON public.digital_cards
FOR SELECT
TO authenticated
USING (is_active = true);

-- Create a secure function for public card lookup (returns limited fields only)
CREATE OR REPLACE FUNCTION public.get_public_card(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', id,
    'slug', slug,
    'first_name', first_name,
    'last_name', last_name,
    'title', title,
    'company', company,
    'location', location,
    'website', website,
    'tagline', tagline,
    'photo_url', photo_url,
    'logo_url', logo_url,
    'template', template,
    'social_links', social_links,
    'blocks', blocks,
    'has_email', (email IS NOT NULL AND email != ''),
    'has_phone', (phone IS NOT NULL AND phone != ''),
    'has_linkedin', (linkedin IS NOT NULL AND linkedin != ''),
    'has_whatsapp', (whatsapp IS NOT NULL AND whatsapp != ''),
    'has_instagram', (instagram IS NOT NULL AND instagram != ''),
    'has_twitter', (twitter IS NOT NULL AND twitter != '')
  )
  INTO v_result
  FROM public.digital_cards
  WHERE slug = p_slug AND is_active = true;

  RETURN v_result;
END;
$$;

-- Grant execute to public
GRANT EXECUTE ON FUNCTION public.get_public_card(text) TO anon, authenticated;

-- Create function to increment view count securely
CREATE OR REPLACE FUNCTION public.increment_card_view(p_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.digital_cards
  SET view_count = view_count + 1
  WHERE slug = p_slug AND is_active = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_card_view(text) TO anon, authenticated;