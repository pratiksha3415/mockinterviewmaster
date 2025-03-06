
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface BlurContainerProps {
  intensity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
  className?: string;
  colorVariant?: 'default' | 'blue' | 'purple' | 'teal' | 'rose';
}

const BlurContainer = ({
  intensity = 'medium',
  border = true,
  animate = false,
  delay = 0,
  className,
  colorVariant = 'default',
  children,
  ...props
}: BlurContainerProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'animate'>) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };

  const colorVariants = {
    default: 'bg-white/70',
    blue: 'bg-blue-50/80',
    purple: 'bg-purple-50/80',
    teal: 'bg-teal-50/80',
    rose: 'bg-rose-50/80',
  };

  const borderVariants = {
    default: 'border-white/20',
    blue: 'border-blue-200/40',
    purple: 'border-purple-200/40',
    teal: 'border-teal-200/40',
    rose: 'border-rose-200/40',
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          'rounded-2xl shadow-sm',
          blurIntensity[intensity],
          colorVariants[colorVariant],
          border ? `border ${borderVariants[colorVariant]}` : '',
          className
        )}
        {...props as any}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl shadow-sm',
        blurIntensity[intensity],
        colorVariants[colorVariant],
        border ? `border ${borderVariants[colorVariant]}` : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
