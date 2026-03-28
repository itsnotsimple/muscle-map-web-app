import { Award, CheckCircle2, Flame, Globe2, BookOpen, Moon, Crown } from "lucide-react";

export interface Badge {
  id: string;
  icon: any;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  animationClass: string;
  translationKey: string;
  evaluate: (user: any) => boolean;
}

export const GAMIFICATION_BADGES: Badge[] = [
  {
    id: "rookie",
    icon: Award,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
    animationClass: "animate-pulse",
    translationKey: "badges.rookie",
    evaluate: (user: any) => !!user // Everyone with an account gets this
  },
  {
    id: "verified",
    icon: CheckCircle2,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    animationClass: "animate-spin-slow",
    translationKey: "badges.verified",
    evaluate: (user: any) => user?.isVerified === true
  },
  {
    id: "nutritionist",
    icon: Flame,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
    animationClass: "animate-flicker",
    translationKey: "badges.nutritionist",
    evaluate: (user: any) => {
        if (!user || !user.physicalProfile) return false;
        const profile = user.physicalProfile;
        return !!(profile.age && profile.weight && profile.height && profile.gender && profile.activityLevel);
    }
  },
  {
    id: "librarian",
    icon: BookOpen,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    animationClass: "animate-book-flip",
    translationKey: "badges.librarian",
    evaluate: (user: any) => {
        return user?.savedExercises && user.savedExercises.length >= 10;
    }
  },
  {
    id: "nightowl",
    icon: Moon,
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-400/10",
    borderClass: "border-indigo-400/30",
    animationClass: "animate-swing",
    translationKey: "badges.nightowl",
    evaluate: (user: any) => user?.theme === 'dark'
  },
  {
    id: "bilingual",
    icon: Globe2,
    colorClass: "text-violet-500",
    bgClass: "bg-violet-500/10",
    borderClass: "border-violet-500/30",
    animationClass: "animate-spin-slow",
    translationKey: "badges.bilingual",
    evaluate: (user: any) => user?.language === 'bg'
  },
  {
    id: "pro_athlete",
    icon: Crown,
    colorClass: "text-yellow-400",
    bgClass: "bg-yellow-400/10",
    borderClass: "border-yellow-400/50",
    animationClass: "animate-pulse",
    translationKey: "badges.pro_athlete",
    evaluate: (user: any) => user?.isPremium === true
  }
];
