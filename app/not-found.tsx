import Link from 'next/link';

export default function NotFound() {
 return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
   <div className="max-w-md w-full text-center">
    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
    <h2 className="text-2xl font-bold text-white mb-3">
     Page not found
    </h2>
    <p className="text-[#94A3B8] mb-8">
     Sorry, we couldn&apos;t find the page you&apos;re looking for.
    </p>

    <Link
     href="/"
     className="inline-block bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A7AE8] transition-colors hover:scale-105 active:scale-95 h-14"
    >
     Back to home
    </Link>
   </div>
  </div>
 );
}
