export default function VerifyPage() {
 return (
  <div className="min-h-screen bg-white flex items-center justify-center px-4">
   <div className="max-w-md w-full text-center">
    <div className="mb-6">
     <div className="w-16 h-16 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
     </div>
     <h1 className="text-3xl font-black text-white mb-2">Check your email</h1>
     <p className="text-[#94A3B8] mb-4">
      A sign in link has been sent to your email address.
     </p>
     <p className="text-sm text-[#64748B]">
      Click the link in the email to sign in to your dashboard.
     </p>
    </div>
   </div>
  </div>
 );
}
