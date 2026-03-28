import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Lock, Zap, Calendar, Target, Trophy, ChevronRight, AlertCircle } from "lucide-react";
import ScrollFloat from "../components/reactbits/ScrollFloat";
import AnimatedContent from "../components/reactbits/AnimatedContent";

const WorkoutPlanner = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Form states
  const [goal, setGoal] = useState("Muscle Gain");
  const [days, setDays] = useState("4");
  const [level, setLevel] = useState("Intermediate");

  const goalsList = [
      { id: "Weight Loss", icon: Target, label: t('diet.weightLoss', "Weight Loss") },
      { id: "Muscle Gain", icon: Trophy, label: t('diet.bulking', "Muscle Gain") },
      { id: "Maintenance", icon: Calendar, label: t('diet.maintenance', "Maintenance") }
  ];

  const daysList = ["3", "4", "5", "6"];
  
  const levelsList = [
      { id: "Beginner", label: t('db.Beginner', "Beginner") },
      { id: "Intermediate", label: t('db.Intermediate', "Intermediate") },
      { id: "Advanced", label: t('db.Advanced', "Advanced") }
  ];

  const handleGenerate = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setIsGenerating(false);
          setHasGenerated(true);
      }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative transition-colors font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {!user ? (
            <div className="max-w-xl mx-auto text-center mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <Lock className="text-slate-400 dark:text-slate-500" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 transition-colors">{t('bookmarks.loginRequired', 'Login Required')}</h2>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md">{t('header.login', 'Log In')}</Link>
                </div>
            </div>
        ) : !user.isPremium ? (
             <div className="max-w-xl mx-auto text-center mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors border border-yellow-200 dark:border-yellow-700/50 shadow-inner">
                    <Lock className="text-yellow-500" size={36} />
                </div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-4 transition-colors tracking-tight">{t('planner.lockedTitle', 'Premium Feature')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium px-4">
                    {t('planner.lockedDesc', 'Unlock MuscleMap Pro to access the personalized workout planner and build your ultimate 7-day routine based on your goals.')}
                </p>
                <div className="flex justify-center gap-4 relative z-10 pointer-events-auto">
                    <Link 
                        to="/premium" 
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:from-yellow-300 hover:to-amber-400 transition-all flex items-center justify-center w-full sm:w-auto gap-2 transform hover:-translate-y-0.5"
                    >
                        💎 {t('premium.title')} Premium
                    </Link>
                </div>
            </div>
        ) : (
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3.5 rounded-2xl text-emerald-600 dark:text-emerald-400 transition-colors inline-flex border border-emerald-200 dark:border-emerald-800/50">
                        <Zap size={32} />
                    </div>
                    <div>
                        <ScrollFloat 
                            animationDuration={1} 
                            ease='back.out(2)' 
                            scrub={false}
                            containerClassName="!m-0"
                            textClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white transition-colors tracking-tight inline-block"
                        >
                            {t('planner.title', 'Workout Planner')}
                        </ScrollFloat>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {t('planner.subtitle', 'AI Custom Training Generator')}
                    </p>
                </div>

                {!hasGenerated ? (
                    <AnimatedContent distance={40} direction="vertical" duration={0.8}>
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                            <div className="space-y-8">
                                {/* GOAL */}
                                <div>
                                    <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 block">
                                        {t('planner.goal', 'What is your goal?')}
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pointer-events-auto">
                                        {goalsList.map(g => {
                                            const Icon = g.icon;
                                            return (
                                                <button 
                                                    key={g.id}
                                                    onClick={() => setGoal(g.id)}
                                                    className={`p-4 rounded-xl border-2 flex flex-col justify-center items-center gap-3 transition-colors ${
                                                        goal === g.id 
                                                          ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                                          : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                    }`}
                                                >
                                                    <Icon size={24} />
                                                    <span className="font-bold">{g.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* DAYS */}
                                <div>
                                    <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 block">
                                        {t('planner.days', 'How many days a week?')}
                                    </label>
                                    <div className="flex gap-4 pointer-events-auto">
                                        {daysList.map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => setDays(d)}
                                                className={`flex-1 py-3 rounded-xl border-2 font-black text-xl transition-colors ${
                                                    days === d 
                                                      ? 'border-blue-600 dark:border-blue-500 bg-blue-600 text-white' 
                                                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* LEVEL */}
                                <div>
                                    <label className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 block">
                                        {t('planner.level', 'Experience level')}
                                    </label>
                                    <div className="flex flex-col md:flex-row gap-4 pointer-events-auto">
                                        {levelsList.map(lvl => (
                                            <button 
                                                key={lvl.id}
                                                onClick={() => setLevel(lvl.id)}
                                                className={`flex-1 py-3 rounded-xl border-2 font-bold transition-colors ${
                                                    level === lvl.id 
                                                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                                                }`}
                                            >
                                                {lvl.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* GENERATE */}
                                <div className="pt-4 pointer-events-auto">
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="w-full py-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                                    >
                                        {isGenerating ? (
                                           <div className="w-6 h-6 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div> 
                                        ) : (
                                           <>
                                             {t('planner.generate', 'Generate Plan')}
                                             <ChevronRight size={20} />
                                           </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AnimatedContent>
                ) : (
                    <AnimatedContent distance={40} direction="vertical" duration={0.8}>
                        <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 p-6 rounded-2xl flex items-start gap-4 mb-8">
                            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-1">{t('planner.comingSoon', 'Coming Soon!')}</h4>
                                <p className="text-orange-700/80 dark:text-orange-300/80 text-sm">
                                    The full AI Workout Generation algorithm is currently building its knowledge base. 
                                    For now, consult MuscleMap AI in the bottom right corner to generate your plan manually!
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-50 grayscale pointer-events-none">
                            {[1, 2, 3, 4, 5].slice(0, parseInt(days)).map((dayIndex) => (
                                <div key={dayIndex} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase inline-block px-3 py-1 rounded-full mb-4">
                                        {t('planner.day', 'Day')} {dayIndex}
                                    </div>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4].map(ex => (
                                            <div key={ex} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 text-center pointer-events-auto">
                            <button 
                                onClick={() => setHasGenerated(false)}
                                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                            >
                                Edit Settings
                            </button>
                        </div>
                    </AnimatedContent>
                )}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutPlanner;
