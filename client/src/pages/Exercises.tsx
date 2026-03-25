import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  MoveRight, Dumbbell, LayoutGrid, Activity, 
  Triangle, Mountain, Zap, Shield, Swords, 
  Target, Flame, Crosshair 
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import ScrollFloat from "../components/reactbits/ScrollFloat";
import AnimatedContent from "../components/reactbits/AnimatedContent";

const MUSCLE_GROUPS = [
  { id: "chest", translationKey: "chest", icon: Shield, gradient: "from-blue-500 to-cyan-500" },
  { id: "upper_back", translationKey: "upper_back", icon: Target, gradient: "from-indigo-600 to-blue-600" },
  { id: "lower_back", translationKey: "lower_back", icon: Activity, gradient: "from-teal-500 to-emerald-500" },
  { id: "lats", translationKey: "lats", icon: Triangle, gradient: "from-violet-500 to-indigo-500" },
  { id: "shoulders", translationKey: "shoulders", icon: Mountain, gradient: "from-sky-500 to-indigo-500" },
  { id: "biceps", translationKey: "biceps", icon: Dumbbell, gradient: "from-fuchsia-500 to-pink-500" },
  { id: "triceps", translationKey: "triceps", icon: Target, gradient: "from-rose-500 to-red-500" },
  { id: "forearms", translationKey: "forearms", icon: Swords, gradient: "from-orange-500 to-red-500" },
  { id: "abs", translationKey: "abs", icon: LayoutGrid, gradient: "from-emerald-500 to-teal-500" },
  { id: "obliques", translationKey: "obliques", icon: Crosshair, gradient: "from-sky-400 to-blue-500" },
  { id: "glutes", translationKey: "glutes", icon: Flame, gradient: "from-pink-500 to-rose-500" },
  { id: "quads", translationKey: "quads", icon: Zap, gradient: "from-lime-500 to-emerald-500" },
  { id: "hamstrings", translationKey: "hamstrings", icon: Crosshair, gradient: "from-blue-400 to-indigo-400" },
  { id: "calves", translationKey: "calves", icon: Activity, gradient: "from-cyan-500 to-blue-500" },
  { id: "traps", translationKey: "traps", icon: Mountain, gradient: "from-slate-500 to-slate-700" }
];

const Exercises = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col font-sans transition-colors overflow-x-hidden">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-2">
              <Dumbbell className="text-blue-600 dark:text-blue-400 w-8 h-8" />
            </div>
            
            <ScrollFloat 
              animationDuration={1} 
              ease='back.out(2)' 
              scrub={false}
              containerClassName="!m-0"
              textClassName="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight transition-colors inline-block"
            >
              {t('nav.exercises', 'All Exercises')}
            </ScrollFloat>

            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium transition-colors">
              {t('exercises.subtitle', 'Select a muscle group below to explore dedicated workouts and professional tracking metrics tailored specifically for your target areas.')}
            </p>
          </div>

          {/* GRID НА МУСКУЛНИТЕ ГРУПИ */}
          <AnimatedContent distance={60} direction="vertical" duration={1.2} ease="back.out(1.5)">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10 w-full">
              {MUSCLE_GROUPS.map((muscle) => {
                const IconComponent = muscle.icon;
                return (
                  <Link
                    key={muscle.id}
                    to={`/muscle/${muscle.id}`}
                    className="group relative block outline-none"
                  >
                    <SpotlightCard 
                      spotlightColor="rgba(59, 130, 246, 0.15)"
                      className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl !p-6 !border-slate-200/50 dark:!border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                    >
                      <div className={`absolute top-0 w-full h-1.5 bg-gradient-to-r ${muscle.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <div className="mb-4 mt-2 transform group-hover:scale-110 transition-transform duration-300 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        <IconComponent size={40} strokeWidth={1.5} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 transition-colors">
                        {t(`muscles.${muscle.translationKey}`, muscle.id)}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        {t('muscle.viewExercises', 'Explore')} <MoveRight className="w-3 h-3 ml-1" />
                      </div>
                    </SpotlightCard>
                  </Link>
                );
              })}
            </div>
          </AnimatedContent>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Exercises;
