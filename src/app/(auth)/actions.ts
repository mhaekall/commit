'use server';

import { createServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ActionResult = {
  error?: string;
  success?: boolean;
};

/**
 * Login dengan Email dan Password
 * Menggunakan Supabase Auth signInWithPassword
 */
export async function signInWithEmail(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' };
  }

  const supabase = await createServerComponentClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Daftar (Sign Up) dengan Email dan Password
 * Menggunakan Supabase Auth signUp
 * Setelah signup, user akan menerima email verifikasi
 */
export async function signUpWithEmail(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi' };
  }

  // Validasi password minimal 6 karakter
  if (password.length < 6) {
    return { error: 'Password minimal 6 karakter' };
  }

  const supabase = await createServerComponentClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Optional: Email confirmation redirect
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Jika signup berhasil, kita tidak langsung redirect
  // Biarkan client component menangani pesan sukses
  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Logout - Menghapus sesi user
 */
export async function signOut() {
  const supabase = await createServerComponentClient();
  
  await supabase.auth.signOut();
  
  revalidatePath('/', 'layout');
  redirect('/login');
}