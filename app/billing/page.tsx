'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, Button, Banner, Skeleton } from '@/components/ui';
import InvoicesList, { Invoice } from '@/components/InvoicesList';

interface Subscription {
 status: 'active' | 'canceled' | 'past_due' | 'trialing';
 currentPeriodEnd: number;
 cancelAtPeriodEnd: boolean;
 plan: {
  amount: number;
  currency: string;
  interval: string;
 };
}

export default function BillingPage() {
 const [subscription, setSubscription] = useState<Subscription | null>(null);
 const [invoices, setInvoices] = useState<Invoice[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [isInvoicesLoading, setIsInvoicesLoading] = useState(true);
 const [apiError, setApiError] = useState('');

 useEffect(() => {
  fetchBillingData();
  fetchInvoices();
 }, []);

 const fetchBillingData = async () => {
  setApiError('');
  try {
   const response = await fetch('/api/user/subscription');

   if (response.ok) {
    const data = await response.json();
    setSubscription(data.subscription);
   } else {
    setApiError('Failed to load subscription data. Please refresh the page.');
   }
  } catch (error) {
   console.error('Error fetching billing data:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsLoading(false);
  }
 };

 const fetchInvoices = async () => {
  setIsInvoicesLoading(true);
  try {
   const response = await fetch('/api/user/invoices');
   if (response.ok) {
    const data = await response.json();
    setInvoices(data.invoices || []);
   }
  } catch (error) {
   console.error('Error fetching invoices:', error);
  } finally {
   setIsInvoicesLoading(false);
  }
 };

 const handleManageBilling = async () => {
  setApiError('');
  try {
   const response = await fetch('/api/create-portal-session', {
    method: 'POST',
   });

   if (response.ok) {
    const { url } = await response.json();
    window.open(url, '_blank', 'noopener,noreferrer');
   } else {
    setApiError('Failed to open billing portal. Please try again.');
   }
  } catch (error) {
   console.error('Error opening billing portal:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 if (isLoading) {
  return (
   <AppLayout>
    <div className="max-w-5xl mx-auto space-y-6">
     <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
      <p className="text-gray-600">Manage your subscription and payment details</p>
     </div>
     <Card>
      <div className="space-y-4">
       <Skeleton variant="text" width="200px" />
       <Skeleton variant="text" height="40px" width="150px" />
       <Skeleton variant="text" width="120px" />
      </div>
     </Card>
     <Card>
      <Skeleton variant="text" count={3} />
     </Card>
    </div>
   </AppLayout>
  );
 }

 return (
  <AppLayout>
   <div className="max-w-5xl mx-auto space-y-6">
    <div>
     <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
     <p className="text-gray-600">Manage your subscription and payment details</p>
    </div>

    {/* API Error Banner */}
    {apiError && (
     <Banner
      variant="danger"
      message={apiError}
      onDismiss={() => setApiError('')}
     />
    )}

    {/* Subscription Details */}
    <Card>
     <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h2>

     <div className="flex items-start justify-between mb-6">
      <div>
       <p className="text-sm text-gray-600 mb-1">Current Plan</p>
       <p className="text-xl font-bold text-gray-900">BuzEntry Pro</p>
      </div>
      <div className="text-right">
       <p className="text-3xl font-bold text-gray-900">$6.99</p>
       <p className="text-sm text-gray-500">/month</p>
      </div>
     </div>

     <div>
      <p className="text-sm text-gray-600 mb-1">Status</p>
      <p className="text-gray-900 capitalize">{subscription?.status || 'Unknown'}</p>
     </div>
    </Card>

    {/* Manage Billing Button */}
    <div className="text-center space-y-3">
     <Button
      onClick={handleManageBilling}
      className="w-full max-w-2xl mx-auto text-lg py-4"
     >
      Manage Billing & Payment
     </Button>
     <p className="text-sm text-gray-500">
      Update payment method, view invoices, or cancel subscription
     </p>
     <div className="pt-2">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded inline-block">
       <p className="text-sm text-green-800">
        <strong>30-day money-back guarantee:</strong> Not satisfied? Get a full refund within 30 days, no questions asked.
       </p>
      </div>
     </div>
    </div>

    {/* Invoices List */}
    <InvoicesList invoices={invoices} isLoading={isInvoicesLoading} />

    {/* What's Included */}
    <Card>
     <h2 className="text-lg font-semibold text-gray-900 mb-6">What's Included</h2>

     <div className="space-y-5">
      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Dedicated Phone Number</p>
        <p className="text-sm text-gray-600">Your own intercom number for building access</p>
       </div>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Automatic Door Unlock</p>
        <p className="text-sm text-gray-600">Smart unlock system with customizable door code</p>
       </div>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Guest Passcodes</p>
        <p className="text-sm text-gray-600">Generate temporary access codes for visitors</p>
       </div>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Call Forwarding</p>
        <p className="text-sm text-gray-600">Optional forwarding to your phone for manual control</p>
       </div>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Analytics & History</p>
        <p className="text-sm text-gray-600">Track all calls and door access activity</p>
       </div>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
       </div>
       <div>
        <p className="font-semibold text-gray-900">Priority Support</p>
        <p className="text-sm text-gray-600">Get help whenever you need it</p>
       </div>
      </div>
     </div>
    </Card>

    {/* Need Help */}
    <Card className="bg-blue-50 border-blue-100">
     <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
      </div>
      <div className="flex-1">
       <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
       <p className="text-sm text-gray-700 mb-3">
        Have questions about your subscription or need technical support?
       </p>
       <a
        href="mailto:support@buzentry.com"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
       >
        Contact Support
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
       </a>
      </div>
     </div>
    </Card>
   </div>
  </AppLayout>
 );
}
