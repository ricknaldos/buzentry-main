import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: ButtonVariant;
 size?: ButtonSize;
 children: React.ReactNode;
 fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, ...props }, ref) => {
  const baseStyles = `
   inline-flex items-center justify-center
   font-semibold transition-all duration-200
   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
   disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
   active:scale-95
  `;

  const variantStyles = {
   primary: `
    bg-gradient-to-r from-blue-500 to-indigo-600 text-white
    hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-lg shadow-blue-500/30
    focus-visible:outline-blue-500
   `,
   secondary: `
    bg-[var(--color-surface)] text-[var(--color-text-primary)]
    border border-[var(--color-border)]
    hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-light)] hover:shadow-sm
    focus-visible:outline-[var(--color-border-light)]
   `,
   ghost: `
    bg-transparent text-[var(--color-text-primary)]
    hover:bg-[var(--color-surface)]
    focus-visible:outline-[var(--color-text-muted)]
   `,
   destructive: `
    bg-[var(--color-danger)] text-white
    hover:opacity-90 hover:shadow-md
    focus-visible:outline-[var(--color-danger)]
   `,
  };

  const sizeStyles = {
   sm: 'px-3 py-1.5 text-sm rounded-lg',
   md: 'px-6 py-3 text-base rounded-[var(--radius-button)]',
   lg: 'px-8 py-4 text-base rounded-[var(--radius-button)]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
   <button
    ref={ref}
    className={`
     ${baseStyles}
     ${variantStyles[variant]}
     ${sizeStyles[size]}
     ${widthStyle}
     ${className}
    `.trim().replace(/\s+/g, ' ')}
    {...props}
   >
    {children}
   </button>
  );
 }
);

Button.displayName = 'Button';

export default Button;
