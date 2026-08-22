-- Order photos are now uploaded only after authentication below the user's UUID.
DROP POLICY IF EXISTS "Anyone can upload order photos" ON storage.objects;
