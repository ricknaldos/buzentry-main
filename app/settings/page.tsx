'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, Input, Button, Toggle, Badge, Banner, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';

export default function SettingsPage() {
 const toast = useToast();
 const [doorCode, setDoorCode] = useState('');
 const [pinEnabled, setPinEnabled] = useState(false);
 const [pin, setPin] = useState('');
 const [confirmPin, setConfirmPin] = useState('');
 const [isPaused, setIsPaused] = useState(false);
 const [forwardNumber, setForwardNumber] = useState('');
 const [isSaving, setIsSaving] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [showDisableConfirm, setShowDisableConfirm] = useState(false);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [apiError, setApiError] = useState('');

 // Validate door code: 1-3 chars, only 0-9, #, *
 const validateDoorCode = (value: string): boolean => {
  const regex = /^[0-9#*]{1,3}$/;
  return regex.test(value);
 };

 // Validate PIN: 4 digits
 const validatePin = (value: string): boolean => {
  const regex = /^\d{4}$/;
  if (!regex.test(value)) return false;

  // Warn for trivial sequences
  const trivial = ['0000', '1234', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999'];
  return !trivial.includes(value);
 };

 // Validate E.164 phone number
 const validatePhone = (value: string): boolean => {
  const regex = /^\+[1-9]\d{1,14}$/;
  return regex.test(value);
 };

 useEffect(() => {
  const loadSettings = async () => {
   try {
    const response = await fetch('/api/user/settings');
    if (response.ok) {
     const data = await response.json();
     setDoorCode(data.doorCode || '');
     setPinEnabled(!!data.accessCode);
     setIsPaused(data.isPaused || false);
     setForwardNumber(data.forwardingNumber || '');
    }
   } catch (error) {
    console.error('Error loading settings:', error);
   } finally {
    setIsLoading(false);
   }
  };

  loadSettings();
 }, []);

 const handleSaveDoorCode = async () => {
  if (!validateDoorCode(doorCode)) {
   setErrors({ ...errors, doorCode: 'Door code must be 1-3 characters: 0-9, #, or *' });
   return;
  }

  setIsSaving(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ doorCode }),
   });

   if (response.ok) {
    setErrors({ ...errors, doorCode: '' });
    toast.success('Door code saved successfully!');
   } else {
    setApiError('Failed to save door code. Please try again.');
   }
  } catch (error) {
   console.error('Error saving door code:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleEnablePin = async () => {
  if (!validatePin(pin)) {
   setErrors({ ...errors, pin: 'PIN must be 4 digits and not a trivial sequence (0000, 1234, etc.)' });
   return;
  }

  if (pin !== confirmPin) {
   setErrors({ ...errors, confirmPin: 'PINs do not match' });
   return;
  }

  setIsSaving(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/access-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: pin }),
   });

   if (response.ok) {
    setPinEnabled(true);
    setPin('');
    setConfirmPin('');
    setErrors({});
    toast.success('Access PIN enabled successfully!');
   } else {
    setApiError('Failed to enable PIN. Please try again.');
   }
  } catch (error) {
   console.error('Error enabling PIN:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleUpdatePin = async () => {
  if (!validatePin(pin)) {
   setErrors({ ...errors, pin: 'PIN must be 4 digits and not a trivial sequence (0000, 1234, etc.)' });
   return;
  }

  if (pin !== confirmPin) {
   setErrors({ ...errors, confirmPin: 'PINs do not match' });
   return;
  }

  setIsSaving(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/access-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: pin }),
   });

   if (response.ok) {
    setPin('');
    setConfirmPin('');
    setErrors({});
    toast.success('Access PIN updated successfully!');
   } else {
    setApiError('Failed to update PIN. Please try again.');
   }
  } catch (error) {
   console.error('Error updating PIN:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleDisablePin = async () => {
  setIsSaving(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/access-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessCode: null }),
   });

   if (response.ok) {
    setPinEnabled(false);
    setShowDisableConfirm(false);
    toast.success('Access PIN removed successfully');
   } else {
    setApiError('Failed to disable PIN. Please try again.');
   }
  } catch (error) {
   console.error('Error disabling PIN:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleSaveForward = async () => {
  if (forwardNumber && !validatePhone(forwardNumber)) {
   setErrors({ ...errors, forwardNumber: 'Phone must be E.164 format (+1...)' });
   return;
  }

  setIsSaving(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/pause-forwarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forwardingNumber: forwardNumber }),
   });

   if (response.ok) {
    setErrors({ ...errors, forwardNumber: '' });
    toast.success('Forward number saved successfully!');
   } else {
    setApiError('Failed to save forward number. Please try again.');
   }
  } catch (error) {
   console.error('Error saving forward number:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handleTestSetup = async () => {
  try {
   const response = await fetch('/api/user/test-setup', { method: 'POST' });
   const data = await response.json();

   if (data.success) {
    toast.success('✓ Door tone detected. You\'re good to go!');
   } else {
    toast.error('✗ No DTMF confirmation. Try \'#\' or increase delay. Check your Door Code above and try a different value.');
   }
  } catch (error) {
   console.error('Error testing setup:', error);
   toast.error('✗ Test failed. Please try again.');
  }
 };

 const handleTestForwarding = async () => {
  if (!forwardNumber) {
   toast.error('Please enter a forwarding number first');
   return;
  }

  if (!validatePhone(forwardNumber)) {
   toast.error('Invalid phone number format');
   return;
  }

  setIsSaving(true);
  try {
   const response = await fetch('/api/user/test-forwarding', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ forwardingNumber: forwardNumber }),
   });

   const data = await response.json();

   if (response.ok && data.success) {
    toast.success(`✓ Test call initiated to ${forwardNumber}. You should receive a call shortly.`);
   } else {
    toast.error('✗ Test forwarding failed. Please check your number and try again.');
   }
  } catch (error) {
   console.error('Error testing forwarding:', error);
   toast.error('✗ Test failed. Please try again.');
  } finally {
   setIsSaving(false);
  }
 };

 const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  toast.warning('Pasting is disabled for security. Please type your PIN manually.');
 };

 if (isLoading) {
  return (
   <AppLayout>
    <div className="max-w-5xl mx-auto space-y-6">
     <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
      <p className="text-gray-600">Configure your door code, security, and system preferences</p>
     </div>
     <Card>
      <Skeleton variant="text" count={4} />
     </Card>
     <Card>
      <Skeleton variant="text" count={5} />
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
     <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
     <p className="text-gray-600">Configure your door code, security, and system preferences</p>
    </div>

    {/* API Error Banner */}
    {apiError && (
     <Banner
      variant="danger"
      message={apiError}
      onDismiss={() => setApiError('')}
     />
    )}

    {/* Door Code */}
    <Card>
     <h2 className="text-lg font-semibold text-gray-900 mb-3">Door Code</h2>
     <p className="text-sm text-gray-600 mb-6">
      This is the DTMF tone sent to unlock your door. Most buildings use <strong>1</strong> or <strong>2</strong>. If those don't work, try <strong>#</strong>.
     </p>

     <div className="max-w-md">
      <Input
       variant="code"
       label="Door Code"
       placeholder="1"
       value={doorCode}
       onChange={(e) => setDoorCode(e.target.value)}
       error={errors.doorCode}
       helperText="1-3 characters: 0-9, #, or *"
       maxLength={3}
      />
      <div className="mt-4">
       <Button onClick={handleSaveDoorCode} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Door Code'}
       </Button>
      </div>
     </div>
    </Card>

    {/* Security - Access Code */}
    <Card>
     <div className="flex items-center gap-3 mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Security</h2>
      <Badge variant="muted">Access Code (Optional)</Badge>
     </div>

     <ConfirmDialog
      isOpen={showDisableConfirm}
      onClose={() => setShowDisableConfirm(false)}
      onConfirm={handleDisablePin}
      title="Remove Access PIN?"
      message="Disabling the PIN reduces security. Guests will be able to unlock the door without entering a code. Are you sure you want to proceed?"
      confirmLabel="Remove PIN"
      cancelLabel="Cancel"
      variant="warning"
      isLoading={isSaving}
     />

     {pinEnabled ? (
      <div className="space-y-4">
       {/* Active PIN Card */}
       <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-start justify-between">
         <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
           <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
           </svg>
          </div>
          <div>
           <p className="font-semibold text-gray-900">Access Code Active</p>
           <p className="text-sm text-gray-600 mt-1">
            Guests must enter a 4-digit PIN before door unlocks
           </p>
          </div>
         </div>
        </div>
       </div>

       {/* Update PIN Section */}
       <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Update PIN</h3>
        <div className="max-w-md space-y-4">
         <div>
          <Input
           variant="code"
           label="New PIN (4 digits)"
           type="password"
           placeholder="••••"
           value={pin}
           onChange={(e) => setPin(e.target.value)}
           onPaste={handlePinPaste}
           error={errors.pin}
           maxLength={4}
          />
         </div>
         <div>
          <Input
           variant="code"
           label="Confirm New PIN"
           type="password"
           placeholder="••••"
           value={confirmPin}
           onChange={(e) => setConfirmPin(e.target.value)}
           onPaste={handlePinPaste}
           error={errors.confirmPin}
           maxLength={4}
          />
         </div>
         <div className="flex gap-3">
          <Button onClick={handleUpdatePin} disabled={isSaving}>
           {isSaving ? 'Updating...' : 'Update PIN'}
          </Button>
          <Button variant="destructive" onClick={() => setShowDisableConfirm(true)} disabled={isSaving}>
           Remove PIN
          </Button>
         </div>
        </div>
       </div>
      </div>
     ) : (
      <div className="space-y-4">
       <p className="text-sm text-gray-600 mb-4">
        Add an extra layer of security by requiring a 4-digit PIN before the door unlocks.
       </p>

       <div className="max-w-md space-y-4">
        <div>
         <Input
          variant="code"
          label="PIN (4 digits)"
          type="password"
          placeholder="••••"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          onPaste={handlePinPaste}
          error={errors.pin}
          helperText="Avoid trivial sequences like 0000 or 1234"
          maxLength={4}
         />
        </div>
        <div>
         <Input
          variant="code"
          label="Confirm PIN"
          type="password"
          placeholder="••••"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          onPaste={handlePinPaste}
          error={errors.confirmPin}
          maxLength={4}
         />
        </div>
        <Button onClick={handleEnablePin} disabled={isSaving}>
         {isSaving ? 'Enabling...' : 'Enable PIN'}
        </Button>
       </div>
      </div>
     )}
    </Card>

    {/* System Active Status */}
    <Card>
     <h2 className="text-lg font-semibold text-gray-900 mb-4">System Status</h2>

     <div className={`${isPaused ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'} border rounded-2xl p-4 mb-4`}>
      <div className="flex items-start justify-between">
       <div className="flex items-start gap-3">
        {!isPaused && (
         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
         </div>
        )}
        {isPaused && (
         <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
         </div>
        )}
        <div>
         <p className="font-semibold text-gray-900">
          {isPaused ? 'System Paused' : 'System Active'}
         </p>
         <p className="text-sm text-gray-600 mt-1">
          {isPaused
           ? 'Auto-unlock is disabled. Calls will be forwarded if configured.'
           : 'Auto-unlock is enabled. Door will unlock automatically.'
          }
         </p>
        </div>
       </div>
       <Toggle
        checked={!isPaused}
        onChange={(active) => setIsPaused(!active)}
       />
      </div>
     </div>

     <div className="flex gap-3">
      <Button variant="secondary" onClick={handleTestSetup}>
       Test My Setup
      </Button>
     </div>
    </Card>

    {/* System Control - Pause Forwarding */}
    <Card>
     <div className="flex items-center gap-3 mb-6">
      <h2 className="text-lg font-semibold text-gray-900">System Control</h2>
      <Badge variant="muted">Pause Forwarding (Optional)</Badge>
     </div>

     <p className="text-sm text-gray-600 mb-4">
      When the system is paused, calls can be forwarded to your phone for manual control.
     </p>

     <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6">
      <p className="text-xs text-yellow-800">
       <strong>Note:</strong> Normal call-forwarding rates may apply from your carrier.
      </p>
     </div>

     <div className="max-w-md space-y-4">
      <Input
       variant="phone"
       label="Forward to Phone"
       placeholder="+1234567890"
       value={forwardNumber}
       onChange={(e) => setForwardNumber(e.target.value)}
       error={errors.forwardNumber}
       helperText="E.164 format (+1...). Leave empty to disable forwarding."
      />

      <div className="flex gap-3">
       <Button onClick={handleSaveForward} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Forward Number'}
       </Button>
       {forwardNumber && (
        <Button variant="secondary" onClick={handleTestForwarding} disabled={isSaving}>
         Test Forwarding
        </Button>
       )}
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
        Having trouble with setup or need assistance with configuration?
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
