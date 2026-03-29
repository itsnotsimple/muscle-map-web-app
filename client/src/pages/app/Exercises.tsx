import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MoveRight, Dumbbell } from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import AnimatedContent from "../../components/reactbits/AnimatedContent";

const MUSCLE_GROUPS = [
  { id: "chest",      translationKey: "chest",      gradient: "from-blue-500 to-cyan-500",    img: "/images/highlights/chest.png" },
  { id: "upper_back", translationKey: "upper_back",  gradient: "from-indigo-600 to-blue-600",  img: "/images/highlights/upperback.png" },
  { id: "lower_back", translationKey: "lower_back",  gradient: "from-teal-500 to-emerald-500", img: "/images/highlights/lowerback.png" },
  { id: "lats",       translationKey: "lats",        gradient: "from-violet-500 to-indigo-500",img: "/images/highlights/lats.png" },
  { id: "shoulders",  translationKey: "shoulders",   gradient: "from-sky-500 to-indigo-500",   img: "/images/highlights/shoulders.png" },
  { id: "biceps",     translationKey: "biceps",      gradient: "from-fuchsia-500 to-pink-500", img: "/images/highlights/biceps.png" },
  { id: "triceps",    translationKey: "triceps",     gradient: "from-rose-500 to-red-500",     img: "/images/highlights/triceps.png" },
  { id: "forearms",   translationKey: "forearms",    gradient: "from-orange-500 to-red-500",   img: "/images/highlights/forearms.png" },
  { id: "abs",        translationKey: "abs",         gradient: "from-emerald-500 to-teal-500", img: "/images/highlights/abs.png" },
  { id: "obliques",   translationKey: "obliques",    gradient: "from-sky-400 to-blue-500",     img: "/images/highlights/obliques.png" },
  { id: "glutes",     translationKey: "glutes",      gradient: "from-pink-500 to-rose-500",    img: "/images/highlights/glutes.png" },
  { id: "quads",      translationKey: "quads",       gradient: "from-lime-500 to-emerald-500", img: "/images/highlights/quads.png" },
  { id: "hamstrings", translationKey: "hamstrings",  gradient: "from-blue-400 to-indigo-400",  img: "/images/highlights/hamstrings.png" },
  { id: "calves",     translationKey: "calves",      gradient: "from-cyan-500 to-blue-500",    img: "/images/highlights/calves.png" },
  { id: "traps",      translationKey: "traps",       gradient: "from-slate-500 to-slate-700",  img: "/images/highlights/traps.png" },
];

const Exercises = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col font-sans transition-colors overflow-x-hidden">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
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

          <AnimatedContent distance={60} direction="vertical" duration={1.2} ease="back.out(1.5)">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative z-10 w-full">
              {MUSCLE_GROUPS.map((muscle) => (
                <Link
                  key={muscle.id}
                  to={`/muscle/${muscle.id}`}
                  className="group relative block outline-none"
                >
                  <SpotlightCard 
                    spotlightColor="rgba(59, 130, 246, 0.15)"
                    className="h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl !p-4 !border-slate-200/50 dark:!border-slate-800/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                  >
                    {/* Gradient top border */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${muscle.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    
                    {/* Muscle highlight image */}
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 mt-1 bg-slate-50 dark:bg-slate-800/50 group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={muscle.img} 
                        alt={muscle.id} 
                        className="w-full h-full object-contain dark:invert dark:opacity-90"
                        loading="lazy"
                      />
                    </div>

                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 transition-colors leading-tight">
                      {t(`muscles.${muscle.translationKey}`, muscle.id)}
                    </h3>

                    <div className="mt-2 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      {t('muscle.viewExercises', 'Explore')} <MoveRight className="w-3 h-3 ml-1" />
                    </div>
                  </SpotlightCard>
                </Link>
              ))}
            </div>
          </AnimatedContent>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Exercises;
