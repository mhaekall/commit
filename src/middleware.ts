import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware untuk QR Katalog Digital UMKM
 * 
 * Fungsi utama:
 * 1. Menyegarkan (refresh) token otentikasi secara otomatis
 * 2. Memvalidasi token sesi pengguna menggunakan getClaims()
 * 3. Mengatur cookies untuk sesi yang valid
 * 
 * PENTING: Menggunakan getClaims() untuk validasi JWT di server,
 * BUKAN getSession() karena getSession() tidak menjamin keamanan
 * validasi signature JWT di sisi server.
 */

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Menyegarkan cookies untuk setiap request
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            supabaseResponse.cookies.set(name, value, options as CookieOptions);
          });
        },
      },
    }
  );

  // ============================================
  // VALIDASI TOKEN: Gunakan getClaims() untuk keamanan
  // ============================================
  // getClaims() memvalidasi JWT signature di sisi server
  // dan mengembalikan claims jika token valid
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError) {
    // Token tidak valid atau kedaluwarsa
    // Hapus sesi dan arahkan ke halaman login
    console.error('[Middleware] Claims validation error:', claimsError.message);
    
    await supabase.auth.signOut();
    
    // Jika request ingin mengakses route yang memerlukan auth,
    // arahkan ke halaman login
    const { pathname } = request.nextUrl;
    if (!pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    return supabaseResponse;
  }

  // ============================================
  // PERIKSA USER AKTIF
  // ============================================
  // Claims berisi payload JWT yang didekode
  // Jika userId ada, berarti user terautentikasi
  const userClaims = claimsData?.claims;
  const userId = userClaims?.sub;
  const userEmail = userClaims?.email as string | undefined;

  if (userId) {
    // User valid - lanjutkan request
    // Opsional: Refresh token jika hampir kedaluwarsa
    const { data: { session }, error: refreshError } = await supabase.auth.getSession();
    
    if (refreshError) {
      console.error('[Middleware] Session refresh error:', refreshError.message);
    }
    
    // Set header dengan info user untuk digunakan di server components
    supabaseResponse.headers.set('x-user-id', userId);
    supabaseResponse.headers.set('x-user-email', userEmail || '');
  } else {
    // User tidak terautentikasi
    // Biarkan request lanjut, tapi route protection dilakukan di level page/component
  }

  return supabaseResponse;
}

export const config = {
  /*
   * Matcher untuk route yang memerlukan middleware
   * Include: semua route API dan halaman yang memerlukan auth
   * 
   * Contoh:
   * - /dashboard/:path* - halaman dashboard
   * - /admin/:path* - halaman admin
   * - /api/:path* - semua API routes
   * - /(.*) - semua halaman (untuk global auth check)
   */
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
