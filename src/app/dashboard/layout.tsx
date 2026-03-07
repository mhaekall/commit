import { createServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerComponentClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-4 py-3">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dashboard UMKM
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              {user.email}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Dashboard Navigation */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-6">
            <Link 
              href="/dashboard" 
              className="py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600"
            >
              Profil Toko
            </Link>
            <Link 
              href="/dashboard/products" 
              className="py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600"
            >
              Produk
            </Link>
            <Link 
              href="/dashboard/categories" 
              className="py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600"
            >
              Kategori
            </Link>
          </div>
        </div>
      </div>
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
