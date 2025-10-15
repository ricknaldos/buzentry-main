'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, Badge, Button, Toggle, Modal, Banner, Skeleton } from '@/components/ui';
import { trackEvent } from '@/lib/analytics';
import { useToast } from '@/contexts/ToastContext';

interface Activity {
 id: string;
 status: 'answered' | 'denied' | 'forwarded' | 'missed';
 timestamp: string;
 caller?: string;
 meta: {
  pinOk?: boolean;
  code?: string;
  retries?: number;
  latency?: number;
 };
}

interface Stats {
 answered: number;
 denied: number;
 forwarded: number;
 missed: number;
}

export default function OverviewPage() {
 const toast = useToast();
 const [isActive, setIsActive] = useState(true);
 const [previousIsActive, setPreviousIsActive] = useState(true);
 const [magicNumber, setMagicNumber] = useState('+1-555-123-4567');
 const [stats, setStats] = useState<Stats>({ answered: 12, denied: 1, forwarded: 3, missed: 0 });
 const [statsPeriod, setStatsPeriod] = useState<'7d' | '30d'>('7d');
 const [activities, setActivities] = useState<Activity[]>([
  {
   id: '1',
   status: 'answered',
   timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
   caller: '+1234567890',
   meta: { pinOk: true, code: '9', retries: 0, latency: 1.2 }
  },
  {
   id: '2',
   status: 'answered',
   timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
   caller: '+1987654321',
   meta: { pinOk: true, code: '1', retries: 1, latency: 0.8 }
  },
  {
   id: '3',
   status: 'denied',
   timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
   caller: '+1555123456',
   meta: { pinOk: false, code: '9', retries: 3, latency: 2.1 }
  },
  {
   id: '4',
   status: 'forwarded',
   timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
   caller: '+1444999888',
   meta: { pinOk: true, code: '1', retries: 0, latency: 0.5 }
  },
  {
   id: '5',
   status: 'answered',
   timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
   caller: '+1222333444',
   meta: { pinOk: true, code: '9', retries: 0, latency: 1.0 }
  }
 ]);
 const [activityFilter, setActivityFilter] = useState<'24h' | '7d' | '30d'>('7d');
 const [currentPage, setCurrentPage] = useState(1);
 const [showEmailModal, setShowEmailModal] = useState(false);
 const [emailCopied, setEmailCopied] = useState(false);
 const [numberCopied, setNumberCopied] = useState(false);
 const [apiError, setApiError] = useState('');
 const [isLoading, setIsLoading] = useState(true);
 const [isStatsLoading, setIsStatsLoading] = useState(true);
 const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

 const ITEMS_PER_PAGE = 50;

 // Checklist state
 const [checklist, setChecklist] = useState({
  numberAssigned: true,
  doorCodeSet: true,
  emailSent: false,
  firstUnlock: false,
 });

 const fetchActivities = useCallback(async () => {
  setIsActivitiesLoading(true);
  try {
   const response = await fetch(`/api/user/activities?period=${activityFilter}&limit=200`);
   if (response.ok) {
    const activitiesData = await response.json();
    setActivities(activitiesData.activities || []);
    setCurrentPage(1); // Reset to first page on filter change
   }
  } catch (error) {
   console.error('Error fetching activities:', error);
  } finally {
   setIsActivitiesLoading(false);
  }
 }, [activityFilter]);

 const fetchData = useCallback(async () => {
  setIsLoading(true);
  setIsStatsLoading(true);
  setApiError('');
  try {
   const [profileRes, analyticsRes] = await Promise.all([
    fetch('/api/user/profile'),
    fetch(`/api/user/analytics?period=${statsPeriod}`),
   ]);

   if (profileRes.ok) {
    const profile = await profileRes.json();
    setMagicNumber(profile.phoneNumber || '+1-555-123-4567');
    setIsActive(!profile.isPaused);
    setPreviousIsActive(!profile.isPaused);
    setChecklist({
     numberAssigned: !!profile.phoneNumber,
     doorCodeSet: !!profile.doorCode,
     emailSent: profile.emailSent || false,
     firstUnlock: profile.firstUnlock || false,
    });
   } else {
    setApiError('Failed to load profile data. Please refresh the page.');
   }

   if (analyticsRes.ok) {
    const analytics = await analyticsRes.json();
    setStats(analytics.stats || stats);
   }
  } catch (error) {
   console.error('Error fetching data:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsLoading(false);
   setIsStatsLoading(false);
  }

  await fetchActivities();
 }, [fetchActivities, statsPeriod]);

 useEffect(() => {
  fetchData();
 }, [fetchData]);

 useEffect(() => {
  fetchActivities();
 }, [fetchActivities]);

 const handleToggleActive = async (active: boolean) => {
  // Optimistic update
  setPreviousIsActive(isActive);
  setIsActive(active);
  setApiError('');

  // Show undo toast
  toast.showToast({
   variant: active ? 'success' : 'warning',
   message: active ? 'System resumed' : 'System paused',
   duration: 5000,
   action: {
    label: 'Undo',
    onClick: () => {
     setIsActive(previousIsActive);
     handleToggleActive(previousIsActive);
    },
   },
  });

  try {
   const response = await fetch('/api/user/pause', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isPaused: !active }),
   });

   if (response.ok) {
    trackEvent[active ? 'systemResumed' : 'systemPaused']();
   } else {
    setApiError('Failed to update system status. Please try again.');
    setIsActive(!active); // Revert the toggle
   }
  } catch (error) {
   console.error('Error toggling active state:', error);
   setApiError('Network error. Please check your connection and try again.');
   setIsActive(!active); // Revert the toggle
  }
 };

 const handleCopyNumber = () => {
  navigator.clipboard.writeText(magicNumber);
  setNumberCopied(true);
  toast.success('Magic number copied to clipboard!');
  setTimeout(() => setNumberCopied(false), 2000);
 };

 const handleCopyEmail = () => {
  const emailTemplate = `Subject: Update intercom number for Apt [XX]

Hi, could you please update my apartment's intercom phone number to ${magicNumber}?

This is my dedicated line for building access — no hardware changes required.

Thank you!`;

  navigator.clipboard.writeText(emailTemplate);
  setEmailCopied(true);
  toast.success('Email template copied to clipboard!');
  setTimeout(() => {
   setEmailCopied(false);
   setShowEmailModal(false);
  }, 2000);
 };

 const handleTestSetup = async () => {
  trackEvent.testSetupStart();
  try {
   const response = await fetch('/api/user/test-setup', { method: 'POST' });
   const data = await response.json();

   if (data.success) {
    trackEvent.testSetupSuccess();
    toast.success('✓ Door tone detected. You\'re good to go!');
   } else {
    trackEvent.testSetupFail(data.reason || 'unknown');
    toast.error('✗ No DTMF confirmation. Try \'#\' or increase delay in Settings.');
   }
  } catch (error) {
   trackEvent.testSetupFail('error');
   console.error('Error testing setup:', error);
   toast.error('✗ Test failed. Please try again.');
  }
 };

 const getStatusBadge = (status: Activity['status']) => {
  const variants: Record<Activity['status'], 'success' | 'danger' | 'info' | 'muted'> = {
   answered: 'success',
   denied: 'danger',
   forwarded: 'info',
   missed: 'muted',
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
 };

 const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
 };

 const maskPhoneNumber = (phone: string = '+1234567890') => {
  // Mask phone number: +1234567890 -> •••-••7-5333
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 4) {
   const lastFour = digits.slice(-4);
   return `•••-••${lastFour.slice(0, 1)}-${lastFour.slice(1)}`;
  }
  return '•••-•••-••••';
 };

 const handleExportCSV = () => {
  const csvHeaders = ['Status', 'Time', 'Caller', 'PIN', 'Code', 'Retries', 'Latency'];
  const csvRows = activities.map((activity) => [
   activity.status,
   new Date(activity.timestamp).toLocaleString(),
   activity.caller || 'Unknown',
   activity.meta.pinOk !== undefined ? (activity.meta.pinOk ? 'Valid' : 'Invalid') : 'N/A',
   activity.meta.code || 'N/A',
   activity.meta.retries !== undefined ? activity.meta.retries : 'N/A',
   activity.meta.latency ? `${activity.meta.latency}s` : 'N/A',
  ]);

  const csvContent = [
   csvHeaders.join(','),
   ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `activity-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  toast.success('Activity exported successfully!');
 };

 // Pagination
 const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
 const paginatedActivities = activities.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
 );

 return (
  <AppLayout>
   <div className="max-w-7xl mx-auto space-y-6">
    {/* Header */}
    <div>
     <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
     <p className="text-gray-600">Manage your building access system</p>
    </div>

    {/* API Error Banner */}
    {apiError && (
     <Banner
      variant="danger"
      message={apiError}
      onDismiss={() => setApiError('')}
     />
    )}

    {/* Fresh User Banner - No Door Code */}
    {!checklist.doorCodeSet && (
     <Banner
      variant="info"
      message="Add your Door Code in Settings to get started."
      action={{
       label: 'Go to Settings',
       onClick: () => window.location.href = '/settings'
      }}
     />
    )}

    {/* Paused Banner */}
    {!isActive && (
     <Banner
      variant="warning"
      message="System is paused. Auto-unlock is disabled."
     />
    )}

    {/* Top Grid: Magic Number + How it works, System Status + Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
     {/* Magic Number Card with How it works */}
     <Card padding="none" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 relative p-5">
      {isLoading ? (
       <div className="space-y-4">
        <Skeleton variant="text" width="200px" />
        <Skeleton variant="text" height="48px" width="300px" />
        <Skeleton variant="text" width="100%" />
        <div className="flex gap-2">
         <Skeleton variant="button" />
         <Skeleton variant="button" width="180px" />
        </div>
       </div>
      ) : (
       <>
        {/* Icon in top right */}
        <div className="absolute top-5 right-5 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
         <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
         </svg>
        </div>
        <div>
         <h2 className="text-lg font-bold text-gray-900 mb-3">Your Magic Number</h2>
         <div
          onClick={handleCopyNumber}
          className="group relative inline-flex items-center gap-3 cursor-pointer mb-3"
         >
          <p className="text-[40px] font-mono font-bold text-blue-600 tracking-tight group-hover:text-blue-700 transition-colors">
           {magicNumber}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
           <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
           </svg>
          </div>
         </div>

         {/* How it works */}
         <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">How it works</h3>
          <ol className="space-y-1.5 text-sm text-gray-600">
           <li className="flex gap-2">
            <span className="font-bold text-blue-600">1.</span>
            <span>Building manager updates your intercom to this number</span>
           </li>
           <li className="flex gap-2">
            <span className="font-bold text-blue-600">2.</span>
            <span>Guest buzzes your apartment from lobby</span>
           </li>
           <li className="flex gap-2">
            <span className="font-bold text-blue-600">3.</span>
            <span>Door unlocks automatically (no phone required)</span>
           </li>
          </ol>
         </div>

         <Button onClick={() => setShowEmailModal(true)} className="w-full py-3 text-base flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Email for Building Manager
         </Button>
        </div>
       </>
      )}
     </Card>

     {/* System Status + Activity Column */}
     <div className="flex flex-col gap-4 h-full">
      {/* System Status Card - Compact */}
      <Card padding="none" className="relative flex-1 p-5">
       <div className="flex items-center justify-between gap-4">
        <div>
         <h2 className="text-lg font-semibold text-gray-900 mb-1">System Status</h2>
         <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'success' : 'muted'} className="text-sm px-3 py-1.5">
           {isActive ? 'Active' : 'Paused'}
          </Badge>
          <p className="text-xs text-gray-600">
           {isActive ? 'Auto-unlock enabled' : 'Auto-unlock disabled'}
          </p>
         </div>
        </div>
        <div className="flex-shrink-0">
         <Toggle
          checked={isActive}
          onChange={handleToggleActive}
         />
        </div>
       </div>
      </Card>

      {/* Activity Card */}
      <Card padding="none" className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 relative flex-1 p-5">
       {isStatsLoading ? (
        <div className="space-y-3">
         <Skeleton variant="text" width="120px" />
         <Skeleton variant="text" height="40px" width="100px" />
        </div>
       ) : (
        <>
         {/* Icon in top right */}
         <div className="absolute top-5 right-5 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
         </div>
         <div>
          <h2 className="text-sm font-semibold text-gray-600 mb-1">ACTIVITY</h2>
          <p className="text-[40px] font-bold text-gray-900 mb-0.5">
           {stats.answered + stats.denied + stats.forwarded + stats.missed}
          </p>
          <p className="text-xs text-gray-500">Total calls processed</p>
         </div>
        </>
       )}
      </Card>
     </div>
    </div>

    {/* Call Statistics */}
    <Card>
     <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Call Statistics</h2>
      <div className="flex gap-2">
       <button
        onClick={() => setStatsPeriod('7d')}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
         statsPeriod === '7d'
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
       >
        7 Days
       </button>
       <button
        onClick={() => setStatsPeriod('30d')}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
         statsPeriod === '30d'
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
        }`}
       >
        30 Days
       </button>
      </div>
     </div>

     {isStatsLoading ? (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
       <Skeleton variant="stat" />
       <Skeleton variant="stat" />
       <Skeleton variant="stat" />
       <Skeleton variant="stat" />
      </div>
     ) : (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
       <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200/50 hover:shadow-md transition-all relative">
        <div className="absolute top-3 right-3 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
         <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
         </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
         <div className="w-2 h-2 rounded-full bg-green-500"></div>
         <p className="text-sm text-gray-600 font-medium">Answered</p>
        </div>
        <p className="text-3xl font-bold text-green-600">{stats.answered}</p>
       </div>

       <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl border border-red-200/50 hover:shadow-md transition-all relative">
        <div className="absolute top-3 right-3 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
         <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
         </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
         <div className="w-2 h-2 rounded-full bg-red-500"></div>
         <p className="text-sm text-gray-600 font-medium">Denied</p>
        </div>
        <p className="text-3xl font-bold text-red-600">{stats.denied}</p>
       </div>

       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200/50 hover:shadow-md transition-all relative">
        <div className="absolute top-3 right-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
         </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
         <div className="w-2 h-2 rounded-full bg-blue-500"></div>
         <p className="text-sm text-gray-600 font-medium">Forwarded</p>
        </div>
        <p className="text-3xl font-bold text-blue-600">{stats.forwarded}</p>
       </div>

       <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-2xl border border-gray-200/50 hover:shadow-md transition-all relative">
        <div className="absolute top-3 right-3 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
         <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
         </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
         <div className="w-2 h-2 rounded-full bg-gray-500"></div>
         <p className="text-sm text-gray-600 font-medium">Missed</p>
        </div>
        <p className="text-3xl font-bold text-gray-600">{stats.missed}</p>
       </div>
      </div>
     )}
    </Card>

    {/* Recent Activity */}
    <Card className="bg-gradient-to-br from-white to-gray-50/50">
     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
       </div>
       <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
       <select
        value={activityFilter}
        onChange={(e) => setActivityFilter(e.target.value as '24h' | '7d' | '30d')}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
       >
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
       </select>
       {activities.length > 0 && (
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
         Export CSV
        </Button>
       )}
      </div>
     </div>

     {isActivitiesLoading ? (
      <div className="space-y-3">
       <Skeleton variant="row" count={5} />
      </div>
     ) : activities.length === 0 ? (
      <div className="text-center py-16">
       <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
       </div>
       <p className="text-gray-600 font-semibold mb-2">No activity yet</p>
       <p className="text-sm text-gray-500">Try "Test My Setup" to verify your configuration</p>
      </div>
     ) : (
      <>
       {/* Table Headers */}
       <div className="grid grid-cols-[auto_180px_1fr_120px_110px] gap-4 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/80 mb-4">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Status</div>
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Phone Number</div>
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Time</div>
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Access Code</div>
        <div className="text-xs font-bold text-gray-700 uppercase tracking-wider text-right">Result</div>
       </div>

       {/* Table Rows */}
       <div className="space-y-3">
        {paginatedActivities.map((activity, index) => (
         <div
          key={activity.id}
          className="grid grid-cols-[auto_180px_1fr_120px_110px] gap-4 items-center p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
          style={{ animationDelay: `${index * 50}ms` }}
         >
          {/* Status Indicator with Icon */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
           activity.status === 'answered' ? 'bg-green-100' :
           activity.status === 'denied' ? 'bg-red-100' :
           activity.status === 'forwarded' ? 'bg-blue-100' :
           'bg-gray-100'
          }`}>
           <div className={`w-3 h-3 rounded-full ${
            activity.status === 'answered' ? 'bg-green-500' :
            activity.status === 'denied' ? 'bg-red-500' :
            activity.status === 'forwarded' ? 'bg-blue-500' :
            'bg-gray-400'
           }`}></div>
          </div>

          {/* Phone Number */}
          <div>
           <span className="text-base font-mono text-gray-900 font-bold group-hover:text-blue-600 transition-colors">
            {activity.caller || '+1-555-123-4567'}
           </span>
          </div>

          {/* Timestamp */}
          <div className="flex items-center gap-2">
           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
           <span className="text-sm text-gray-600 font-medium">
            {new Date(activity.timestamp).toLocaleString('en-US', {
             month: '2-digit',
             day: '2-digit',
             year: 'numeric',
             hour: 'numeric',
             minute: '2-digit',
             hour12: true
            })}
           </span>
          </div>

          {/* Access Code */}
          <div>
           {activity.meta.code ? (
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold">
             #{activity.meta.code}
            </span>
           ) : (
            <span className="text-xs text-gray-400">—</span>
           )}
          </div>

          {/* Status Badge */}
          <div className="text-right">
           {getStatusBadge(activity.status)}
          </div>
         </div>
        ))}
       </div>

       {/* Pagination */}
       {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
         <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} ({activities.length} total activities)
         </p>
         <div className="flex gap-2">
          <Button
           variant="secondary"
           size="sm"
           onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
           disabled={currentPage === 1}
          >
           Previous
          </Button>
          <Button
           variant="secondary"
           size="sm"
           onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
           disabled={currentPage === totalPages}
          >
           Next
          </Button>
         </div>
        </div>
       )}
      </>
     )}
    </Card>

    {/* Email Modal */}
    <Modal
     isOpen={showEmailModal}
     onClose={() => setShowEmailModal(false)}
     title="Email Template for Building Manager"
     footer={
      <>
       <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
        Close
       </Button>
       <Button onClick={handleCopyEmail}>
        {emailCopied ? 'Copied!' : 'Copy to Clipboard'}
       </Button>
      </>
     }
    >
     <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
       <p className="text-xs font-semibold text-gray-500 mb-2">SUBJECT</p>
       <p className="text-sm text-gray-900 font-medium">
        Update intercom number for Apt [XX]
       </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
       <p className="text-xs font-semibold text-gray-500 mb-3">MESSAGE</p>
       <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {`Hi, could you please update my apartment's intercom phone number to ${magicNumber}?\n\nThis is my dedicated line for building access — no hardware changes required.\n\nThank you!`}
       </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
       <p className="text-xs text-blue-800">
        <strong>Tip:</strong> Replace [XX] with your actual apartment number before sending
       </p>
      </div>
     </div>
    </Modal>
   </div>
  </AppLayout>
 );
}
