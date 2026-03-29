import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Lock, Zap, Calendar, Target, Trophy, ChevronRight, ChevronDown, RefreshCcw, AlertTriangle, Save, Trash2, Clock, Dumbbell, CheckCircle2, X, FolderOpen } from "lucide-react";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import AnimatedContent from "../../components/reactbits/AnimatedContent";
import { ApiService } from "../../services/api";

// --- Типове ---
interface Exercise {
    name: string;
    sets: string;
    rest: string;
    tip: string;
}

interface Day {
    dayNumber: number;
    focus: string;
    exercises: Exercise[];
}

interface WorkoutPlanData {
    _id?: string;
    goal: string;
    days: number;
    level: string;
    plan: Day[];
    recoveryTips: string[];
    title?: string;
    createdAt?: string;
}

// --- Компонент за ден ---
const DayCard = ({ day, isExpanded, onToggle }: { day: Day; isExpanded: boolean; onToggle: () => void }) => {
    const { t } = useTranslation();

    const dayColors = [
        { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/50', badge: 'bg-blue-600', text: 'text-blue-700 dark:text-blue-300' },
        { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800/50', badge: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-300' },
        { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800/50', badge: 'bg-violet-600', text: 'text-violet-700 dark:text-violet-300' },
        { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/50', badge: 'bg-amber-600', text: 'text-amber-700 dark:text-amber-300' },
        { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800/50', badge: 'bg-rose-600', text: 'text-rose-700 dark:text-rose-300' },
        { bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800/50', badge: 'bg-cyan-600', text: 'text-cyan-700 dark:text-cyan-300' },
    ];
    const color = dayColors[(day.dayNumber - 1) % dayColors.length];

    return (
        <div className={`rounded-2xl border ${color.border} overflow-hidden transition-all ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}>
            {/* Header - винаги видим */}
            <button
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 ${color.bg} transition-colors hover:opacity-90`}
            >
                <div className="flex items-center gap-3">
                    <span className={`${color.badge} text-white text-xs font-black px-3 py-1.5 rounded-lg`}>
                        {t('planner.day', 'Day')} {day.dayNumber}
                    </span>
                    <h4 className={`font-bold ${color.text}`}>{day.focus}</h4>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {day.exercises.length} {t('planner.exercises', 'exercises')}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {/* Exercises - expand/collapse */}
            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white dark:bg-slate-900 p-5">
                    <div className="space-y-3">
                        {day.exercises.map((ex, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors">
                                <div className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{ex.name}</h5>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                {ex.sets}
                                            </span>
                                            {ex.rest && (
                                                <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                    <Clock size={10} /> {ex.rest}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {ex.tip && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">{ex.tip}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Компонент за запазен план (миниатюра) ---
const SavedPlanCard = ({ plan, onLoad, onDelete }: { plan: WorkoutPlanData; onLoad: () => void; onDelete: () => void }) => {
    const { t } = useTranslation();
    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all group shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="cursor-pointer flex-1 min-w-0" onClick={onLoad}>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {plan.title || `${plan.days}-Day ${plan.goal}`}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">{plan.level}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : ''}
                        </span>
                    </div>
                </div>
                {!isDeleting ? (
                    <button
                        onClick={() => setIsDeleting(true)}
                        className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg"
                    >
                        <Trash2 size={14} />
                    </button>
                ) : (
                    <div className="flex items-center gap-1">
                        <button onClick={onDelete} className="p-1 bg-red-500 text-white rounded text-xs font-bold px-2">
                            {t('bookmarks.confirm', 'Yes')}
                        </button>
                        <button onClick={() => setIsDeleting(false)} className="p-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold px-2">
                            <X size={12} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// ============================================================
// ОСНОВЕН КОМПОНЕНТ
// ============================================================
const WorkoutPlanner = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // --- State ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<WorkoutPlanData | null>(null);
  const [savedPlans, setSavedPlans] = useState<WorkoutPlanData[]>([]);
  const [error, setError] = useState("");
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [expandedDays, setExpandedDays] = useState<number[]>([1]); // Day 1 отворен по подразбиране

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

  // --- Зареждане на запазени планове ---
  useEffect(() => {
      if (!user?.token || !user?.isPremium) return;
      
      const loadPlans = async () => {
          try {
              const res = await ApiService.getSavedWorkouts(user.token);
              if (res.ok) {
                  const data = await res.json();
                  if (Array.isArray(data)) setSavedPlans(data);
              }
          } catch (err) {
              // Тихо — не блокираме UI
          }
      };
      loadPlans();
  }, [user?.token, user?.isPremium]);

  // --- Генериране ---
  const handleGenerate = async () => {
      if (!user?.token) return;
      setIsGenerating(true);
      setError("");
      setCurrentPlan(null);

      try {
          const response = await ApiService.generateWorkoutPlan(user.token, {
              goal, days, level,
              language: i18n.language || 'en'
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to generate plan");
          }

          const data = await response.json();
          setCurrentPlan({ 
              goal, 
              days: parseInt(days), 
              level, 
              plan: data.plan, 
              recoveryTips: data.recoveryTips || [],
              title: `${days}-Day ${goal} (${level})`
          });
          setExpandedDays([1]);
      } catch (err: any) {
          setError(err.message || "Something went wrong. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  // --- Запазване ---
  const handleSave = async () => {
      if (!user?.token || !currentPlan) return;
      setIsSaving(true);
      setError("");

      try {
          const response = await ApiService.saveWorkoutPlan(user.token, {
              goal: currentPlan.goal,
              days: currentPlan.days,
              level: currentPlan.level,
              plan: currentPlan.plan,
              recoveryTips: currentPlan.recoveryTips
          });

          if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || data.error || "Failed to save");
          }

          const saved = await response.json();
          setSavedPlans(prev => [saved, ...prev]);
          setCurrentPlan({ ...currentPlan, _id: saved._id });
          setShowSavedToast(true);
          setTimeout(() => setShowSavedToast(false), 3000);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setIsSaving(false);
      }
  };

  // --- Изтриване ---
  const handleDelete = async (id: string) => {
      if (!user?.token) return;
      try {
          await ApiService.deleteWorkoutPlan(user.token, id);
          setSavedPlans(prev => prev.filter(p => p._id !== id));
          if (currentPlan?._id === id) setCurrentPlan(null);
      } catch {}
  };

  // --- Зареждане на план ---
  const handleLoadPlan = (plan: WorkoutPlanData) => {
      setCurrentPlan(plan);
      setGoal(plan.goal);
      setDays(String(plan.days));
      setLevel(plan.level);
      setExpandedDays([1]);
  };

  // --- Toggle Day ---
  const toggleDay = (dayNum: number) => {
      setExpandedDays(prev => 
          prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]
      );
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative transition-colors font-sans">
      <Header />

      {/* Toast */}
      <div className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${showSavedToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center gap-3 w-80">
              <CheckCircle2 className="text-green-500" size={24} />
              <p className="text-green-800 dark:text-green-100 font-bold">{t('planner.saved', 'Plan saved successfully!')}</p>
          </div>
      </div>
      
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
                    {t('planner.lockedDesc', 'Unlock MuscleMap Pro to access the personalized workout planner and build your ultimate training routine based on your goals.')}
                </p>
                <div className="flex justify-center">
                    <Link 
                        to="/premium" 
                        className="bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:from-yellow-300 hover:to-amber-400 transition-all flex items-center justify-center w-full sm:w-auto gap-2 transform hover:-translate-y-0.5"
                    >
                        💎 {t('premium.title')} Premium
                    </Link>
                </div>
            </div>
        ) : (
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
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
                        {t('planner.subtitle', 'AI-Powered Custom Training Generator')}
                    </p>
                </div>

                <AnimatedContent distance={40} direction="vertical" duration={0.8}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT COLUMN — Form + Saved Plans */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* GENERATOR FORM */}
                            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl transition-colors">
                                        <Dumbbell className="w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-colors" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
                                        {t('planner.configure', 'Configure Plan')}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {/* GOAL */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">
                                            {t('planner.goal', 'Goal')}
                                        </label>
                                        <div className="space-y-2">
                                            {goalsList.map(g => {
                                                const Icon = g.icon;
                                                return (
                                                    <button 
                                                        key={g.id}
                                                        onClick={() => setGoal(g.id)}
                                                        className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-colors text-left ${
                                                            goal === g.id 
                                                              ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                                              : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        <Icon size={18} />
                                                        <span className="font-bold text-sm">{g.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* DAYS */}
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">
                                            {t('planner.days', 'Days per week')}
                                        </label>
                                        <div className="flex gap-2">
                                            {daysList.map(d => (
                                                <button 
                                                    key={d}
                                                    onClick={() => setDays(d)}
                                                    className={`flex-1 py-3 rounded-xl border-2 font-black text-lg transition-colors ${
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
                                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 block">
                                            {t('planner.level', 'Experience')}
                                        </label>
                                        <div className="space-y-2">
                                            {levelsList.map(lvl => (
                                                <button 
                                                    key={lvl.id}
                                                    onClick={() => setLevel(lvl.id)}
                                                    className={`w-full py-2.5 rounded-xl border-2 font-bold text-sm transition-colors ${
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

                                    {/* ERROR */}
                                    {error && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-medium">
                                            <AlertTriangle size={14} className="shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {/* GENERATE BUTTON */}
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-black text-base transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 active:scale-[0.98]"
                                    >
                                        {isGenerating ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                                <span>{t('planner.generating', 'Generating...')}</span>
                                            </div>
                                        ) : (
                                           <>
                                             {t('planner.generate', 'Generate Plan')}
                                             <ChevronRight size={18} />
                                           </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* SAVED PLANS */}
                            {savedPlans.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FolderOpen size={16} className="text-slate-400" />
                                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                                            {t('planner.savedPlans', 'Saved Plans')} ({savedPlans.length}/5)
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {savedPlans.map(plan => (
                                            <SavedPlanCard 
                                                key={plan._id} 
                                                plan={plan} 
                                                onLoad={() => handleLoadPlan(plan)} 
                                                onDelete={() => plan._id && handleDelete(plan._id)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN — Generated Plan */}
                        <div className="lg:col-span-8">
                            {!currentPlan ? (
                                <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors flex flex-col items-center justify-center text-center h-full border-dashed min-h-[400px]">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                        <Dumbbell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('planner.awaitingTitle', 'Ready to Build')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                                        {t('planner.awaitingDesc', 'Configure your training preferences on the left and hit Generate to create your AI-powered workout plan.')}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Plan Header */}
                                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white">
                                                {currentPlan.title || `${currentPlan.days}-Day ${currentPlan.goal} (${currentPlan.level})`}
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                                                {currentPlan.plan.reduce((sum, d) => sum + d.exercises.length, 0)} {t('planner.totalExercises', 'total exercises')} · {currentPlan.days} {t('planner.daysPerWeek', 'days/week')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Save button — показва се само ако планът НЕ е вече запазен */}
                                            {!currentPlan._id && (
                                                <button 
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 shadow-md"
                                                >
                                                    <Save size={14} />
                                                    {isSaving ? t('diet.saving', 'Saving...') : t('planner.save', 'Save Plan')}
                                                </button>
                                            )}
                                            {currentPlan._id && (
                                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-xl">
                                                    <CheckCircle2 size={14} /> {t('planner.alreadySaved', 'Saved')}
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => { setCurrentPlan(null); setError(""); }}
                                                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-bold transition-colors bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl"
                                            >
                                                <RefreshCcw size={14} />
                                                {t('planner.newPlan', 'New')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Day Cards */}
                                    {currentPlan.plan.map(day => (
                                        <DayCard 
                                            key={day.dayNumber} 
                                            day={day} 
                                            isExpanded={expandedDays.includes(day.dayNumber)}
                                            onToggle={() => toggleDay(day.dayNumber)}
                                        />
                                    ))}

                                    {/* Recovery Tips */}
                                    {currentPlan.recoveryTips && currentPlan.recoveryTips.length > 0 && (
                                        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/15 dark:to-indigo-900/15 p-5 rounded-2xl border border-blue-100/60 dark:border-blue-800/40 transition-colors">
                                            <h4 className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                💡 {t('planner.recovery', 'Recovery Tips')}
                                            </h4>
                                            <ul className="space-y-2">
                                                {currentPlan.recoveryTips.map((tip, i) => (
                                                    <li key={i} className="text-sm text-blue-700/80 dark:text-blue-300/80 flex items-start gap-2 font-medium">
                                                        <span className="text-blue-400 mt-0.5">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </AnimatedContent>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WorkoutPlanner;
