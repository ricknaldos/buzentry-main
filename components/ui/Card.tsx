import React from 'react';

export interface CardProps {
 children: React.ReactNode;
 className?: string;
 padding?: 'none' | 'sm' | 'md' | 'lg';
 hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md', hover = false }) => {
 const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
 };

 const hoverStyles = hover ? 'hover:shadow-md hover:border-[var(--color-primary)] transition-all duration-200' : '';

 return (
  <div
   className={`
    bg-white
    border border-gray-200
    rounded-2xl
    transition-all duration-200
    ${paddingStyles[padding]}
    ${hoverStyles}
    ${className}
   `.trim().replace(/\s+/g, ' ')}
  >
   {children}
  </div>
 );
};

export default Card;
