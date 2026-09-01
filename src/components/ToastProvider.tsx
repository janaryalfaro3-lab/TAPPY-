import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ShoppingBag,
  Info,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../types';

export interface Toast {
  id: string;
  type: 'success' | 'cart' | 'info' | 'warning';
  title: string;
  message?: string;
  product?: Product;
  quantity?: number;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => string;
  showCartToast: (product: Product, quantity: number, onViewCart: () => void) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toastData: Omit<Toast, 'id'>) => {
      const id = 'toast_' + Math.random().toString(36).substring(2, 9) + Date.now();
      const newToast: Toast = {
        ...toastData,
        id,
        duration: toastData.duration || 4000,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, 4)); // max 4 toasts at once

      return id;
    },
    []
  );

  const showCartToast = useCallback(
    (product: Product, quantity: number, onViewCart: () => void) => {
      return showToast({
        type: 'cart',
        title: 'Added to Cart',
        message: `${quantity}x ${product.name} (₱${(product.price * quantity).toLocaleString()})`,
        product,
        quantity,
        duration: 4500,
        action: {
          label: 'View Cart',
          onClick: onViewCart,
        },
      });
    },
    [showToast]
  );

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        showCartToast,
        removeToast,
        clearToasts,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{
  toasts: Toast[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  return (
    <aside
      aria-label="Notifications"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
        ))}
      </AnimatePresence>
    </aside>
  );
};

const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: () => void;
}> = ({ toast, onDismiss }) => {
  const duration = toast.duration || 4000;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-sky-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  const getAccentBorder = () => {
    switch (toast.type) {
      case 'cart':
        return 'border-sky-500/50 shadow-sky-500/10';
      case 'success':
        return 'border-emerald-500/50 shadow-emerald-500/10';
      case 'warning':
        return 'border-amber-500/50 shadow-amber-500/10';
      default:
        return 'border-slate-700 shadow-slate-900/50';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92, x: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 40, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`pointer-events-auto relative w-full bg-slate-900/95 backdrop-blur-2xl border ${getAccentBorder()} rounded-2xl p-4 shadow-2xl overflow-hidden ring-1 ring-white/10`}
    >
      {/* Top progress bar animation */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute top-0 left-0 h-1 ${
          toast.type === 'cart'
            ? 'bg-gradient-to-r from-sky-400 to-teal-400'
            : toast.type === 'success'
            ? 'bg-emerald-400'
            : toast.type === 'warning'
            ? 'bg-amber-400'
            : 'bg-sky-400'
        }`}
      />

      <div className="flex items-start gap-3 pt-1">
        {/* Icon / Thumbnail Box */}
        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
          {getIcon()}
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider font-mono text-white">
              {toast.title}
            </h4>
            {toast.type === 'cart' && (
              <Sparkles className="w-3 h-3 text-sky-400 animate-pulse" />
            )}
          </div>

          {toast.message && (
            <p className="text-xs text-slate-300 mt-0.5 leading-snug font-medium line-clamp-2">
              {toast.message}
            </p>
          )}

          {/* Action button if provided */}
          {toast.action && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>{toast.action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Close Button */}
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
