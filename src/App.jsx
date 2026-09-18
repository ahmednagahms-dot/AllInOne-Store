import { useTranslation } from "react-i18next";
import AppRoutes from "./routes/AppRoutes";
import LanguageSwitcher from "./components/ui/LanguageSwitcher";

export default function App() {
  const { t } = useTranslation();
  return (
    <>
    <LanguageSwitcher />
      <AppRoutes />
    </>
  );
}