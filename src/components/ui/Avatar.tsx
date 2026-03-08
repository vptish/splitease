import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: AvatarSize;
  borderColor?: string;
  color?: string;
  className?: string;
}

interface AvatarStackProps {
  avatars: (AvatarProps & { id?: string })[];
  size?: AvatarSize;
  maxVisible?: number;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
};

const colorMap: Record<string, string> = {
  red: 'bg-red-400 text-white',
  blue: 'bg-blue-400 text-white',
  green: 'bg-emerald-400 text-white',
  purple: 'bg-purple-400 text-white',
  yellow: 'bg-amber-400 text-white',
  pink: 'bg-pink-400 text-white',
  orange: 'bg-orange-400 text-white',
  cyan: 'bg-cyan-400 text-white',
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      initials,
      size = 'md',
      borderColor,
      color = 'blue',
      className,
    },
    ref
  ) => {
    const sizeClass = sizeStyles[size];
    const colorClass = colorMap[color] || colorMap.blue;

    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full font-semibold overflow-hidden flex-shrink-0',
          sizeClass,
          src ? 'bg-slate-200 dark:bg-slate-700' : colorClass,
          borderColor && `border-2 ${borderColor}`,
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          initials || '?'
        )}
      </motion.div>
    );
  }
);

Avatar.displayName = 'Avatar';

const AvatarStack = React.forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ avatars, size = 'sm', maxVisible = 3, className }, ref) => {
    const visibleAvatars = avatars.slice(0, maxVisible);
    const remainingCount = avatars.length - maxVisible;

    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
      >
        {visibleAvatars.map((avatar, index) => (
          <div
            key={avatar.id || index}
            className="relative"
            style={{ marginLeft: index === 0 ? 0 : -12 }}
          >
            <Avatar {...avatar} size={size} />
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'relative inline-flex items-center justify-center rounded-full font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
              sizeStyles[size]
            )}
            style={{ marginLeft: -12 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarStack.displayName = 'AvatarStack';

export {
  Avatar,
  AvatarStack,
  type AvatarProps,
  type AvatarStackProps,
  type AvatarSize,
};
