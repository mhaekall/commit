export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-2xl shadow-xl border border-red-900/30 text-center">
        <div className="w-16 h-16 bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
          !
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-neutral-400 mb-8">
          There was an error during the authentication process. Please try again or contact support.
        </p>
        <a 
          href="/login" 
          className="inline-block px-6 py-2 bg-neutral-800 hover:bg-neutral-700 font-semibold rounded-lg border border-neutral-700 transition-colors"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
