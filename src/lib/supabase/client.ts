import { createBrowserClient } from '@supabase/ssr';

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
