-- Allow anonymous uploads to order-photos folder for order funnel
CREATE POLICY "Anyone can upload order photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'card-assets' 
  AND (storage.foldername(name))[1] = 'order-photos'
);

-- Allow public read access for order photos
CREATE POLICY "Public can read order photos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'card-assets'
  AND (storage.foldername(name))[1] = 'order-photos'
);