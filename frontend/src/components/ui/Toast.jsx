import { useEffect, useRef } from 'react';
import { useToastStore } from '../../store/useToastStore';

const ICONS = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    </svg>
  ),
};

const TYPE_STYLES = {
  success: 'bg-green-50 border-green-400 text-green-800 dark:bg-green-900/40 dark:border-green-500 dark:text-green-200',
  error:   'bg-red-50 border-red-400 text-red-800 dark:bg-red-900/40 dark:border-red-500 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-500 dark:text-yellow-200',
  info:    'bg-blue-50 border-blue-400 text-blue-800 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-200',
};

const ICON_STYLES = {
  success: 'text-green-500 dark:text-green-400',
  error:   'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info:    'text-blue-500 dark:text-blue-400',
};

const Toast = ({ id, message, type, duration }) => {
  const removeToast = useToastStore((s) => s.removeToast);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timerRef.current);
  }, [id, duration, removeToast]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 w-80 max-w-full rounded-lg border px-4 py-3 shadow-lg
        animate-slide-in transition-all ${TYPE_STYLES[type] ?? TYPE_STYLES.info}`}
    >
      <span className={`mt-0.5 shrink-0 ${ICON_STYLES[type] ?? ICON_STYLES.info}`}>
        {ICONS[type] ?? ICONS.info}
      </span>
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        aria-label="Dismiss notification"
        onClick={() => removeToast(id)}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
