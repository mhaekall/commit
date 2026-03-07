-- Storage Policies for Image Buckets
-- Run this AFTER creating buckets via Supabase Dashboard UI
--
-- To create buckets:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create new bucket: shop-logos (public, 5MB limit)
-- 3. Create new bucket: qris-images (public, 5MB limit)
-- 4. Create new bucket: product-images (public, 10MB limit)

-- Allow public read access to all image buckets
CREATE POLICY "Public can view shop logos" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'shop-logos');

CREATE POLICY "Public can view QRIS images" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'qris-images');

CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload shop logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'shop-logos');

CREATE POLICY "Users can upload QRIS images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'qris-images');

CREATE POLICY "Users can upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete shop logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'shop-logos' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

CREATE POLICY "Users can delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'product-images' 
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );
