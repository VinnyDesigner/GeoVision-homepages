import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import { CheckCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useAppState();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-[9999] flex items-center gap-3 glass-level-3 px-5 py-3.5 rounded-2xl shadow-2xl border border-white/80 dark:border-white/10 glow-blue-lg animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-geovision-blue/15 text-geovision-blue flex items-center justify-center font-bold shrink-0">
        <CheckCircle className="w-5 h-5 text-geovision-blue" />
      </div>
      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{toastMessage}</span>
    </div>
  );
};
