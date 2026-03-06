# Skills Ecosystem & Tech Stack (Commit)

Dokumen ini mendefinisikan "Senjata" dan "Metode" yang digunakan dalam proyek **Commit** untuk memaksimalkan produktivitas menggunakan AI.

## 1. Core Tech Stack (The Engine)
Proyek ini dibangun menggunakan teknologi mutakhir untuk performa maksimal dan estetika tinggi.

### A. Next.js 16+ (React 19)
- **React Server Components (RSC):** Memaksimalkan kecepatan render dengan memproses logika di sisi server.
- **Server Actions:** Mengurangi kebutuhan API Routes tradisional untuk operasi database langsung.
- **React 19 Features:** Penggunaan `useTransition`, `useOptimistic`, dan `ref` yang lebih fleksibel.

### B. Tailwind CSS v4 (Alpha/Beta)
- **Zero-Config Engine:** Menggunakan engine JIT (Just-In-Time) baru yang lebih ringan dan cepat.
- **@theme directive:** Pengelolaan variabel CSS (Warna, Spacing, Font) yang lebih modern.
- **Backdrop Blur & Filters:** Digunakan secara intensif untuk efek Glassmorphism (iOS Style).

### C. Supabase (The Backend)
- **PostgreSQL with RLS:** Keamanan data tingkat tinggi di sisi database.
- **Supabase Auth (SSR):** Autentikasi yang dioptimalkan untuk Next.js App Router.
- **Real-time Engine:** Sinkronisasi status order atau inventaris toko secara instan.

## 2. AI Orchestration Skills (The Brain)
Metodologi kolaborasi antara Manusia (Hacker) dan AI (Gemini/Claude).

### A. Agentic Loop Strategy
- **Research Phase:** Menggunakan `grep_search` dan `codebase_investigator` untuk memahami dampak perubahan sebelum koding.
- **Execution Phase:** Perubahan kode secara "Surgical" (hanya pada baris yang diperlukan).
- **Validation Phase:** Menjalankan linting dan type-checking otomatis setelah setiap modifikasi.

### B. Memory Bank Management
- Menggunakan folder `.kilocode/rules/memory-bank/` untuk menyimpan status proyek jangka panjang.
- Memastikan AI selalu "ingat" keputusan arsitektur yang telah dibuat sebelumnya.

## 3. UI/UX Aesthetic Skills (The Face)
Prinsip desain untuk membangun branding "AI Productivity Hacker".

- **iOS Glassmorphism:** Implementasi layer transparan dengan efek `backdrop-blur-xl` dan border putih tipis (`border-white/20`).
- **Micro-Interactions:** Menggunakan Framer Motion untuk animasi bounce dan slide-in yang "smooth".
- **Dynamic Theming:** Perubahan skema warna (Light/Dark/Accent) yang responsif terhadap input user atau waktu.

## 4. Automation & Tooling
- **Supabase CLI:** Sinkronisasi skema database dari lokal ke cloud dalam satu perintah.
- **Custom Shell Scripts:** Automasi tugas membosankan seperti pembersihan aset atau ekstraksi metadata.
- **Web Artifacts:** Membuat demo interaktif untuk konten TikTok/IG Reels secara instan.
