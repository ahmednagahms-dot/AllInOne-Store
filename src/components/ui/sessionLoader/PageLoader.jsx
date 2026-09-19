import React from 'react';
const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";

export default function PageLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[80vh] p-6 animate-fade-in">
      
      <div className="mb-4 flex justify-center items-center">
        <img 
          src={STORE_LOGO_URL} 
          alt="AllInOne Logo" 
          className="w-16 h-16 object-contain animate-spin" 
          style={{ animationDuration: '1s' }}
        />
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-1">AllInOne E-commerce</h2>
      <p className="text-sm text-slate-500 mb-12 animate-pulse">{text}</p>

      <div className="w-full max-w-5xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item, index) => (
            <div 
              key={item} 
              className="bg-gray-400/40 p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3" 
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-slate-200/80 rounded animate-pulse"></div>
                <div className="w-10 h-10 bg-slate-200/80 rounded-lg animate-pulse"></div>
              </div>
              <div className="w-32 h-8 bg-slate-200/80 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>

        <div 
          className="bg-gray-400/40 p-6 rounded-2xl border border-gray-100 shadow-sm w-full space-y-6" 
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex justify-between items-center border-b border-gray-50 pb-4">
             <div className="w-40 h-6 bg-slate-200/80 rounded animate-pulse"></div>
             <div className="w-32 h-8 bg-slate-200/80 rounded-full animate-pulse"></div>
          </div>
          
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex justify-between items-center w-full gap-4">
                <div className="w-1/4 h-3 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-1/4 h-3 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-1/6 h-3 bg-slate-100 rounded animate-pulse"></div>
                <div className="w-12 h-3 bg-slate-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}