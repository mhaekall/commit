import { createBrowserClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Client untuk Client Components (Browser)
 * 
 * Gunakan client ini di komponen React yang berjalan di browser.
 * Client ini menangani otentikasi dan interaksi dengan Supabase
 * dari sisi client (misalnya: form login, fetching data user, dll).
 * 
 * Contoh penggunaan:
 * ```tsx
 * 'use client';
 * 
 * import { createClientComponentClient } from '@/lib/supabase/client';
 * 
 * export default function LoginForm() {
 *   const supabase = createClientComponentClient();
 *   
 *   const handleLogin = async () => {
 *     const { data, error } = await supabase.auth.signInWithOAuth({...});
 *   };
 *   
 *   return <button onClick={handleLogin}>Login</button>;
 * }
 * ```
 */
export function createClientComponentClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Upload an image to a storage bucket (client-side)
 */
export async function uploadImage(
  bucket: 'shop-logos' | 'qris-images' | 'product-images',
  file: File,
  userId: string
): Promise<{ url: string; error: Error | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  
  if (error) {
    return { url: '', error: error as Error };
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  return { url: publicUrl, error: null };
}

/**
 * Delete an image from a storage bucket
 */
export async function deleteImage(
  bucket: 'shop-logos' | 'qris-images' | 'product-images',
  imageUrl: string
): Promise<{ error: Error | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Extract the file path from the URL
  const urlParts = imageUrl.split('/storage/v1/object/public/');
  if (urlParts.length < 2) {
    return { error: new Error('Invalid image URL') };
  }
  
  const filePath = urlParts[1];
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
  
  return { error: error as Error | null };
}
