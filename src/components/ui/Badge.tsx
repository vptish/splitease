import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { X } from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'brand';

interface BadgeProps {
  variant?: BadgeVariant;
  removable?: boolean;
  onRemove?: () => void;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
  success:
    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  warning:
    'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  brand: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  brand: 'bg-blue-500',
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = 'default',
      removable = false,
      onRemove,
      dot = false,
      children,
      className,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          'transition-all duration-200',
          variantStyles[variant],
          className
        )}
      >
        {dot && (
          <div
            className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])}
          />
        )}
        <span>{children}</span>
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 hover:opacity-70 transition-opacity"
          >
            <X size={14} />
          </button>
        )}
      </motion.div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, type BadgeProps, type BadgeVariant };
