# Product Requirement Document (PRD) - QR Katalog Digital

## 1. Project Overview
**Name:** Commit (QR Katalog Digital)
**Version:** v0.1 (MVP Phase)
**Vision:** Platform menu & katalog visual estetik untuk UMKM (F&B, Boutique, Creative Services) yang dapat diakses instan melalui scan QR Code.
**Tagline:** "Daftar → Upload → Bagikan. Tiga langkah, selesai."

## 2. Masalah & Solusi
### Masalah (Pemilik Bisnis):
- Biaya cetak menu fisik mahal saat ada perubahan harga.
- Keterbatasan teknis untuk membangun website sendiri.
- Tampilan WhatsApp Business/Linktree kurang premium untuk branding estetik.
- Minim data analitik produk mana yang paling diminati.

### Solusi:
- Katalog digital yang dapat diupdate real-time.
- Antarmuka modern bergaya iOS (Glassmorphism).
- Generasi QR Code otomatis untuk setiap toko.
- Sistem analitik view & klik per produk.

## 3. Fitur Utama (MVP)
### A. Registrasi & Manajemen Toko
- Profil Toko: Nama, logo, deskripsi, kategori bisnis.
- Katalog: CRUD kategori dan produk (foto, nama, harga, deskripsi).
- Manajemen Varian: Opsi tambahan (ukuran, rasa, rasa) dengan harga tambahan.

### B. Halaman Publik (Storefront)
- **Aesthetic View:** Mobile-first, iOS-style UI dengan efek Glassmorphism.
- **Fast Access:** Performa tinggi (SSG/ISR) untuk pemuatan halaman < 2 detik.
- **WhatsApp Integration:** Pesanan dikirim langsung ke WhatsApp toko dengan format terstruktur.

### C. QR Code & Pembayaran
- **Auto-Generate QR:** QR Code otomatis yang mengarah ke URL katalog.
- **Embed Payment QR:** Pemilik bisa mengunggah gambar QRIS/GoPay sendiri untuk ditampilkan di katalog (tanpa integrasi gateway pihak ketiga di MVP).

### D. SEO & Visibilitas
- **Dynamic Metadata:** Meta tag dinamis per produk untuk ranking pencarian lokal.
- **Structured Data:** Implementasi JSON-LD (Schema.org) untuk Rich Snippets di Google.
- **Custom Slugs:** URL profesional (e.g., `commit.id/toko-anda`).

## 4. Model Bisnis (Freemium)
- **Tier Gratis:** 1 toko, maks 10 produk, branding "Commit" di footer.
- **Tier Premium:** Produk tak terbatas, custom tema, analytics lengkap, hapus branding, prioritas support.

## 5. Technical Stack
- **Frontend:** Next.js 16 (React 19), Tailwind CSS v4, Framer Motion.
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **Infrastruktur:** Vercel (Hosting), Resend (Email Notif).

## 6. Roadmap Pengembangan
- **Minggu 1:** Setup Proyek & Database Schema.
- **Minggu 2-3:** Dashboard Pemilik (CRUD Produk & Profil).
- **Minggu 4:** Halaman Katalog Publik & Generate QR.
- **Minggu 5-6:** Custom Themes & Analytics Dasar.
- **Minggu 7-8:** Beta Testing & Bugfixing.
