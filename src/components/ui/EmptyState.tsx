import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: {
    iconSize: 40,
    titleSize: 'text-lg',
    descriptionSize: 'text-sm',
    spacing: 'gap-2',
  },
  md: {
    iconSize: 56,
    titleSize: 'text-2xl',
    descriptionSize: 'text-base',
    spacing: 'gap-4',
  },
  lg: {
    iconSize: 72,
    titleSize: 'text-3xl',
    descriptionSize: 'text-lg',
    spacing: 'gap-6',
  },
};

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon: Icon,
      title,
      description,
      action,
      size = 'md',
      className,
    },
    ref
  ) => {
    const styles = sizeStyles[size];

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'flex flex-col items-center justify-center py-12',
          styles.spacing,
          className
        )}
      >
        {Icon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', damping: 15 }}
            className="text-slate-300 dark:text-slate-700"
          >
            <Icon size={styles.iconSize} strokeWidth={1.5} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <h3
            className={cn(
              'font-semibold text-slate-900 dark:text-white',
              styles.titleSize
            )}
          >
            {title}
          </h3>

          {description && (
            <p
              className={cn(
                'text-slate-500 dark:text-slate-400 mt-2',
                styles.descriptionSize
              )}
            >
              {description}
            </p>
          )}
        </motion.div>

        {action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState, type EmptyStateProps };
