import { signInWithEmail, signUpWithEmail } from '../actions'
import GoogleButton from './google-button'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-2xl shadow-xl border border-neutral-800">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-neutral-400">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-neutral-600"
              placeholder="name@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" name="password" className="text-sm font-medium text-neutral-400">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder:text-neutral-600"
              placeholder="••••••••"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              formAction={signInWithEmail}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition-colors"
            >
              Log in
            </button>
            <button 
              formAction={signUpWithEmail}
              className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 font-semibold rounded-lg border border-neutral-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with</span>
          </div>
        </div>

        <GoogleButton />
      </div>
    </div>
  )
}
