import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { LucideIcon, Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30',
  secondary:
    'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 hover:border-white/40',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-base gap-2',
  lg: 'px-6 py-3.5 text-lg gap-2.5',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      iconLeft: IconLeft,
      iconRight: IconRight,
      children,
      className,
      onClick,
      ...rest
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantClass = variantStyles[variant];
    const sizeClass = sizeStyles[size];

    const Icon = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantClass,
          sizeClass,
          fullWidth && 'w-full',
          className
        )}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || loading}
        onClick={onClick}
        type="button"
        {...rest}
      >
        {loading ? (
          <Loader2 size={Icon} className="animate-spin" />
        ) : (
          <>
            {IconLeft && <IconLeft size={Icon} />}
            {children && <span>{children}</span>}
            {IconRight && <IconRight size={Icon} />}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
