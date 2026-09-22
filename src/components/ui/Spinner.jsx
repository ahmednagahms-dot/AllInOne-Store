import React from "react";
import { ShoppingBag } from "lucide-react";

export default function Spinner({ fullScreen = false }) {
  const content = (
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-100 dark:border-slate-800 border-t-blue-600 dark:border-t-blue-600 rounded-full animate-spin"></div>
     
      <div className="absolute flex items-center justify-center w-full h-full text-blue-600 dark:text-blue-600">
        <ShoppingBag size={22} className="animate-pulse" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full p-12">
      {content}
    </div>
  );
}