import { createServerComponentClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = await createServerComponentClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return <div>Silakan login terlebih dahulu.</div>;
  }

  // Get user's shop
  const { data: membership } = await supabase
    .from('memberships')
    .select('shop_id, shops(*)')
    .eq('user_id', user.id)
    .single();

  if (!membership?.shop_id) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Anda belum memiliki toko.</p>
        <a href="/dashboard" className="text-indigo-600 hover:underline">
          Buat profil toko terlebih dahulu
        </a>
      </div>
    );
  }

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('shop_id', membership.shop_id)
    .order('sort_order');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kategori Produk</h2>
          <p className="text-slate-500">Kelola kategori untuk produk Anda.</p>
        </div>
        <a
          href="/dashboard/categories/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Tambah Kategori
        </a>
      </div>

      {categories && categories.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Nama</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Urutan</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                  <td className="px-6 py-4 text-slate-600">{category.sort_order}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      category.is_visible 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {category.is_visible ? 'Tampil' : 'Tidak Tampil'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/dashboard/categories/${category.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 mb-4">Belum ada kategori.</p>
          <a
            href="/dashboard/categories/new"
            className="text-indigo-600 hover:underline font-medium"
          >
            Tambah kategori pertama Anda
          </a>
        </div>
      )}
    </div>
  );
}
