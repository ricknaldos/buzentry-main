'use client';

import React, { useState } from 'react';

export interface ToggleProps {
 checked?: boolean;
 defaultChecked?: boolean;
 onChange?: (checked: boolean) => void;
 disabled?: boolean;
 label?: string;
 className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
 checked: controlledChecked,
 defaultChecked = false,
 onChange,
 disabled = false,
 label,
 className = '',
}) => {
 const [internalChecked, setInternalChecked] = useState(defaultChecked);
 const isControlled = controlledChecked !== undefined;
 const checked = isControlled ? controlledChecked : internalChecked;

 const handleToggle = () => {
  if (disabled) return;

  const newValue = !checked;

  if (!isControlled) {
   setInternalChecked(newValue);
  }

  onChange?.(newValue);
 };

 return (
  <label className={`inline-flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
   <div
    role="switch"
    aria-checked={checked}
    aria-label={label || 'Toggle'}
    tabIndex={disabled ? -1 : 0}
    onKeyDown={(e) => {
     if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
     }
    }}
    onClick={handleToggle}
    className={`
     relative w-14 h-7 rounded-full transition-all duration-200 shadow-inner
     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
     focus-visible:outline-blue-500
     ${checked ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'}
     ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    `}
   >
    <div
     className={`
      absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md
      transition-transform duration-200
      ${checked ? 'translate-x-7' : 'translate-x-0'}
     `}
    />
   </div>
   {label && (
    <span className="text-sm font-semibold text-gray-700">
     {label}
    </span>
   )}
  </label>
 );
};

export default Toggle;
