-- Create table for storing generated websites
CREATE TABLE public.generated_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.website_proposals(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, generating, completed, failed
  html_content TEXT,
  css_content TEXT,
  js_content TEXT,
  full_page_html TEXT,
  preview_url TEXT,
  generation_log TEXT,
  generated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_websites ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all generated websites"
  ON public.generated_websites FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert generated websites"
  ON public.generated_websites FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update generated websites"
  ON public.generated_websites FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete generated websites"
  ON public.generated_websites FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Users can view their own generated website (via proposal)
CREATE POLICY "Users can view their generated websites"
  ON public.generated_websites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.website_proposals wp
      WHERE wp.id = generated_websites.proposal_id
      AND (wp.user_id = auth.uid() OR wp.session_id = (current_setting('request.headers', true)::json ->> 'x-session-id'))
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_generated_websites_updated_at
  BEFORE UPDATE ON public.generated_websites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_generated_websites_proposal_id ON public.generated_websites(proposal_id);
CREATE INDEX idx_generated_websites_status ON public.generated_websites(status);