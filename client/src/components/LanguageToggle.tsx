import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();

  const toggleLanguage = async () => {
    const nextLang = i18n.language === 'en' ? 'bg' : 'en';
    i18n.changeLanguage(nextLang);

    if (user && user.token) {
      updateUser({ language: nextLang })
      try {
        await fetch("https://muscle-map-main.onrender.com/api/user/preferences", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          },
          body: JSON.stringify({ language: nextLang })
        })
      } catch (error) {
        console.error("Failed to sync language preference", error)
      }
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle language"
    >
      {i18n.language === 'en' ? 'BG' : 'EN'}
    </button>
  )
}
