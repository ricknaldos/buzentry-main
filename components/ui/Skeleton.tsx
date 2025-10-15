import React from 'react';

export type SkeletonVariant = 'text' | 'card' | 'stat' | 'row' | 'circle' | 'button';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const baseStyles = `
    bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
    bg-[length:200%_100%]
    animate-pulse
    rounded-lg
  `;

  const variantStyles = {
    text: 'h-4 w-full',
    card: 'h-48 w-full rounded-2xl',
    stat: 'h-32 w-full rounded-2xl',
    row: 'h-16 w-full',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-12 w-32 rounded-full',
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  const skeletonElement = (index: number) => (
    <div
      key={index}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      style={style}
      aria-label="Loading..."
      role="status"
    />
  );

  if (count === 1) {
    return skeletonElement(0);
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => skeletonElement(index))}
    </div>
  );
};

export default Skeleton;
