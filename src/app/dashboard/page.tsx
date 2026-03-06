import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createServerComponentClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <div className="w-full max-w-4xl p-10 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20">
          {data.user.email?.[0].toUpperCase()}
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Dashboard</h1>
          <p className="text-neutral-400 font-medium">Hello, <span className="text-blue-400">{data.user.email}</span></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8">
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-700/50 hover:border-blue-500/50 transition-all cursor-default">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Projects</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-700/50 hover:border-emerald-500/50 transition-all cursor-default">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Usage</h3>
            <p className="text-3xl font-bold">84%</p>
          </div>
          <div className="p-6 bg-neutral-800/50 rounded-2xl border border-neutral-700/50 hover:border-purple-500/50 transition-all cursor-default">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-2">Credits</h3>
            <p className="text-3xl font-bold">$42.00</p>
          </div>
        </div>

        <form action="/auth/signout" method="post" className="mt-8">
          <button 
            type="submit"
            className="px-6 py-2 bg-neutral-800 hover:bg-red-900/20 hover:text-red-400 hover:border-red-900/50 text-neutral-300 font-semibold rounded-xl border border-neutral-700 transition-all"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
