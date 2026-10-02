import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useFoodCircle } from '../../context/FoodCircleContext';

export default function Toast() {
  const { toastMessage } = useFoodCircle();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[2000] max-w-sm w-full animate-bounce-short">
      <div
        className={`flex items-center gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-semibold ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 text-white border-emerald-500/50 shadow-emerald-950/30'
            : toastMessage.type === 'info'
            ? 'bg-slate-900/90 text-white border-slate-700 shadow-slate-950/30'
            : 'bg-red-950/90 text-white border-red-500/50 shadow-red-950/30'
        }`}
      >
        {toastMessage.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
        )}
        <div className="flex-1 leading-snug">{toastMessage.message}</div>
      </div>
    </div>
  );
}
