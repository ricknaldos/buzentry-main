import React from 'react';

export type InputVariant = 'text' | 'phone' | 'code';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
 variant?: InputVariant;
 label?: string;
 error?: string;
 helperText?: string;
 fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ variant = 'text', label, error, helperText, fullWidth = true, className = '', ...props }, ref) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseStyles = `
   w-full px-4 py-3
   bg-white
   border border-gray-200
   rounded-2xl
   text-gray-900
   placeholder:text-gray-400
   transition-all duration-200
   hover:border-gray-300 hover:shadow-sm
   focus:outline-none focus:border-blue-500 focus:shadow-md
   focus:ring-4 focus:ring-blue-50
   disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
  `;

  const variantStyles = {
   text: '',
   phone: 'font-mono tracking-wide',
   code: 'font-mono text-center tracking-widest text-lg',
  };

  const errorStyles = error
   ? `
    border-red-300
    focus:border-red-500
    focus:ring-red-50
   `
   : '';

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
   <div className={widthStyle}>
    {label && (
     <label
      htmlFor={id}
      className="block text-sm font-semibold text-gray-700 mb-2"
     >
      {label}
     </label>
    )}
    <input
     ref={ref}
     id={id}
     className={`
      ${baseStyles}
      ${variantStyles[variant]}
      ${errorStyles}
      ${className}
     `.trim().replace(/\s+/g, ' ')}
     aria-invalid={error ? 'true' : 'false'}
     aria-describedby={
      error ? `${id}-error` : helperText ? `${id}-helper` : undefined
     }
     {...props}
    />
    {error && (
     <p
      id={`${id}-error`}
      className="mt-2 text-sm text-red-600 font-medium animate-slide-down"
      role="alert"
     >
      {error}
     </p>
    )}
    {helperText && !error && (
     <p
      id={`${id}-helper`}
      className="mt-2 text-sm text-gray-500 transition-opacity duration-200"
     >
      {helperText}
     </p>
    )}
   </div>
  );
 }
);

Input.displayName = 'Input';

export default Input;
