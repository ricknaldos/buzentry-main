'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastVariant } from '@/components/ui/Toast';

interface ToastOptions {
  variant?: ToastVariant;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = { ...options, id };

    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showToast({ variant: 'success', message, duration });
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast({ variant: 'error', message, duration });
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast({ variant: 'info', message, duration });
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast({ variant: 'warning', message, duration });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className="pointer-events-auto"
            style={{
              animation: 'slide-in-from-right 0.3s ease-out',
              transform: `translateY(-${index * 8}px)`,
            }}
          >
            <Toast
              variant={toast.variant}
              message={toast.message}
              action={toast.action}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
