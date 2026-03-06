'use client';

import { useActionState } from 'react';
import { saveShopProfile, ActionState } from './actions';

const initialState: ActionState = {
  success: false,
  message: '',
};

export default function ShopProfilePage() {
  const [state, formAction, isPending] = useActionState(saveShopProfile, initialState);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Profil Toko</h2>
        <p className="text-slate-500">Kelola informasi brand dan cabang toko UMKM Anda.</p>
      </div>

      <form action={formAction} className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {state.message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${state.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            {state.message}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="orgName" className="block text-sm font-semibold text-slate-700 mb-1">Nama Organisasi (Brand)</label>
              <input
                id="orgName"
                name="orgName"
                type="text"
                required
                placeholder="Contoh: Kopi Senja"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-slate-700 mb-1">Slug URL Katalog</label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                placeholder="kopi-senja"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="shopName" className="block text-sm font-semibold text-slate-700 mb-1">Nama Cabang Toko</label>
            <input
              id="shopName"
              name="shopName"
              type="text"
              required
              placeholder="Contoh: Cabang Jakarta Pusat"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4">
            <div>
              <label htmlFor="logo" className="block text-sm font-semibold text-slate-700 mb-1">Logo Toko (Upload)</label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
              />
            </div>
            <div>
              <label htmlFor="qris" className="block text-sm font-semibold text-slate-700 mb-1">Gambar QRIS (Upload)</label>
              <input
                id="qris"
                name="qris"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-xl text-white font-bold shadow-lg shadow-indigo-100 transition-all ${isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}`}
          >
            {isPending ? 'Menyimpan...' : 'Simpan Profil Toko'}
          </button>
        </div>
      </form>
    </div>
  );
}
