'use client';

import React, { useEffect } from 'react';

export interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title?: string;
 children: React.ReactNode;
 footer?: React.ReactNode;
 maxWidth?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({
 isOpen,
 onClose,
 title,
 children,
 footer,
 maxWidth = 'md',
}) => {
 useEffect(() => {
  if (isOpen) {
   document.body.style.overflow = 'hidden';
  } else {
   document.body.style.overflow = 'unset';
  }
  return () => {
   document.body.style.overflow = 'unset';
  };
 }, [isOpen]);

 useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
   if (e.key === 'Escape' && isOpen) {
    onClose();
   }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 const maxWidthStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
 };

 return (
  <div
   className="fixed inset-0 z-50 flex items-center justify-center p-4"
   role="dialog"
   aria-modal="true"
   aria-labelledby={title ? 'modal-title' : undefined}
  >
   {/* Backdrop */}
   <div
    className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
    onClick={onClose}
    aria-hidden="true"
   />

   {/* Modal Content */}
   <div
    className={`
     relative w-full ${maxWidthStyles[maxWidth]}
     bg-[var(--color-surface)]
     rounded-[var(--radius-modal)]
     
     p-6
     animate-scale-in
    `.trim().replace(/\s+/g, ' ')}
   >
    {/* Header */}
    {title && (
     <div className="mb-4">
      <h2
       id="modal-title"
       className="text-xl font-bold text-[var(--color-text-primary)]"
      >
       {title}
      </h2>
     </div>
    )}

    {/* Body */}
    <div className="mb-6">
     {children}
    </div>

    {/* Footer */}
    {footer && (
     <div className="flex justify-end gap-3">
      {footer}
     </div>
    )}

    {/* Close button */}
    <button
     onClick={onClose}
     className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
     aria-label="Close modal"
    >
     <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
     </svg>
    </button>
   </div>
  </div>
 );
};

export default Modal;
