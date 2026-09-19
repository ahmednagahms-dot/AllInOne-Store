import React from 'react';
import { ShieldCheck, Truck, RefreshCcw, Headset } from 'lucide-react';

export default function ShopFeatures() {
  const features = [
    { icon: ShieldCheck, title: 'Secure Payment', subtitle: 'SSL Encrypted' },
    { icon: Truck, title: 'Fast Delivery', subtitle: 'Orders over $50' },
    { icon: RefreshCcw, title: 'Easy Returns', subtitle: '30 Days Hassle Free' },
    { icon: Headset, title: 'Customer Support', subtitle: "We're here to help" }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-10 mt-12 mb-4 border border-gray-100 shadow-xl w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0 transition-transform hover:scale-110 duration-300">
              <feature.icon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-[15px]">{feature.title}</h4>
              <p className="text-gray-400 text-sm mt-0.5">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}