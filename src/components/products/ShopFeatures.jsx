import React from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Truck, RefreshCcw, Headset } from "lucide-react";

export default function ShopFeatures() {
  const { t } = useTranslation();

  const features = [
    {
      icon: ShieldCheck,
      title: t("shop.features.securePaymentTitle"),
      subtitle: t("shop.features.securePaymentSub"),
    },
    {
      icon: Truck,
      title: t("shop.features.fastDeliveryTitle"),
      subtitle: t("shop.features.fastDeliverySub"),
    },
    {
      icon: RefreshCcw,
      title: t("shop.features.easyReturnsTitle"),
      subtitle: t("shop.features.easyReturnsSub"),
    },
    {
      icon: Headset,
      title: t("shop.features.supportTitle"),
      subtitle: t("shop.features.supportSub"),
    },
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
              <h4 className="font-bold text-gray-900 text-[15px]">
                {feature.title}
              </h4>
              <p className="text-gray-400 text-sm mt-0.5">{feature.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}