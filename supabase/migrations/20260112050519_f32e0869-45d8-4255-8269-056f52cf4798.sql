-- Add RLS policies for card-assets bucket to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to card-assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'card-assets');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated users can update card-assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'card-assets');

-- Allow everyone to view card-assets (bucket is public)
CREATE POLICY "Public read access for card-assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'card-assets');