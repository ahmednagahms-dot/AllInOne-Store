import React from 'react';
import { Check, X } from 'lucide-react';

export default function Toast({ toastMessage }) {
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl transition-all duration-300 animate-bounce">
      {toastMessage.type === 'success' ? (
        <Check className="w-5 h-5 text-emerald-400" />
      ) : (
        <X className="w-5 h-5 text-rose-400" />
      )}
      <span className="text-sm font-medium">{toastMessage.message}</span>
    </div>
  );
}