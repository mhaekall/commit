import Link from 'next/link'
import { createServerComponentClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          Commit Project
        </h1>
        <p className="text-xl text-neutral-400 mb-10 leading-relaxed">
          The ultimate AI-powered starter template for modern Next.js applications. 
          Built with Supabase, Tailwind CSS, and TypeScript.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-lg"
              >
                Get Started
              </Link>
              <a 
                href="https://github.com/mhaekall/commit" 
                target="_blank"
                className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 font-bold rounded-xl border border-neutral-800 transition-all text-lg"
              >
                GitHub
              </a>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-6 text-xl">⚡</div>
          <h3 className="text-xl font-bold mb-3">Fast Setup</h3>
          <p className="text-neutral-500">Zero configuration needed. Start building your next idea in seconds.</p>
        </div>
        <div className="p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center mb-6 text-xl">🛡️</div>
          <h3 className="text-xl font-bold mb-3">Secure Auth</h3>
          <p className="text-neutral-500">Robust authentication powered by Supabase Auth and Next.js Middleware.</p>
        </div>
        <div className="p-8 bg-neutral-900/50 rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-lg flex items-center justify-center mb-6 text-xl">🤖</div>
          <h3 className="text-xl font-bold mb-3">AI-Ready</h3>
          <p className="text-neutral-500">Designed specifically to be extended and modified by AI assistants.</p>
        </div>
      </div>
    </main>
  )
}
