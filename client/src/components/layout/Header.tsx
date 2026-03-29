import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { User, LogOut, Calculator, Apple, Bookmark, Map, Activity, User as UserIcon, LogIn, UserPlus, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "../ui/ThemeToggle";
import { LanguageToggle } from "../ui/LanguageToggle";
import CardNav from "../reactbits/CardNav";

const Header = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  
  // Create the dynamic array for the GSAP cards
  const items = [
    {
      label: t('nav.tools', "Tools & Trackers"),
      bgColor: "var(--card-nav-bg-1, #0f172a)",
      textColor: "#f8fafc",
      links: [
        { label: t('header.bmi', "BMI Calculator"), href: "/bmi", icon: Calculator },
        { label: t('diet.title', "Diet Plan"), href: "/diet", icon: Apple },
        { label: t('planner.title', "Workout Planner"), href: "/workout-planner", icon: Zap },
        { label: t('header.bookmark', "Bookmarks"), href: "/bookmarks", icon: Bookmark }
      ]
    },
    {
      label: t('nav.platform', "Platform"),
      bgColor: "var(--card-nav-bg-2, #1e293b)",
      textColor: "#f8fafc",
      links: [
        { label: t('header.home', "Interactive Map"), href: "/", icon: Map },
        { label: t('nav.exercises', "All Exercises"), href: "/exercises", icon: Activity }
      ]
    },
    user ? {
      label: user.email?.split('@')[0] || t('nav.account', "Account"),
      bgColor: "var(--card-nav-bg-3, #3b82f6)",
      textColor: "#ffffff",
      links: [
        { label: t('header.profile', "My Profile"), href: "/profile", icon: UserIcon },
      ]
    } : {
      label: t('nav.auth', "Authentication"),
      bgColor: "var(--card-nav-bg-3, #3b82f6)",
      textColor: "#ffffff",
      links: [
        { label: t('header.login', "Log In"), href: "/login", icon: LogIn },
        { label: t('header.signup', "Sign Up"), href: "/register", icon: UserPlus }
      ]
    }
  ];

  const RightElement = (
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
      </div>
      
      {/* Quick Access CTA mapped directly to the navbar layer */}
      {user ? (
        <button 
            onClick={logout}
            title={t('header.logout')}
            className="hidden md:flex items-center justify-center bg-slate-100/10 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full h-8 w-8 transition-colors"
        >
            <LogOut size={14} />
        </button>
      ) : (
        <Link 
            to="/login"
            className="hidden md:flex text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition-colors"
        >
            {t('header.login')}
        </Link>
      )}
    </div>
  );

  return (
    <>
      {/* We utilize CardNav which renders as a fixed position element natively */}
      <CardNav
        logo="/images/logo.png"
        logoAlt="Muscle Map"
        items={items}
        baseColor="transparent"
        menuColor="currentColor"
        rightElement={RightElement}
      />
      {/* Explicit spacer to push content down since CardNav is position: fixed */}
      <div className="h-20 w-full" />
    </>
  );
};

export default Header;