# Active Context: QR Katalog Digital UMKM

## Current State

**Project Status**: ✅ Supabase Integration Complete

Proyek "Katalog Digital QR UMKM" dengan Next.js 16 dan Supabase SSR telah dikonfigurasi. Siap untuk pengembangan fitur katalog digital dan QR code.

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

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `.env.local` | Supabase credentials | ✅ Ready (needs real values) |
| `src/lib/supabase/client.ts` | Browser/client-side Supabase client | ✅ Ready |
| `src/lib/supabase/server.ts` | Server-side Supabase client | ✅ Ready |
| `src/middleware.ts` | Auth token refresh & validation | ✅ Ready |
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

Proyek siap untuk pengembangan fitur:
1. Halaman katalog produk UMKM
2. QR code generation untuk produk
3. Dashboard admin untuk manajemen produk
4. Sistem otentikasi user

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

- [ ] Add Supabase Auth UI
- [ ] Add QR code generation library
- [ ] Add product catalog pages
- [ ] Add admin dashboard

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-03-06 | Supabase integration - client, server, middleware with getClaims() |

