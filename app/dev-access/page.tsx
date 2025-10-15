'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DevAccessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    setMessage('Creating account and logging in...');

    try {
      console.log('[Dev Access] Starting login for:', email);

      const response = await fetch('/api/auth/dev-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log('[Dev Access] Response status:', response.status);
      const data = await response.json();
      console.log('[Dev Access] Response data:', data);

      if (response.ok) {
        setMessage('✅ Success! Redirecting to dashboard...');
        console.log('[Dev Access] Login successful, redirecting...');

        // Force redirect
        setTimeout(() => {
          console.log('[Dev Access] Executing redirect to /dashboard');
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        const errorMsg = data.error || 'Failed to login';
        setMessage(`❌ Error: ${errorMsg}`);
        console.error('[Dev Access] Login failed:', errorMsg);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('[Dev Access] Login error:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Could not connect to server'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-[2rem] p-8 shadow-2xl shadow-blue-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Dev Access
            </h1>
            <p className="text-gray-600">
              Quick access to dashboard for testing
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl border ${
              message.includes('Error') || message.includes('❌')
                ? 'bg-red-50 border-red-200'
                : message.includes('Success') || message.includes('✅')
                ? 'bg-green-50 border-green-200'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <p className="text-sm text-gray-700 text-center font-medium">{message}</p>
            </div>
          )}

          {/* Debug Info */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs">
            <p className="font-bold text-gray-700 mb-2">Debug Info:</p>
            <p className="text-gray-600">Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
            <p className="text-gray-600">Endpoint: /api/auth/dev-login</p>
            <button
              onClick={() => {
                console.log('=== MANUAL TEST ===');
                console.log('Window location:', window.location.href);
                console.log('Fetch available:', typeof fetch !== 'undefined');
                alert('Check browser console for details');
              }}
              className="mt-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Test Console
            </button>
          </div>

          {/* Quick Access Buttons */}
          <div className="space-y-4">
            {/* Demo Account */}
            <button
              onClick={() => handleLogin('demo@buzentry.com')}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-full text-base font-bold hover:from-blue-600 hover:to-indigo-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  🚀 Quick Demo Access
                </>
              )}
            </button>

            {/* Custom Email Options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleLogin('test@example.com')}
                disabled={isLoading}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                test@example.com
              </button>
              <button
                onClick={() => handleLogin('admin@test.com')}
                disabled={isLoading}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                admin@test.com
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 bg-green-50/50 border border-green-200 rounded-2xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">Dev Mode Active</p>
                <p className="text-xs text-gray-600">
                  Click any button to instantly create an account and access the full dashboard. No signup or payment required.
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold text-gray-700 mb-3">What you'll get:</p>
            {[
              'Full dashboard access',
              'Mock phone number',
              'Create guest passcodes',
              'Configure settings',
              'View analytics (mock data)',
              'Active subscription (mock)',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For regular login, go to{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              /login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
