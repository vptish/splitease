import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface GlassCardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  motionProps?: Omit<MotionProps, 'children'>;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg',
  elevated:
    'bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl hover:shadow-3xl transition-shadow duration-300',
  outlined: 'bg-transparent backdrop-blur-md border border-white/30 shadow-md',
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      className,
      children,
      motionProps,
      onClick,
    },
    ref
  ) => {
    const baseStyles =
      'rounded-2xl overflow-hidden transition-all duration-300';
    const variantClass = variantStyles[variant];

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variantClass, className)}
        onClick={onClick}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, type GlassCardProps, type CardVariant };
