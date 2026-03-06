import { createServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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
          <div className="text-sm text-slate-500">
            {user.email}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}
