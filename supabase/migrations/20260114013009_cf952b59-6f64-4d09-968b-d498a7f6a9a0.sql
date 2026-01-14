-- Add slug column to generated_websites for unique hosting URL
ALTER TABLE public.generated_websites 
ADD COLUMN slug TEXT UNIQUE;

-- Create index for fast slug lookups
CREATE INDEX idx_generated_websites_slug ON public.generated_websites(slug);

-- Add public policy for serving websites (anyone can view completed sites by slug)
CREATE POLICY "Anyone can view completed websites by slug"
  ON public.generated_websites FOR SELECT
  USING (status = 'completed' AND slug IS NOT NULL);

-- Function to generate a unique slug from business name
CREATE OR REPLACE FUNCTION public.generate_website_slug(p_business_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Create base slug from business name (lowercase, replace spaces/special chars with dashes)
  base_slug := lower(regexp_replace(trim(p_business_name), '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing dashes
  base_slug := trim(both '-' from base_slug);
  -- Limit length
  base_slug := left(base_slug, 50);
  
  new_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM public.generated_websites WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$;