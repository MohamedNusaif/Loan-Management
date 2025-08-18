import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Loan Management System</h1>
        
        {/* Login Card */}
        <Link 
          href="/login" 
          className="block p-8 border rounded-lg bg-white hover:shadow-md transition-shadow text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Login to Continue</h2>
          <p className="text-gray-600">Access your loan accounts</p>
        </Link>

        {/* Optional: Registration Link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">New user? </span>
          <Link href="/register" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </main>
  )
}