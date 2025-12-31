-- Fix: Change view from SECURITY DEFINER to SECURITY INVOKER (safer)
DROP VIEW IF EXISTS public.public_cards;

CREATE VIEW public.public_cards 
WITH (security_invoker = true)
AS
SELECT 
  id,
  slug,
  first_name,
  last_name,
  title,
  company,
  location,
  website,
  tagline,
  photo_url,
  logo_url,
  template,
  social_links,
  blocks,
  (email IS NOT NULL AND email != '') AS has_email,
  (phone IS NOT NULL AND phone != '') AS has_phone,
  (linkedin IS NOT NULL AND linkedin != '') AS has_linkedin,
  (whatsapp IS NOT NULL AND whatsapp != '') AS has_whatsapp,
  (instagram IS NOT NULL AND instagram != '') AS has_instagram,
  (twitter IS NOT NULL AND twitter != '') AS has_twitter
FROM public.digital_cards
WHERE is_active = true;

-- Re-grant access
GRANT SELECT ON public.public_cards TO anon, authenticated;