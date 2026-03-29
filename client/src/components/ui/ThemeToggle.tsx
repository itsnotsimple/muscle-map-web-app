import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import { ApiService } from "../../services/api";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { user, updateUser } = useAuth()

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    if (user && user.token) {
      updateUser({ theme: newTheme })
      try {
        await ApiService.updatePreferences(user.token, { theme: newTheme });
      } catch (error) {
        console.error("Failed to sync theme preference", error)
      }
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}
