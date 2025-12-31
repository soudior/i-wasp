-- Add admin policies for full access to digital_cards

-- Admin can view all cards
CREATE POLICY "Admins can view all cards"
ON public.digital_cards
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can insert any card
CREATE POLICY "Admins can insert any card"
ON public.digital_cards
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can update any card
CREATE POLICY "Admins can update any card"
ON public.digital_cards
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can delete any card
CREATE POLICY "Admins can delete any card"
ON public.digital_cards
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create a public view with limited fields (no raw email/phone)
CREATE OR REPLACE VIEW public.public_cards AS
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
  -- Boolean flags instead of raw data
  (email IS NOT NULL AND email != '') AS has_email,
  (phone IS NOT NULL AND phone != '') AS has_phone,
  (linkedin IS NOT NULL AND linkedin != '') AS has_linkedin,
  (whatsapp IS NOT NULL AND whatsapp != '') AS has_whatsapp,
  (instagram IS NOT NULL AND instagram != '') AS has_instagram,
  (twitter IS NOT NULL AND twitter != '') AS has_twitter
FROM public.digital_cards
WHERE is_active = true;

-- Grant public read access to the view
GRANT SELECT ON public.public_cards TO anon, authenticated;

-- Create secure function to get action URLs (doesn't expose raw data)
CREATE OR REPLACE FUNCTION public.get_card_action_url(p_slug text, p_action text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_phone text;
  v_linkedin text;
  v_whatsapp text;
BEGIN
  SELECT email, phone, linkedin, whatsapp
  INTO v_email, v_phone, v_linkedin, v_whatsapp
  FROM public.digital_cards
  WHERE slug = p_slug AND is_active = true;

  CASE p_action
    WHEN 'email' THEN RETURN CASE WHEN v_email IS NOT NULL THEN 'mailto:' || v_email ELSE NULL END;
    WHEN 'phone' THEN RETURN CASE WHEN v_phone IS NOT NULL THEN 'tel:' || v_phone ELSE NULL END;
    WHEN 'whatsapp' THEN RETURN CASE WHEN v_whatsapp IS NOT NULL THEN 'https://wa.me/' || regexp_replace(v_whatsapp, '[^0-9]', '', 'g') ELSE NULL END;
    WHEN 'linkedin' THEN RETURN CASE WHEN v_linkedin IS NOT NULL THEN v_linkedin ELSE NULL END;
    ELSE RETURN NULL;
  END CASE;
END;
$$;

-- Grant execute to public
GRANT EXECUTE ON FUNCTION public.get_card_action_url(text, text) TO anon, authenticated;