import { createContext, useContext, useState } from 'react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastViewport,
} from '../ui/toast';

const ToastContext = createContext({
  toast: (props) => {},
});

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = 'default', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToastProvider>
        {children}
        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}
