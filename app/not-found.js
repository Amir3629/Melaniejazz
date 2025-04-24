export const dynamic = 'force-dynamic';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">Page not found</p>
        <a href="/" className="text-blue-400 hover:text-blue-300 underline">
          Return to Homepage
        </a>
      </div>
    </div>
  )
} 