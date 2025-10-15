import React from 'react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'muted';

export interface BadgeProps {
 variant?: BadgeVariant;
 children: React.ReactNode;
 className?: string;
}

const Badge: React.FC<BadgeProps> = ({ variant = 'muted', children, className = '' }) => {
 const baseStyles = `
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-xs font-semibold
 `;

 const variantStyles = {
  success: `
   bg-gradient-to-r from-green-50 to-emerald-50
   text-green-700
   border border-green-200
  `,
  danger: `
   bg-gradient-to-r from-red-50 to-rose-50
   text-red-700
   border border-red-200
  `,
  warning: `
   bg-gradient-to-r from-yellow-50 to-amber-50
   text-yellow-700
   border border-yellow-200
  `,
  info: `
   bg-gradient-to-r from-blue-50 to-indigo-50
   text-blue-700
   border border-blue-200
  `,
  muted: `
   bg-gradient-to-r from-gray-50 to-slate-50
   text-gray-600
   border border-gray-200
  `,
 };

 return (
  <span
   className={`
    ${baseStyles}
    ${variantStyles[variant]}
    ${className}
   `.trim().replace(/\s+/g, ' ')}
  >
   {children}
  </span>
 );
};

export default Badge;
