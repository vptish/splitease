import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/cn';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  actions?: ModalAction[];
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  showCloseButton = true,
  closeOnBackdropClick = true,
  size = 'md',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdropClick ? onClose : undefined}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'pointer-events-auto w-full sm:w-auto',
                'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
                'border border-white/20 dark:border-slate-800/50',
                'rounded-t-3xl sm:rounded-3xl',
                'shadow-2xl',
                'p-6',
                sizeStyles[size]
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* Content */}
              {children && <div className="mb-6">{children}</div>}

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div
                  className={cn(
                    'flex gap-3',
                    actions.length === 1 ? 'flex-col' : 'flex-row'
                  )}
                >
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant || 'secondary'}
                      onClick={action.onClick}
                      loading={action.loading}
                      fullWidth={actions.length === 1}
                      className="flex-1"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

export { Modal, type ModalProps, type ModalAction };
