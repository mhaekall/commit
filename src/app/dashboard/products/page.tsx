import { createServerComponentClient } from '@/lib/supabase/server';
import ProductForm from './product-form';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createServerComponentClient();

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Fetch products for this owner's shop
  // We join organizations -> shops -> products
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      shops!inner(
        organizations!inner(owner_id)
      )
    `)
    .eq('shops.organizations.owner_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      {/* Tombol Tambah & Judul (Client Component) */}
      <ProductForm />

      {/* Daftar Produk (Server Rendered) */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative aspect-square bg-slate-100">
                {product.images && product.images[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">No Image</div>
                )}
                {!product.is_visible && (
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    DIPERSEMBUNYIKAN
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                <p className="text-indigo-600 font-bold mt-1">
                  Rp {new Intl.NumberFormat('id-ID').format(product.price)}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 text-xs font-semibold py-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-all">
                    Edit
                  </button>
                  <button className="text-xs font-semibold py-2 px-3 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Belum ada produk. Klik "Tambah Produk Baru" untuk memulai.</p>
        </div>
      )}
    </div>
  );
}
