
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  children: React.ReactNode;
  animate?: boolean;
  delay?: number;
}

const BlurContainer = ({
  intensity = 'medium',
  border = true,
  animate = false,
  delay = 0,
  className,
  children,
  ...props
}: BlurContainerProps) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm bg-white/60',
    medium: 'backdrop-blur-md bg-white/70',
    heavy: 'backdrop-blur-lg bg-white/80',
  };

  const Container = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    exit: { opacity: 0, y: -10 }
  } : {};

  return (
    <Container
      className={cn(
        'rounded-2xl shadow-sm',
        blurIntensity[intensity],
        border ? 'border border-white/20' : '',
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Container>
  );
};

export default BlurContainer;
