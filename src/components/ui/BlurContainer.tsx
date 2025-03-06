
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
}

const BlurContainer = ({
  intensity = 'medium',
  border = true,
  animate = false,
  delay = 0,
  className,
  children,
  ...props
}: BlurContainerProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'animate'>) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm bg-white/60',
    medium: 'backdrop-blur-md bg-white/70',
    heavy: 'backdrop-blur-lg bg-white/80',
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
          border ? 'border border-white/20' : '',
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
