'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Format phone number with dashes: +1-234-567-8900
const formatPhoneNumber = (phone: string) => {
 if (!phone) return '';
 return phone.replace(/(\+\d)(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
};

export default function OnboardingPage() {
 const { data: session, status } = useSession();
 const router = useRouter();
 const [step, setStep] = useState(1);
 const [doorCode, setDoorCode] = useState('');
 const [accessCode, setAccessCode] = useState('');
 const [phoneNumber, setPhoneNumber] = useState('');
 const [copied, setCopied] = useState(false);
 const [emailCopied, setEmailCopied] = useState(false);
 const [isLoading, setIsLoading] = useState(false);
 const [isSaving, setIsSaving] = useState(false);

 // Redirect to login if not authenticated
 useEffect(() => {
  if (status === 'unauthenticated') {
   router.push('/login');
  }
 }, [status, router]);

 // Fetch user profile to get phone number
 useEffect(() => {
  const fetchProfile = async () => {
   if (status === 'authenticated') {
    setIsLoading(true);
    try {
     const res = await fetch('/api/user/profile');
     if (res.ok) {
      const profile = await res.json();
      setPhoneNumber(profile.signalwirePhoneNumber || '');
      // If door code is already set, redirect to dashboard
      if (profile.doorCode) {
       router.push('/dashboard');
      }
     }
    } catch (error) {
     console.error('Error fetching profile:', error);
    } finally {
     setIsLoading(false);
    }
   }
  };

  fetchProfile();
 }, [status, router]);

 const handleSaveDoorCode = async () => {
  if (!doorCode.trim()) return;

  setIsSaving(true);
  try {
   const res = await fetch('/api/user/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doorCode }),
   });

   if (res.ok) {
    setStep(2);
   } else {
    alert('Failed to save door code. Please try again.');
   }
  } catch (error) {
   console.error('Error saving door code:', error);
   alert('Failed to save door code. Please try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleSaveAccessCode = async () => {
  setIsSaving(true);
  try {
   // Only send access code if it's exactly 4 digits, otherwise send null
   const codeToSave = accessCode.length === 4 ? accessCode : null;

   const res = await fetch('/api/user/access-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: codeToSave }),
   });

   if (res.ok) {
    setStep(3);
   } else {
    const data = await res.json();
    alert(data.error || 'Failed to save access code. Please try again.');
   }
  } catch (error) {
   console.error('Error saving access code:', error);
   alert('Failed to save access code. Please try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const copyPhoneNumber = () => {
  navigator.clipboard.writeText(phoneNumber);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
 };

 const copyEmailTemplate = async () => {
  const emailTemplate = `Subject: Request to Update Intercom Phone Number

Hello,

I would like to update my phone number in the building's intercom directory system.

My apartment/unit: [YOUR UNIT NUMBER]
New phone number: ${formatPhoneNumber(phoneNumber)}

Please let me know if you need any additional information.

Thank you!`;

  try {
   await navigator.clipboard.writeText(emailTemplate);
   setEmailCopied(true);
   setTimeout(() => setEmailCopied(false), 3000);
  } catch (error) {
   console.error('Failed to copy email:', error);
   alert('Failed to copy to clipboard');
  }
 };

 // Show loading state while checking auth
 if (status === 'loading' || isLoading) {
  return (
   <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 border-4 border-[#5B8CFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-[#94A3B8]">Loading...</p>
    </div>
   </div>
  );
 }

 // Show loading while checking auth status
 if (status === 'unauthenticated') {
  return (
   <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
     <div className="inline-block w-12 h-12 border-4 border-[#5B8CFF] border-t-transparent rounded-full animate-spin mb-4"></div>
     <p className="text-[#94A3B8]">Loading...</p>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-white">
   {/* Header */}
   <header className="px-6 py-6 border-b border-gray-300 bg-white">
    <div className="max-w-2xl mx-auto">
     <h1 className="text-2xl font-bold text-gray-900">
      Buz<span className="text-[#5B8CFF]">Entry</span>
     </h1>
    </div>
   </header>

   <div className="px-6 py-12 max-w-2xl mx-auto">
    {/* Progress Indicator */}
    <div className="mb-12">
     <div className="flex items-center gap-3 mb-4">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
       step >= 1 ? 'bg-[#5B8CFF] text-white' : 'bg-gray-50 text-[#64748B]'
      }`}>1</div>
      <div className={`flex-1 h-1 rounded ${step >= 2 ? 'bg-[#5B8CFF]' : 'bg-gray-50'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
       step >= 2 ? 'bg-[#5B8CFF] text-white' : 'bg-gray-50 text-[#64748B]'
      }`}>2</div>
      <div className={`flex-1 h-1 rounded ${step >= 3 ? 'bg-[#5B8CFF]' : 'bg-gray-50'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
       step >= 3 ? 'bg-[#5B8CFF] text-white' : 'bg-gray-50 text-[#64748B]'
      }`}>3</div>
     </div>
     <p className="text-sm text-[#94A3B8]">Step {step} of 3</p>
    </div>

    {/* Step 1: Door Code Setup */}
    {step === 1 && (
     <div className="bg-gray-50 rounded-full border border-gray-300 p-8">
      <div className="mb-8">
       <div className="w-12 h-12 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
       </div>
       <h2 className="text-3xl font-black text-gray-900 mb-3">
        Set Your Door Code
       </h2>
       <p className="text-lg text-[#94A3B8]">
        What digit(s) unlock your door? Usually 1 or 2, but can also be # (pound key) or other digits.
       </p>
      </div>

      {/* Door Code Input */}
      <div className="mb-8">
       <label className="block text-sm font-bold text-gray-900 mb-3">
        Door Code
       </label>
       <input
        type="text"
        value={doorCode}
        onChange={(e) => setDoorCode(e.target.value.replace(/[^0-9*#]/g, '').substring(0, 10))}
        placeholder="e.g., 1 or 2"
        className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-full text-3xl font-bold text-center text-gray-900 focus:border-[#5B8CFF] focus:outline-none transition-colors"
        maxLength={10}
        autoFocus
       />

       {/* Quick Select Buttons */}
       <div className="mt-4">
        <p className="text-xs font-medium text-[#94A3B8] mb-3">Common codes:</p>
        <div className="grid grid-cols-6 gap-2">
         {['1', '2', '4', '6', '9', '#'].map((code) => (
          <button
           key={code}
           onClick={() => setDoorCode(code)}
           className="px-4 py-3 text-xl font-bold text-gray-900 border-2 border-gray-300 rounded-full hover:border-[#5B8CFF] hover:bg-[#5B8CFF]/10 transition-colors"
          >
           {code}
          </button>
         ))}
        </div>
       </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#5B8CFF]/10 border border-[#5B8CFF]/20 rounded-full p-4 mb-6">
       <p className="text-sm text-[#5B8CFF] flex items-start gap-2">
        <svg className="w-5 h-5 text-[#5B8CFF] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>
         <strong>Not sure?</strong> Call your building's intercom from outside and press different buttons on your phone to test which one unlocks the door. You can change this anytime in Settings.
        </span>
       </p>
      </div>

      {/* Continue Button */}
      <button
       onClick={handleSaveDoorCode}
       disabled={!doorCode.trim() || isSaving}
       className="w-full bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A7AE8] hover:scale-105 active:scale-95 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed h-14"
      >
       {isSaving ? 'Saving...' : 'Continue'}
      </button>
     </div>
    )}

    {/* Step 2: Security Code (Optional) */}
    {step === 2 && (
     <div className="bg-gray-50 rounded-full border border-gray-300 p-8">
      <div className="mb-8">
       <div className="w-12 h-12 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#5B8CFF]" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
       </div>
       <h2 className="text-3xl font-black text-gray-900 mb-3">
        Add Security (Optional)
       </h2>
       <p className="text-lg text-[#94A3B8]">
        Require a 4-digit PIN before unlocking. Great for extra security!
       </p>
      </div>

      {/* Access Code Input */}
      <div className="mb-8">
       <label className="block text-sm font-bold text-gray-900 mb-3">
        4-Digit Access Code (Optional)
       </label>
       <input
        type="text"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="e.g., 1234 (leave empty to skip)"
        className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-full text-3xl font-bold text-center text-gray-900 focus:border-[#5B8CFF] focus:outline-none transition-colors"
        maxLength={4}
       />
       <p className="text-sm text-[#94A3B8] mt-2 text-center">
        {accessCode ? `Your PIN: ${accessCode}` : 'Leave empty to allow anyone to unlock'}
       </p>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-full p-4 mb-6">
       <p className="text-sm text-yellow-400 flex items-start gap-2">
        <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>
         <strong>How it works:</strong> Visitors will need to enter this PIN using the keypad (or by voice) before the door unlocks. Skip this if you want anyone to enter freely.
        </span>
       </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
       <button
        onClick={handleSaveAccessCode}
        disabled={isSaving || (accessCode.length > 0 && accessCode.length < 4)}
        className="w-full bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A7AE8] hover:scale-105 active:scale-95 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed h-14"
       >
        {isSaving ? 'Saving...' : accessCode.length === 4 ? 'Save & Continue' : 'Skip (No Security)'}
       </button>
       {accessCode.length > 0 && accessCode.length < 4 && (
        <p className="text-sm text-red-400 text-center">
         Please enter exactly 4 digits or leave empty to skip
        </p>
       )}
       <button
        onClick={() => setStep(1)}
        className="w-full text-[#94A3B8] px-5 py-2.5 rounded-full text-base font-medium hover:bg-gray-50 transition-colors h-10"
       >
        Back
       </button>
      </div>
     </div>
    )}

    {/* Step 3: Complete - Give Number to Building */}
    {step === 3 && (
     <div className="bg-gray-50 rounded-full border border-gray-300 p-8">
      <div className="mb-8">
       <div className="w-16 h-16 bg-[#5B8CFF]/10 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#5B8CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
       </div>
       <h2 className="text-3xl font-black text-gray-900 mb-3">
        Almost Done!
       </h2>
       <p className="text-lg text-[#94A3B8]">
        Now give your Magic Number to your building manager
       </p>
      </div>

      {/* Magic Number Card */}
      <div className="bg-[#5B8CFF]/10 border-2 border-[#5B8CFF]/30 rounded-2xl p-6 mb-8">
       <p className="text-sm font-bold text-[#5B8CFF] uppercase tracking-wide mb-2">Your Magic Number</p>
       <div className="flex items-center justify-between mb-3">
        <span className="text-4xl font-bold text-[#5B8CFF] tracking-tight font-mono">
         {formatPhoneNumber(phoneNumber) || 'Loading...'}
        </span>
        <button
         onClick={copyPhoneNumber}
         className="px-4 py-2 bg-[#5B8CFF] text-white rounded-full font-bold hover:bg-[#4A7AE8] transition-colors text-sm"
        >
         {copied ? '✓ Copied' : 'Copy'}
        </button>
       </div>
       <p className="text-sm text-[#94A3B8]">
        This replaces your personal phone number in the building directory
       </p>
      </div>

      {/* Email Template Card */}
      <div className="bg-[#5B8CFF]/10 border-2 border-green-500/20 rounded-2xl p-6 mb-8">
       <div className="flex items-start justify-between mb-3">
        <div>
         <p className="text-sm font-bold text-[#5B8CFF] uppercase tracking-wide mb-1">Ready-to-Send Email</p>
         <p className="text-sm text-[#5B8CFF]">Copy and send to your building manager</p>
        </div>
        <button
         onClick={copyEmailTemplate}
         className="flex items-center gap-2 px-4 py-2 bg-[#5B8CFF] text-white rounded-full font-bold hover:bg-[#4A7AE8] transition-colors text-sm"
        >
         {emailCopied ? (
          <>
           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
           </svg>
           Copied!
          </>
         ) : (
          <>
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
           Copy Email
          </>
         )}
        </button>
       </div>
       <div className="bg-white rounded-full p-4 border border-green-500/30 text-sm font-mono text-[#94A3B8] whitespace-pre-wrap">
{`Subject: Update Intercom Phone Number

Hello,

I would like to update my phone number in the building's intercom directory.

My apartment/unit: [YOUR UNIT NUMBER]
New phone number: ${formatPhoneNumber(phoneNumber)}

Please let me know if you need any additional information.

Thank you!`}
       </div>
      </div>

      {/* Instructions */}
      <div className="space-y-6 mb-8">
       {/* Step 1 */}
       <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#5B8CFF] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
        <div>
         <h3 className="font-bold text-white mb-1">Copy the email template above</h3>
         <p className="text-sm text-[#94A3B8]">
          Click "Copy Email" and paste it into your email client
         </p>
        </div>
       </div>

       {/* Step 2 */}
       <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#5B8CFF] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
        <div>
         <h3 className="font-bold text-white mb-1">Send to your building manager</h3>
         <p className="text-sm text-[#94A3B8]">
          Don't forget to add your unit number where it says [YOUR UNIT NUMBER]
         </p>
        </div>
       </div>

       {/* Step 3 */}
       <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[#5B8CFF] text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
        <div>
         <h3 className="font-bold text-white mb-1">Test it out!</h3>
         <p className="text-sm text-[#94A3B8]">
          Once updated, have someone buzz your apartment from outside. The door will auto-unlock!
         </p>
        </div>
       </div>
      </div>

      {/* Your Settings Summary */}
      <div className="bg-white border border-gray-300 rounded-2xl p-6 mb-8">
       <h3 className="font-bold text-gray-900 mb-4">Your Settings</h3>
       <div className="space-y-3 text-sm">
        <div className="flex justify-between">
         <span className="text-[#94A3B8]">Door Code:</span>
         <span className="font-bold text-gray-900">{doorCode}</span>
        </div>
        <div className="flex justify-between">
         <span className="text-[#94A3B8]">Security PIN:</span>
         <span className="font-bold text-gray-900">{accessCode || 'None (Open access)'}</span>
        </div>
       </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
       <button
        onClick={() => router.push('/dashboard')}
        className="w-full bg-[#5B8CFF] text-white px-8 py-3.5 rounded-full text-lg font-bold hover:bg-[#4A7AE8] hover:scale-105 active:scale-95 transition-colors h-14"
       >
        Go to Dashboard
       </button>
       <p className="text-xs text-[#64748B] text-center">
        You can always change these settings in your dashboard
       </p>
      </div>
     </div>
    )}

    {/* Support Link */}
    <div className="mt-8 text-center">
     <p className="text-sm text-[#64748B]">
      Need help?{' '}
      <a href="mailto:support@buzentry.com" className="text-[#5B8CFF] font-medium hover:underline">
       support@buzentry.com
      </a>
     </p>
    </div>
   </div>
  </div>
 );
}
