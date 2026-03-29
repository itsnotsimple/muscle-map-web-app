import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import InteractiveMuscleMap from "../../components/features/InteractiveMuscleMap";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import AnimatedContent from "../../components/reactbits/AnimatedContent";
import MuscleInfoCard from "../../components/features/MuscleInfoCard"; // Импортираме новия панел

const Index = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // State за избрания мускул (вместо директна навигация)
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const handleMuscleSelect = (muscle: string) => {
    setSelectedMuscle(muscle);
  };

  const closePanel = () => {
    setSelectedMuscle(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent transition-colors overflow-x-hidden relative">
      <Header />

      <main className="flex-grow flex relative transition-colors">
        <div className={`flex-1 w-full min-w-0 transition-all duration-500 ${selectedMuscle ? 'md:pr-[420px]' : ''}`}>
          {/* HERO SECTION */}
          <section className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-lg py-8 shadow-sm transition-colors border-b border-slate-200/50 dark:border-slate-800/40">
            <div className="w-full max-w-4xl mx-auto px-4 text-center flex flex-col items-center">
              <ScrollFloat 
                animationDuration={1} 
                ease='back.out(2)' 
                scrub={false}
                containerClassName="!m-0"
                textClassName="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 transition-colors inline-block"
              >
                  {t('index.title1') + " " + t('index.title2')}
              </ScrollFloat>
              <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto transition-colors">
                {t('index.subtitle')}
              </p>
              
              {!user && (
                <div className="flex justify-center gap-4 mt-6">
                  <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 shadow-md transition-all">
                    {t('index.start')}
                  </Link>
                  <Link to="/login" className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    {t('index.login')}
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* MAP SECTION */}
          <section className="py-8 w-full px-4 flex justify-center overflow-hidden">
            <AnimatedContent 
              distance={50} direction="vertical" duration={1.2} ease="power3.out"
              className="w-full max-w-[900px] mx-auto transition-all duration-500"
            >
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-2 md:p-4 rounded-2xl shadow-lg border border-slate-100/50 dark:border-slate-800/50 w-full transition-colors overflow-hidden">
                  <InteractiveMuscleMap onMuscleSelect={handleMuscleSelect} />
              </div>
            </AnimatedContent>
          </section>
        </div>

        {/* СТРАНИЧЕН ПАНЕЛ (SIDE TAB) */}
        {selectedMuscle && (
            <MuscleInfoCard 
                muscleKey={selectedMuscle} 
                onClose={closePanel} 
            />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;