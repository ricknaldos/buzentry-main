'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, Input, Button, Badge, Modal, Banner, ConfirmDialog, Skeleton } from '@/components/ui';
import { useToast } from '@/contexts/ToastContext';

interface GuestPass {
 id: string;
 label: string;
 code: string;
 maxUses: number;
 usesRemaining: number;
 expiresAt: string;
 enabled: boolean;
 notifyOnUse: boolean;
}

export default function GuestAccessPage() {
 const toast = useToast();
 const [passes, setPasses] = useState<GuestPass[]>([]);
 const [showCreateModal, setShowCreateModal] = useState(false);
 const [showEditModal, setShowEditModal] = useState(false);
 const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
 const [selectedPass, setSelectedPass] = useState<GuestPass | null>(null);
 const [apiError, setApiError] = useState('');
 const [isLoading, setIsLoading] = useState(true);

 // Form state
 const [label, setLabel] = useState('');
 const [maxUses, setMaxUses] = useState('');
 const [expiresAt, setExpiresAt] = useState('');
 const [notifyOnUse, setNotifyOnUse] = useState(false);

 useEffect(() => {
  fetchPasses();
 }, []);

 const fetchPasses = async () => {
  setIsLoading(true);
  setApiError('');
  try {
   const response = await fetch('/api/user/passcodes');
   if (response.ok) {
    const data = await response.json();
    setPasses(data.passcodes || []);
   } else {
    setApiError('Failed to load guest passes. Please refresh the page.');
   }
  } catch (error) {
   console.error('Error fetching passes:', error);
   setApiError('Network error. Please check your connection and try again.');
  } finally {
   setIsLoading(false);
  }
 };

 const handleCreate = async () => {
  setApiError('');
  try {
   const response = await fetch('/api/user/passcodes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     label,
     maxUsages: parseInt(maxUses),
     expiresAt: new Date(expiresAt).toISOString(),
     notifyOnUse,
    }),
   });

   if (response.ok) {
    await fetchPasses();
    setShowCreateModal(false);
    resetForm();
    toast.success('Guest passcode created successfully!');
   } else {
    setApiError('Failed to create guest pass. Please try again.');
   }
  } catch (error) {
   console.error('Error creating pass:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 const handleEdit = async () => {
  if (!selectedPass) return;

  setApiError('');
  try {
   const response = await fetch(`/api/user/passcodes/${selectedPass.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     label,
     maxUsages: parseInt(maxUses),
     expiresAt: new Date(expiresAt).toISOString(),
     notifyOnUse,
    }),
   });

   if (response.ok) {
    await fetchPasses();
    setShowEditModal(false);
    setSelectedPass(null);
    resetForm();
    toast.success('Guest passcode updated successfully!');
   } else {
    setApiError('Failed to update guest pass. Please try again.');
   }
  } catch (error) {
   console.error('Error updating pass:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 const handleToggle = async (pass: GuestPass) => {
  setApiError('');
  try {
   const response = await fetch(`/api/user/passcodes/${pass.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled: !pass.enabled }),
   });

   if (response.ok) {
    await fetchPasses();
    toast.success(`Passcode ${!pass.enabled ? 'enabled' : 'disabled'} successfully`);
   } else {
    setApiError('Failed to toggle guest pass. Please try again.');
   }
  } catch (error) {
   console.error('Error toggling pass:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 const handleDeleteClick = (pass: GuestPass) => {
  setSelectedPass(pass);
  setShowDeleteConfirm(true);
 };

 const handleDelete = async () => {
  if (!selectedPass) return;

  setApiError('');
  try {
   const response = await fetch(`/api/user/passcodes/${selectedPass.id}`, {
    method: 'DELETE',
   });

   if (response.ok) {
    await fetchPasses();
    toast.success('Guest passcode deleted successfully');
    setShowDeleteConfirm(false);
    setSelectedPass(null);
   } else {
    setApiError('Failed to delete guest pass. Please try again.');
   }
  } catch (error) {
   console.error('Error deleting pass:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 const [showBulkDisableConfirm, setShowBulkDisableConfirm] = useState(false);

 const handleBulkDisable = async () => {
  const enabledPasses = passes.filter((pass) => pass.enabled);
  if (enabledPasses.length === 0) {
   toast.warning('No active passcodes to disable');
   return;
  }

  setApiError('');
  try {
   const results = await Promise.all(
    enabledPasses.map((pass) =>
     fetch(`/api/user/passcodes/${pass.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: false }),
     })
    )
   );

   const allSuccess = results.every((res) => res.ok);

   if (allSuccess) {
    await fetchPasses();
    toast.success(`Successfully disabled ${enabledPasses.length} passcode(s)`);
    setShowBulkDisableConfirm(false);
   } else {
    setApiError('Some passcodes failed to disable. Please try again.');
   }
  } catch (error) {
   console.error('Error bulk disabling passes:', error);
   setApiError('Network error. Please check your connection and try again.');
  }
 };

 const resetForm = () => {
  setLabel('');
  setMaxUses('');
  setExpiresAt('');
  setNotifyOnUse(false);
 };

 const openEditModal = (pass: GuestPass) => {
  setSelectedPass(pass);
  setLabel(pass.label);
  setMaxUses(pass.maxUses.toString());
  setExpiresAt(pass.expiresAt.split('T')[0]);
  setNotifyOnUse(pass.notifyOnUse);
  setShowEditModal(true);
 };

 return (
  <AppLayout>
   <div className="max-w-5xl mx-auto space-y-6">
    <div>
     <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Access</h1>
     <p className="text-gray-600">Create temporary passcodes for guests and deliveries</p>
    </div>

    {/* API Error Banner */}
    {apiError && (
     <Banner
      variant="danger"
      message={apiError}
      onDismiss={() => setApiError('')}
     />
    )}

    {/* How It Works */}
    <Card className="bg-blue-50 border-blue-100">
     <div className="flex items-start gap-3 mb-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
       </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900">How It Works</h2>
     </div>

     <div className="space-y-3 ml-11">
      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">1</span>
       </div>
       <p className="text-sm text-gray-700 pt-0.5">
        <strong>Guest calls your building's callbox</strong> and enters your apartment number (or number given by building)
       </p>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">2</span>
       </div>
       <p className="text-sm text-gray-700 pt-0.5">
        <strong>Your Magic Number answers automatically</strong> and prompts for a passcode
       </p>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">3</span>
       </div>
       <p className="text-sm text-gray-700 pt-0.5">
        <strong>Guest enters the passcode you gave them, then presses # (pound key)</strong> or speaks it aloud
       </p>
      </div>

      <div className="flex items-start gap-3">
       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span className="text-xs font-bold text-white">4</span>
       </div>
       <p className="text-sm text-gray-700 pt-0.5">
        <strong>Door unlocks automatically</strong> - no action needed from you!
       </p>
      </div>
     </div>
    </Card>

    {/* Active Passcodes */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
     <div>
      <h2 className="text-xl font-semibold text-gray-900">Active Passcodes</h2>
      <p className="text-sm text-gray-600 mt-1">
       Create passcodes for guests - tell them to enter the code then press # (pound key), or speak it aloud
      </p>
     </div>
     <div className="flex gap-2">
      {passes.filter((p) => p.enabled).length > 0 && (
       <Button variant="destructive" onClick={() => setShowBulkDisableConfirm(true)}>
        Disable All Passes
       </Button>
      )}
      <Button onClick={() => setShowCreateModal(true)}>
       + Generate Passcode
      </Button>
     </div>
    </div>

    {/* Passcodes List */}
    <Card padding="none">
     {isLoading ? (
      <div className="p-6 space-y-3">
       <Skeleton variant="row" count={3} />
      </div>
     ) : passes.length === 0 ? (
      <div className="p-12 text-center">
       <p className="text-gray-500 mb-2">No passcodes generated yet</p>
       <p className="text-sm text-gray-400">
        Click "Generate Passcode" to create temporary access codes
       </p>
      </div>
     ) : (
      <div className="divide-y divide-gray-200">
       {passes.map((pass) => (
        <div
         key={pass.id}
         className="p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200 animate-fade-in"
         style={{ opacity: pass.enabled ? 1 : 0.6 }}
        >
         <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
           <h3 className="font-semibold text-gray-900">{pass.label}</h3>
           <Badge variant={pass.enabled ? 'success' : 'muted'}>
            {pass.enabled ? 'Active' : 'Disabled'}
           </Badge>
           {new Date(pass.expiresAt) <= new Date() && (
            <Badge variant="danger">Expired</Badge>
           )}
          </div>
          <p className="text-sm text-gray-600">
           Code: <span className="font-mono font-semibold">{pass.code}</span> ·
           Uses: {pass.usesRemaining}/{pass.maxUses} ·
           Expires: {new Date(pass.expiresAt).toLocaleDateString()}
          </p>
         </div>
         <div className="flex items-center gap-2">
          <Button
           variant="secondary"
           size="sm"
           onClick={() => handleToggle(pass)}
          >
           {pass.enabled ? 'Disable' : 'Enable'}
          </Button>
          <Button
           variant="secondary"
           size="sm"
           onClick={() => openEditModal(pass)}
          >
           Edit
          </Button>
          <Button
           variant="destructive"
           size="sm"
           onClick={() => handleDeleteClick(pass)}
          >
           Delete
          </Button>
         </div>
        </div>
       ))}
      </div>
     )}
    </Card>

    {/* Create Modal */}
    <Modal
     isOpen={showCreateModal}
     onClose={() => {
      setShowCreateModal(false);
      resetForm();
     }}
     title="Create Guest Pass"
     footer={
      <>
       <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
        Cancel
       </Button>
       <Button onClick={handleCreate}>Create</Button>
      </>
     }
    >
     <div className="space-y-4">
      <Input
       label="Label"
       placeholder="Weekend Guest"
       value={label}
       onChange={(e) => setLabel(e.target.value)}
      />
      <Input
       label="Max Uses"
       type="number"
       placeholder="5"
       value={maxUses}
       onChange={(e) => setMaxUses(e.target.value)}
      />
      <Input
       label="Expires At"
       type="date"
       value={expiresAt}
       onChange={(e) => setExpiresAt(e.target.value)}
      />
      <label className="flex items-center gap-2">
       <input
        type="checkbox"
        checked={notifyOnUse}
        onChange={(e) => setNotifyOnUse(e.target.checked)}
       />
       <span className="text-sm text-gray-700">Notify me on use</span>
      </label>

      {/* Code Entropy Hint */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
       <p className="text-xs text-yellow-800">
        <strong>Tip:</strong> Avoid simple sequences like 1111, 1234, or 0000 for better security.
       </p>
      </div>
     </div>
    </Modal>

    {/* Edit Modal */}
    <Modal
     isOpen={showEditModal}
     onClose={() => {
      setShowEditModal(false);
      setSelectedPass(null);
      resetForm();
     }}
     title="Edit Guest Pass"
     footer={
      <>
       <Button variant="secondary" onClick={() => setShowEditModal(false)}>
        Cancel
       </Button>
       <Button onClick={handleEdit}>Save</Button>
      </>
     }
    >
     <div className="space-y-4">
      <Input
       label="Label"
       placeholder="Weekend Guest"
       value={label}
       onChange={(e) => setLabel(e.target.value)}
      />
      <Input
       label="Max Uses"
       type="number"
       placeholder="5"
       value={maxUses}
       onChange={(e) => setMaxUses(e.target.value)}
      />
      <Input
       label="Expires At"
       type="date"
       value={expiresAt}
       onChange={(e) => setExpiresAt(e.target.value)}
      />
      <label className="flex items-center gap-2">
       <input
        type="checkbox"
        checked={notifyOnUse}
        onChange={(e) => setNotifyOnUse(e.target.checked)}
       />
       <span className="text-sm text-gray-700">Notify me on use</span>
      </label>

      {/* Code Entropy Hint */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
       <p className="text-xs text-yellow-800">
        <strong>Tip:</strong> Avoid simple sequences like 1111, 1234, or 0000 for better security.
       </p>
      </div>
     </div>
    </Modal>

    {/* Delete Confirmation Dialog */}
    <ConfirmDialog
     isOpen={showDeleteConfirm}
     onClose={() => {
      setShowDeleteConfirm(false);
      setSelectedPass(null);
     }}
     onConfirm={handleDelete}
     title="Delete Guest Passcode?"
     message={`Are you sure you want to delete the passcode "${selectedPass?.label}"? This action cannot be undone and the code will immediately stop working.`}
     confirmLabel="Delete"
     cancelLabel="Cancel"
     variant="danger"
    />

    {/* Bulk Disable Confirmation Dialog */}
    <ConfirmDialog
     isOpen={showBulkDisableConfirm}
     onClose={() => setShowBulkDisableConfirm(false)}
     onConfirm={handleBulkDisable}
     title="Disable All Guest Passcodes?"
     message={`This will disable ${passes.filter((p) => p.enabled).length} active passcode(s). Guests will no longer be able to use them until you re-enable them individually.`}
     confirmLabel="Disable All"
     cancelLabel="Cancel"
     variant="warning"
    />
   </div>
  </AppLayout>
 );
}
