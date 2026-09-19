import React from 'react';
const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

const SessionLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-xl transition-all duration-500">
      
      <div className="relative flex items-center justify-center w-36 h-36 mb-6">
        
        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        
        <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 opacity-70"></div>
        
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-blue-600 border-l-blue-400 animate-spin"></div>
        
        <div className="absolute inset-8 rounded-full border border-slate-100 bg-white shadow-sm"></div>

        <div className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg">
          <img 
          src={STORE_LOGO_URL} 
          alt="AllInOne Logo" 
          className="w-14 h-14 object-contain" 
        />
        </div>
      </div>

      <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-8">
        ِAllln<span className="text-blue-600">One</span>
      </h1>

      <div className="w-64 max-w-xs flex flex-col items-center">
        <div className="flex justify-between w-full text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
          <span>Authenticating</span>
          <span className="text-blue-600 animate-pulse">...</span>
        </div>

        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden relative flex">
          <div className="absolute top-0 bottom-0 bg-blue-600 rounded-full animate-progress-sweep"></div>
        </div>
      </div>

    </div>
  );
};

export default SessionLoader;