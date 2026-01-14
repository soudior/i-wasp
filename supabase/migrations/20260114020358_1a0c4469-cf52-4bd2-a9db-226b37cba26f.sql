-- Create table for website version history
CREATE TABLE public.website_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES public.generated_websites(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  full_page_html TEXT NOT NULL,
  customizations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  label TEXT,
  is_auto_save BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX idx_website_versions_website_id ON public.website_versions(website_id);
CREATE INDEX idx_website_versions_created_at ON public.website_versions(website_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.website_versions ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage website versions"
ON public.website_versions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can view versions of their websites
CREATE POLICY "Users can view their website versions"
ON public.website_versions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM generated_websites gw
    JOIN website_proposals wp ON wp.id = gw.proposal_id
    WHERE gw.id = website_versions.website_id
    AND (wp.user_id = auth.uid() OR wp.session_id = (current_setting('request.headers'::text, true)::json->>'x-session-id'))
  )
);