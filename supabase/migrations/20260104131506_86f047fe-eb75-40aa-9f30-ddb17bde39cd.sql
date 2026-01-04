-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for brand-assets bucket
-- Anyone can view (public assets)
CREATE POLICY "Public can view brand assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'brand-assets');

-- Only admins can upload/modify brand assets
CREATE POLICY "Admins can upload brand assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'brand-assets' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update brand assets"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'brand-assets' 
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete brand assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'brand-assets' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Create brand_assets metadata table
CREATE TABLE public.brand_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('logo_svg', 'logo_png', 'logo_pdf', 'card_front', 'card_back')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  is_locked BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(asset_type)
);

-- Enable RLS
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;

-- Everyone can view brand assets
CREATE POLICY "Anyone can view brand assets"
ON public.brand_assets
FOR SELECT
USING (true);

-- Only admins can modify brand assets
CREATE POLICY "Admins can insert brand assets"
ON public.brand_assets
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brand assets"
ON public.brand_assets
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brand assets"
ON public.brand_assets
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for updated_at
CREATE TRIGGER update_brand_assets_updated_at
BEFORE UPDATE ON public.brand_assets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();