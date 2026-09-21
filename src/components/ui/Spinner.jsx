import React from "react";
import { ShoppingBag } from "lucide-react";

export default function Spinner({ fullScreen = false }) {
  const content = (
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-gray-100 border-t-[#2149b8] rounded-full animate-spin"></div>
      
      {/* الأيقونة اللي في النص */}
      <div className="absolute flex items-center justify-center w-full h-full text-[#2149b8]">
        <ShoppingBag size={22} className="animate-pulse" />
      </div>
      
      
    </div>
    
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300">
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