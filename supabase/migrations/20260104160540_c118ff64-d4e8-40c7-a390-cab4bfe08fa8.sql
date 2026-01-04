-- Update get_public_card function to include custom_styles
CREATE OR REPLACE FUNCTION public.get_public_card(p_slug text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    'custom_styles', custom_styles,
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
$function$;