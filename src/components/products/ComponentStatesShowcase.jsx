import React from 'react';
import { Search, Package, TriangleAlert } from 'lucide-react';

export default function ComponentStatesShowcase() {
  const StateCard = ({ topTitle, icon: Icon, iconColor, bgColor, title, desc, btnText, btnTextColor }) => (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl flex flex-col h-[320px] transition-transform hover:-translate-y-1 duration-300">
      <h3 className="text-[15px] font-bold text-gray-800 mb-8">{topTitle}</h3>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center mt-2">
        <div className={`w-14 h-14 ${bgColor} rounded-full flex items-center justify-center ${iconColor} mb-4`}>
          <Icon size={24} strokeWidth={2} />
        </div>
        
        <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-[13px] text-gray-400 mb-6 leading-relaxed max-w-[200px] mx-auto">
          {desc}
        </p>
        
        <button className={`px-5 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition shadow-sm mt-auto ${btnTextColor}`}>
          {btnText}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mt-16 pt-10 border-t border-gray-100 pb-20">
      <h2 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-8 ml-2">
        Component States Showcase
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-xl flex flex-col h-[320px] transition-transform hover:-translate-y-1 duration-300">
          <h3 className="text-[15px] font-bold text-gray-800 mb-10">Loading State</h3>
          
          <div className="flex flex-col items-center w-full mt-4">
            <div className="flex gap-3 w-full justify-center mb-6">
              <div className="w-14 h-14 bg-gray-200/90 rounded-2xl animate-pulse"></div>
              <div className="w-14 h-14 bg-gray-200/90 rounded-2xl animate-pulse"></div>
              <div className="w-14 h-14 bg-gray-200/90 rounded-2xl animate-pulse"></div>
              <div className="w-14 h-14 bg-gray-200/90 rounded-2xl animate-pulse"></div>
            </div>
            
            <div className="w-[90%] h-3 bg-gray-200/90 rounded-full mb-3 animate-pulse"></div>
            <div className="w-[60%] h-3 bg-gray-200/90 rounded-full self-start ml-[5%] mb-10 animate-pulse"></div>
            
            <div className="flex gap-1.5 mt-auto">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>

        <StateCard 
          topTitle="No Search Results"
          icon={Search}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          title="No results found"
          desc="Try adjusting your search or browse our categories."
          btnText="Browse Categories"
          btnTextColor="text-blue-600"
        />

        <StateCard 
          topTitle="No Products"
          icon={Package}
          iconColor="text-blue-600"
          bgColor="bg-blue-50"
          title="No products available"
          desc="We'll notify you when new products are added."
          btnText="Back to Home"
          btnTextColor="text-blue-600"
        />

        <StateCard 
          topTitle="Error State"
          icon={TriangleAlert}
          iconColor="text-red-500"
          bgColor="bg-red-50"
          title="Something went wrong"
          desc="Please try again later or contact support if the problem persists."
          btnText="Try Again"
          btnTextColor="text-gray-700"
        />

      </div>
    </div>
  );
}