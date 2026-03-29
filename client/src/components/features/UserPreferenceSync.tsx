import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

export function UserPreferenceSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (user) {
      if (user.theme) {
        setTheme(user.theme);
      }
      if (user.language) {
        i18n.changeLanguage(user.language);
      }
    }
  }, [user, setTheme, i18n]);

  return null; // This component doesn't render anything visually
}
