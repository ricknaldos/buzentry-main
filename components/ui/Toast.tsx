'use client';

import React, { useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
 variant?: ToastVariant;
 message: string;
 action?: {
  label: string;
  onClick: () => void;
 };
 duration?: number;
 onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
 variant = 'info',
 message,
 action,
 duration = 5000,
 onClose,
}) => {
 const [visible, setVisible] = useState(true);

 useEffect(() => {
  if (duration > 0) {
   const timer = setTimeout(() => {
    setVisible(false);
    setTimeout(() => onClose?.(), 300);
   }, duration);
   return () => clearTimeout(timer);
  }
 }, [duration, onClose]);

 const variantStyles = {
  success: 'border-l-[var(--color-success)]',
  error: 'border-l-[var(--color-danger)]',
  info: 'border-l-[var(--color-primary)]',
  warning: 'border-l-[var(--color-warning)]',
 };

 if (!visible) return null;

 return (
  <div
   role="alert"
   aria-live="polite"
   className={`
    fixed bottom-4 right-4 z-50
    bg-[var(--color-surface)]
    border border-[var(--color-border)]
    border-l-4 ${variantStyles[variant]}
    rounded-[var(--radius-md)]
    p-4 pr-8
    
    min-w-[320px] max-w-md
    transition-all duration-300
    ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
   `.trim().replace(/\s+/g, ' ')}
  >
   <div className="flex items-start justify-between gap-3">
    <p className="text-sm text-[var(--color-text-primary)] flex-1">
     {message}
    </p>
    {action && (
     <button
      onClick={action.onClick}
      className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
     >
      {action.label}
     </button>
    )}
    <button
     onClick={() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 300);
     }}
     className="absolute top-2 right-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
     aria-label="Close"
    >
     ×
    </button>
   </div>
  </div>
 );
};

export default Toast;
