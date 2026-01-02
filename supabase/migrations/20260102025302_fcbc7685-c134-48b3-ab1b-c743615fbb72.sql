-- Create leads_partenaires table for B2B partner applications
CREATE TABLE public.leads_partenaires (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salon_name TEXT NOT NULL,
  city TEXT NOT NULL,
  manicure_stations INTEGER DEFAULT 1,
  whatsapp TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  is_certified BOOLEAN DEFAULT false,
  certified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads_partenaires ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit partner applications
CREATE POLICY "Anyone can submit partner applications" 
ON public.leads_partenaires 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all partner leads
CREATE POLICY "Admins can view partner leads" 
ON public.leads_partenaires 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update partner leads
CREATE POLICY "Admins can update partner leads" 
ON public.leads_partenaires 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete partner leads
CREATE POLICY "Admins can delete partner leads" 
ON public.leads_partenaires 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_leads_partenaires_updated_at
BEFORE UPDATE ON public.leads_partenaires
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();