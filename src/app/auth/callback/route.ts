import { createServerComponentClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerComponentClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Berhasil menukar kode dengan sesi
      // Redirect ke dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika terjadi error, redirect ke login dengan parameter error
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}