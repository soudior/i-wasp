CREATE TABLE public.amg_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  budget text,
  property_type text,
  objective text,
  message text,
  source text DEFAULT 'nfc',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.amg_leads TO authenticated;
GRANT INSERT ON public.amg_leads TO anon;
GRANT ALL ON public.amg_leads TO service_role;

ALTER TABLE public.amg_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit AMG leads"
ON public.amg_leads FOR INSERT
TO anon, authenticated
WITH CHECK (name IS NOT NULL AND name <> '' AND phone IS NOT NULL AND phone <> '');

CREATE POLICY "Admins can view AMG leads"
ON public.amg_leads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update AMG leads"
ON public.amg_leads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete AMG leads"
ON public.amg_leads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_amg_leads_updated_at
BEFORE UPDATE ON public.amg_leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();