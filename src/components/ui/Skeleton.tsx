import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

type SkeletonVariant = 'text' | 'circle' | 'card' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
}

const shimmerAnimation = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0' },
};

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width = '100%',
      height = 'auto',
      count = 1,
      className,
    },
    ref
  ) => {
    const baseStyles =
      'bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800';
    const shimmerStyle = {
      backgroundSize: '200% 100%',
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'circle':
          return 'rounded-full';
        case 'card':
          return 'rounded-2xl h-40';
        case 'rect':
          return 'rounded-lg';
        case 'text':
        default:
          return 'rounded-md h-4';
      }
    };

    const skeletons = Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        ref={i === 0 ? ref : undefined}
        initial="initial"
        animate="animate"
        variants={shimmerAnimation}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(baseStyles, getVariantStyles(), className)}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...shimmerStyle,
        }}
      />
    ));

    if (count > 1) {
      return (
        <div className="space-y-3">
          {skeletons}
        </div>
      );
    }

    return skeletons[0];
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton, type SkeletonProps, type SkeletonVariant };
