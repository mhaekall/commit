import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase Client untuk Server Components
 * 
 * Gunakan client ini di Server Components, Server Actions, dan API Routes.
 * Client ini menangani cookies untuk mempertahankan sesi pengguna
 * antara request server-side.
 * 
 * Contoh penggunaan di Server Component:
 * ```tsx
 * import { createServerComponentClient } from '@/lib/supabase/server';
 * 
 * export default async function DashboardPage() {
 *   const supabase = await createServerComponentClient();
 *   
 *   const { data: { user } } = await supabase.auth.getUser();
 *   
 *   return <div>Welcome, {user?.email}</div>;
 * }
 * ```
 * 
 * Contoh penggunaan di Server Action:
 * ```tsx
 * 'use server';
 * 
 * import { createServerComponentClient } from '@/lib/supabase/server';
 * import { revalidatePath } from 'next/cache';
 * 
 * export async function createTodo(formData: FormData) {
 *   const supabase = await createServerComponentClient();
 *   
 *   const { data, error } = await supabase
 *     .from('todos')
 *     .insert({ title: formData.get('title') });
 *   
 *   if (error) throw new Error(error.message);
 *   
 *   revalidatePath('/dashboard');
 * }
 * ```
 */
export async function createServerComponentClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Handle error ketika called dari Server Component
            // Ini bisa terjadi jika middleware perlu me-set cookies
          }
        },
      },
    }
  );
}
