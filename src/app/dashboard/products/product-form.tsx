'use client';

import { useActionState, useState } from 'react';
import { saveProduct, ActionState } from './actions';

const initialState: ActionState = {
  success: false,
  message: '',
};

export default function ProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(saveProduct, initialState);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Katalog Produk</h2>
        <button
          onClick={toggleModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          + Tambah Produk Baru
        </button>
      </div>

      {/* MODAL / FORM SECTION */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Input Data Produk</h3>
              <button onClick={toggleModal} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form
              action={async (formData) => {
                await formAction(formData);
                if (state.success) {
                    setIsOpen(false);
                }
              }}
              className="space-y-4"
            >
              {state.message && (
                <div className={`p-3 rounded-lg text-sm font-medium ${state.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                  {state.message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Produk</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Kopi Gula Aren"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Harga (IDR)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="25000"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold text-slate-700">Tampilkan Produk ke Katalog</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="isVisible" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Foto Produk</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-600 font-bold hover:bg-slate-50 border border-slate-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className={`flex-1 py-3 px-4 rounded-xl text-white font-bold transition-all ${isPending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100'}`}
                >
                  {isPending ? 'Mengunggah...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
