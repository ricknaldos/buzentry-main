import React from 'react';

export type BannerVariant = 'info' | 'warning' | 'error' | 'danger' | 'success';

export interface BannerProps {
 variant?: BannerVariant;
 message: string;
 action?: {
  label: string;
  onClick: () => void;
 };
 onDismiss?: () => void;
 className?: string;
}

const Banner: React.FC<BannerProps> = ({
 variant = 'info',
 message,
 action,
 onDismiss,
 className = '',
}) => {
 const variantStyles = {
  info: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-gray-900',
  warning: 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300 text-gray-900',
  error: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-gray-900',
  danger: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300 text-gray-900',
  success: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-gray-900',
 };

 return (
  <div
   role="alert"
   className={`
    border-l-4 p-4 rounded-2xl
    animate-slide-down
    transition-all duration-300
    ${variantStyles[variant]}
    ${className}
   `.trim().replace(/\s+/g, ' ')}
  >
   <div className="flex items-start justify-between gap-4">
    <p className="text-sm flex-1">{message}</p>
    <div className="flex items-center gap-2">
     {action && (
      <button
       onClick={action.onClick}
       className="text-sm font-semibold hover:underline"
      >
       {action.label}
      </button>
     )}
     {onDismiss && (
      <button
       onClick={onDismiss}
       className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
       aria-label="Dismiss"
      >
       ×
      </button>
     )}
    </div>
   </div>
  </div>
 );
};

export default Banner;
