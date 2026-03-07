import Link from 'next/link'
import { createServerComponentClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
              Katalog Digital <span className="text-indigo-600">QR</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Ubah menu fisik menjadi katalog digital elegan yang dapat diakses instan melalui scan QR Code.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Dashboard
              </Link>
              ) : (
                <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Mulai Gratis
              </Link>
              )}
              <a href="#features" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tiga Langkah Mudah
            </h2>
            <p className="text-lg text-slate-600">
              Tidak perlu keahlian teknis. Hanya tiga langkah sederhana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Daftar', desc: 'Buat akun dengan email atau Google dalam 30 detik' },
              { step: '02', title: 'Upload Produk', desc: 'Tambahkan foto, nama, dan harga produk Anda' },
              { step: '03', title: 'Bagikan QR', desc: 'Scan QR untuk akses katalog digital Anda' },
            ].map((item) => (
              <div key={item.step} className="relative p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                <span className="text-6xl font-black text-indigo-100 absolute top-4 left-6">{item.step}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-12 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Mengubah Bisnis Anda?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Bergabunglah dengan ribuan UMKM yang telah menggunakan katalog digital.
          </p>
          {!user && (
            <Link href="/login" className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-slate-900 bg-white rounded-2xl hover:bg-slate-100 transition-all">
              Daftar Sekarang - Gratis!
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500">
            © 2024 QR Katalog Digital. Dibuat untuk UMKM Indonesia.
          </p>
        </div>
      </footer>
    </main>
  )
}
