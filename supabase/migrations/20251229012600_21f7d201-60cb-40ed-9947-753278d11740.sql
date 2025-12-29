-- Create storage bucket for card assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('card-assets', 'card-assets', true);

-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload card assets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'card-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their card assets"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'card-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their card assets"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'card-assets' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to card assets
CREATE POLICY "Public can view card assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'card-assets');