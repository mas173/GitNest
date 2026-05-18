import { useToastStore } from '../../store/useToastStore';
import Toast from './Toast';

const ToastContainer = () => {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-4 z-[9999] flex flex-col-reverse gap-2"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
