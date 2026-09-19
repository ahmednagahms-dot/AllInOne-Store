import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

const STORE_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788294261/akybn7rcd5gmyfvdqx1i.png";
const DASHBOARD_LOGO_URL =
  "https://res.cloudinary.com/iuc91bdy/image/upload/v1788347185/anjtiwvsm9xcnrxmufdv.png";

export default function LoginBanner() {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex w-1/2 bg-slate-950 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.25),_transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),_transparent_55%)] text-white flex-col justify-between p-10">
      <div className="flex items-center gap-2">
        <div className="w-20 h-15 rounded-lg overflow-hidden shrink-0">
          <img src={STORE_LOGO_URL} alt="ShopEase" className="w-full h-full object-center" />
        </div>
        <div>
          <h1 className="font-semibold text-sm">AllInOne</h1>
          <p className="text-xs text-white/50">E-commerce Admin</p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold leading-tight">
          {t("bannar.manage")}
          <br />
          <span className="text-amber-400">{t("bannar.sell")}</span>
        </h2>
        <p className="text-white/60 mt-3 text-sm max-w-xs">{t("bannar.massage")}</p>
        <div className="mx-15 mt-5">
          <img src={DASHBOARD_LOGO_URL} alt="" className="w-full h-auto rounded-xl" />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg text-sm text-white/70">
        <ShieldCheck size={26} className="text-amber-400" />
        <div>
          <p className="font-medium text-white">{t("bannar.sec")}</p>
          <p className="text-xs">{t("bannar.note")}</p>
        </div>
      </div>
    </div>
  );
}