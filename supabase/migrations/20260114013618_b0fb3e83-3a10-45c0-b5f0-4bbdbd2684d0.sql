-- Add customizations column to store editable content
ALTER TABLE public.generated_websites 
ADD COLUMN customizations JSONB DEFAULT '{}'::jsonb;

-- Add published status to track if site has been published with customizations
ALTER TABLE public.generated_websites 
ADD COLUMN is_published BOOLEAN DEFAULT false;

-- Add published_at timestamp
ALTER TABLE public.generated_websites 
ADD COLUMN published_at TIMESTAMPTZ;

-- Add comment for documentation
COMMENT ON COLUMN public.generated_websites.customizations IS 'Stores user customizations: {texts: {selector: value}, colors: {primary: hex, ...}, images: {selector: url}}';
