# Database Schema (Supabase) - Multi-Tenant Architecture

Dokumen ini mendefinisikan skema basis data PostgreSQL untuk mendukung platform multi-tenant yang aman dan skalabel.

## Arsitektur: Shared Database with Row-Level Isolation
Semua tenant (organisasi) berbagi tabel yang sama, namun data diisolasi secara ketat menggunakan **Supabase Row Level Security (RLS)**.

## Tabel Utama

### 1. `profiles`
Data tambahan pengguna (ekstensi dari `auth.users`).
- `id` (UUID, PK): Relasi 1:1 dengan `auth.users`.
- `full_name` (Text): Nama lengkap pengguna.
- `avatar_url` (Text): URL foto profil.

### 2. `organizations`
Entitas bisnis utama (Brand).
- `id` (UUID, PK): ID unik organisasi.
- `name` (Text): Nama bisnis.
- `slug` (Text, Unique): Digunakan untuk URL (e.g., `commit.id/brand-slug`).
- `owner_id` (UUID): ID pemilik utama (FK ke `auth.users`).

### 3. `shops`
Cabang atau lokasi fisik spesifik di bawah organisasi.
- `id` (UUID, PK): ID unik cabang.
- `org_id` (UUID, FK): Relasi ke `organizations`.
- `name` (Text): Nama cabang (e.g., "Cabang Sudirman").
- `location_data` (JSONB): Koordinat, alamat, atau metadata lokasi lainnya.
- `is_active` (Boolean): Status operasional toko.

### 4. `memberships`
Manajemen akses berbasis peran (RBAC).
- `id` (UUID, PK)
- `user_id` (UUID): ID pengguna.
- `shop_id` (UUID, FK): Relasi ke `shops`.
- `role` (Enum): `Owner`, `Admin`, `Staff`.

### 5. `categories` & `products`
Inti dari katalog produk.
- `categories`: `id`, `shop_id`, `name`, `sort_order`, `is_visible`.
- `products`: `id`, `category_id`, `shop_id`, `name`, `price` (Numeric), `images` (JSONB), `is_visible`.
  - *Note: `price` menggunakan NUMERIC untuk akurasi finansial.*
  - *Note: `images` menggunakan JSONB untuk multiple URLs dan metadata (Alt text).*

### 6. `product_variants`
Opsi tambahan produk.
- `id`, `product_id` (FK), `name`, `additional_price` (Numeric).

### 7. `analytics_events`
Log interaksi pelanggan (Immutable).
- `id`, `shop_id`, `product_id`, `event_type` (view, click, order), `user_agent`, `created_at`.

### 8. `subscriptions`
Manajemen paket layanan per organisasi.
- `org_id` (FK), `plan_type` (Free, Pro), `status`, `current_period_end`.

---

## Keamanan & Optimasi
1.  **UUID**: Digunakan sebagai Kunci Primer (PK) untuk mencegah manipulasi ID melalui URL publik.
2.  **RLS Policies**:
    - **Akses Publik**: Hanya `SELECT` pada `shops`, `categories`, dan `products` (di mana `is_visible = true`).
    - **Akses Terotentikasi**: CRUD penuh diberikan jika `user_id` terdaftar di tabel `memberships` untuk `shop_id` yang relevan.
3.  **Indexes**: Indeks unik pada `organizations.slug` dan indeks pencarian pada `shop_id`/`product_id` untuk performa query yang cepat.
