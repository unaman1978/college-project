import React from 'react';

export interface ToastData {
  message: string;
  type?: 'success' | 'error' | 'delete' | 'info';
}

interface ToastProps {
  toast: ToastData | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  let icon = 'check_circle';
  let iconColor = 'text-primary-container';

  if (toast.type === 'error' || toast.type === 'delete') {
    icon = toast.type === 'delete' ? 'delete' : 'error';
    iconColor = 'text-red-400';
  } else if (toast.type === 'info') {
    icon = 'info';
    iconColor = 'text-blue-300';
  }

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#213145] text-[#eaf1ff] px-4 py-2.5 rounded-full shadow-2xl text-xs sm:text-sm font-semibold flex items-center space-x-2 border border-slate-700/60 pointer-events-none transition-all duration-300 animate-bounce">
      <span className={`material-symbols-outlined text-[18px] ${iconColor}`}>
        {icon}
      </span>
      <span>{toast.message}</span>
    </div>
  );
};
