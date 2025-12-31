-- Create secure function for vCard data (includes contact info for vCard generation only)
CREATE OR REPLACE FUNCTION public.get_vcard_data(p_slug text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'first_name', first_name,
    'last_name', last_name,
    'title', title,
    'company', company,
    'email', email,
    'phone', phone,
    'slug', slug
  )
  INTO v_result
  FROM public.digital_cards
  WHERE slug = p_slug AND is_active = true;

  RETURN v_result;
END;
$$;

-- Grant execute to public (needed for vCard download)
GRANT EXECUTE ON FUNCTION public.get_vcard_data(text) TO anon, authenticated;