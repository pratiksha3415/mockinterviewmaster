
import React from 'react';
import { cn } from '@/lib/utils';

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  children: React.ReactNode;
}

const BlurContainer = ({
  intensity = 'medium',
  border = true,
  className,
  children,
  ...props
}: BlurContainerProps) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm bg-white/60',
    medium: 'backdrop-blur-md bg-white/70',
    heavy: 'backdrop-blur-lg bg-white/80',
  };

  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm',
        blurIntensity[intensity],
        border ? 'border border-white/20' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
