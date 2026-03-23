import React from 'react';
import { ToastState } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastState | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type}`}>
      {toast.message}
    </div>
  );
};
