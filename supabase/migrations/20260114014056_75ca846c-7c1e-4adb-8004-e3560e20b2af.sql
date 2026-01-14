-- Create storage bucket for generated website images
INSERT INTO storage.buckets (id, name, public)
VALUES ('website-images', 'website-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public can view website images"
ON storage.objects FOR SELECT
USING (bucket_id = 'website-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload website images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'website-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update website images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'website-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete website images"
ON storage.objects FOR DELETE
USING (bucket_id = 'website-images' AND auth.role() = 'authenticated');