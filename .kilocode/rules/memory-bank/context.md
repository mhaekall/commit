# Active Context: QR Katalog Digital UMKM

## Current State

**Project Status**: ✅ Authentication System Complete

Proyek "Katalog Digital QR UMKM" dengan Next.js 16 dan Supabase SSR telah dikonfigurasi dengan sistem otentikasi lengkap.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Supabase (@supabase/supabase-js, @supabase/ssr) installation
- [x] .env.local configuration template
- [x] lib/supabase/client.ts - Browser client (createBrowserClient)
- [x] lib/supabase/server.ts - Server client (createServerClient)
- [x] middleware.ts - Auth token refresh with getClaims() validation
- [x] **Authentication UI & Logic**:
  - [x] src/app/(auth)/login/page.tsx - Login page with Google OAuth + Email/Password
  - [x] src/app/(auth)/actions.ts - Server Actions (signInWithEmail, signUpWithEmail, signOut)
  - [x] src/app/auth/callback/route.ts - OAuth callback handler, redirects to /dashboard

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `.env.local` | Supabase credentials | ✅ Ready (needs real values) |
| `src/lib/supabase/client.ts` | Browser/client-side Supabase client | ✅ Ready |
| `src/lib/supabase/server.ts` | Server-side Supabase client | ✅ Ready |
| `src/middleware.ts` | Auth token refresh & validation | ✅ Ready |
| `src/app/(auth)/login/page.tsx` | Login page with OAuth + Email/Password | ✅ Ready |
| `src/app/(auth)/actions.ts` | Server Actions for auth | ✅ Ready |
| `src/app/auth/callback/route.ts` | OAuth callback handler | ✅ Ready |
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

Proyek siap untuk pengembangan fitur:
1. Sistem otentikasi user
2. Halaman dashboard (/dashboard)
3. QR code generation untuk produk
4. Admin dashboard untuk manajemen produk

## Quick Start Guide

### Konfigurasi Awal

1. Buat proyek Supabase di https://supabase.com
2. Isi `.env.local` dengan credentials dari Supabase Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Menggunakan Supabase Client

**Client Component (Browser):**
```tsx
'use client';
import { createClientComponentClient } from '@/lib/supabase/client';
```

**Server Component / Server Action:**
```tsx
import { createServerComponentClient } from '@/lib/supabase/server';
```

### Menambahkan halaman baru:

Buat file di `src/app/[route]/page.tsx`

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Pending Improvements

- [ ] Add dashboard page (/dashboard)
- [ ] Add QR code generation library
- [ ] Add product catalog pages
- [ ] Add admin dashboard

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-06 | Supabase integration - client, server, middleware with getClaims() |
| 2026-03-06 | Authentication system - login page, server actions, OAuth callback |

