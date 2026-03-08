import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  onIconRightClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft: IconLeft,
      iconRight: IconRight,
      onIconRightClick,
      className,
      value,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const Icon = 18;

    return (
      <div className="w-full">
        <div className="relative">
          {label && (
            <motion.label
              animate={{
                y: isFocused || hasValue ? -24 : 0,
                scale: isFocused || hasValue ? 0.85 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-4 top-4 text-slate-600 dark:text-slate-400 pointer-events-none origin-left"
            >
              {label}
            </motion.label>
          )}

          <div className="relative">
            {IconLeft && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <IconLeft size={Icon} />
              </div>
            )}

            <input
              ref={ref}
              value={value}
              onChange={handleChange}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                'w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl',
                'text-slate-900 dark:text-white placeholder-transparent',
                'transition-all duration-200',
                'focus:outline-none focus:border-blue-500/50 focus:bg-white/15 focus:ring-2 focus:ring-blue-500/20',
                error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20',
                IconLeft && 'pl-10',
                IconRight && 'pr-10',
                className
              )}
              {...props}
            />

            {IconRight && (
              <button
                type="button"
                onClick={onIconRightClick}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <IconRight size={Icon} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}

        {helperText && !error && (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, type InputProps };
