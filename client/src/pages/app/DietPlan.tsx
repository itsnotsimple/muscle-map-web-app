import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, Calculator, Activity, ChevronRight, Apple, Lock, CheckCircle2 } from 'lucide-react';
import Header from '../../components/layout/Header';
import CountUp from "../../components/reactbits/CountUp";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import AnimatedContent from "../../components/reactbits/AnimatedContent";
import { ApiService } from "../../services/api";
import { computeTDEE } from "../../utils/computeTDEE";
import Footer from '../../components/layout/Footer';

interface Diet {
    _id: string;
    identifier: string;
    name: string;
    description: string;
    macroSplit: {
        protein: number;
        carbs: number;
        fats: number;
    };
    goodFoods: string[];
}

const DietPlan = () => {
    const { user, login, updateUser } = useAuth(); // We'll need a way to update the user in context ideally, or just rely on local state
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [form, setForm] = useState({
        age: 25,
        gender: 'male',
        height: 175,
        weight: 75,
        activityLevel: 'moderate'
    });
    const [tdee, setTdee] = useState<number | null>(null);
    const [diets, setDiets] = useState<Diet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // If not logged in, redirect
    useEffect(() => {
        if (user === null) {
            // Render lock screen
        } else if (user?.physicalProfile && user.physicalProfile.age) {
            const savedProfile = user.physicalProfile;
            setForm({
                age: savedProfile.age || 25,
                gender: savedProfile.gender || 'male',
                height: savedProfile.height || 175,
                weight: savedProfile.weight || 75,
                activityLevel: savedProfile.activityLevel || 'moderate'
            });

            // Auto-calculate if profile exists
            setTdee(computeTDEE({
                weight: savedProfile.weight || 75,
                height: savedProfile.height || 175,
                age: savedProfile.age || 25,
                gender: savedProfile.gender || 'male',
                activityLevel: savedProfile.activityLevel || 'moderate'
            }));
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchDiets = async () => {
            setIsLoading(true);
            try {
                const res = await ApiService.getDiets();
                if (res.ok) {
                    const data = await res.json();
                    setDiets(data);
                }
            } catch (err) {
                console.error("Error fetching diets:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDiets();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const calculateTDEE = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsCalculating(true);
        setTimeout(() => {
            setTdee(computeTDEE(form));
            setIsCalculating(false);
            
            // Auto Save to Profile
            saveProfile(false);
        }, 500); // UI Effect
    };

    const saveProfile = async (showAlert = true) => {
        setIsSaving(true);
        try {
            const token = user?.token;
            const res = await ApiService.updateProfile(token, form);
            if (res.ok) {
                // Update global context so the profile stays in sync without reloading
                if (updateUser) {
                    updateUser({ physicalProfile: form });
                }
                if (showAlert) {
                    setShowSuccessToast(true);
                    setTimeout(() => setShowSuccessToast(false), 3000);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (user === null) {
        return (
            <div className="min-h-screen flex flex-col bg-transparent relative transition-colors font-sans">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="max-w-xl mx-auto text-center mt-12 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                            <Lock className="text-slate-400 dark:text-slate-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 transition-colors">{t('bookmarks.loginRequired', 'Login Required')}</h2>
                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all"
                            >
                                {t('header.login')}
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-transparent relative font-sans transition-colors overflow-x-hidden">
            <Header />

            {/* Custom Toast Notification */}
            <div className={`fixed top-20 right-4 z-50 transition-all duration-300 transform ${showSuccessToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 p-4 rounded-lg shadow-lg flex items-center gap-3 w-80">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <p className="text-green-800 dark:text-green-100 font-bold">{t('diet.saved', 'Profile saved successfully!')}</p>
                </div>
            </div>

            <main className="flex-grow pt-12 pb-12">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="text-center mb-10">
                    <div className="flex flex-row items-center justify-center gap-3 mb-4">
                        <Apple className="text-blue-600 dark:text-blue-400 w-10 h-10" strokeWidth={2} />
                        <ScrollFloat 
                            animationDuration={1} 
                            ease='back.out(2)' 
                            scrub={false}
                            containerClassName="!m-0"
                            textClassName="text-3xl md:text-5xl font-black text-slate-800 dark:text-white transition-colors tracking-tight inline-block"
                        >
                            {t('diet.title', 'Custom Diet Plan')}
                        </ScrollFloat>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors">
                        {t('diet.subtitle', 'Calculate your daily caloric needs and get professional diet blueprints tailored to your goals.')}
                    </p>
                </div>

                <AnimatedContent distance={60} direction="vertical" duration={1.2} ease="back.out(1.5)">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: CALCULATOR FORM */}
                        <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-xl transition-colors">
                                    <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400 transition-colors" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">
                                    {t('diet.calculator', 'Calorie Calculator')}
                                </h2>
                            </div>

                            <form onSubmit={calculateTDEE} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('diet.gender', 'Gender')}</label>
                                        <select 
                                            name="gender" 
                                            value={form.gender} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                        >
                                            <option value="male">{t('diet.male', 'Male')}</option>
                                            <option value="female">{t('diet.female', 'Female')}</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('diet.age', 'Age')}</label>
                                        <input 
                                            type="number" 
                                            name="age" 
                                            value={form.age} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('diet.weight', 'Weight (kg)')}</label>
                                        <input 
                                            type="number" 
                                            name="weight" 
                                            value={form.weight} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('diet.height', 'Height (cm)')}</label>
                                        <input 
                                            type="number" 
                                            name="height" 
                                            value={form.height} 
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">{t('diet.activity', 'Activity Level')}</label>
                                    <select 
                                        name="activityLevel" 
                                        value={form.activityLevel} 
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                    >
                                        <option value="sedentary">{t('diet.sedentary', 'Sedentary (office job)')}</option>
                                        <option value="light">{t('diet.light', 'Light Exercise (1-2 days/week)')}</option>
                                        <option value="moderate">{t('diet.moderate', 'Moderate Exercise (3-5 days/week)')}</option>
                                        <option value="active">{t('diet.active', 'Heavy Exercise (6-7 days/week)')}</option>
                                        <option value="very_active">{t('diet.veryActive', 'Athlete (2x per day)')}</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isCalculating}
                                    className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-purple-500/20"
                                >
                                    {isCalculating ? t('diet.calculating', 'Calculating...') : t('diet.calculateBtn', 'Calculate Macros')}
                                    {!isCalculating && <ChevronRight className="w-5 h-5" />}
                                </button>
                                
                                {tdee && (
                                   <button 
                                      type="button" 
                                      onClick={() => saveProfile(true)}
                                      disabled={isSaving}
                                      className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                                   >
                                      <Save className="w-4 h-4" />
                                      {isSaving ? t('diet.saving', 'Saving...') : t('diet.saveProfile', 'Save Details to Profile')}
                                   </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CALORIE RESULTS & DIET TEMPLATES */}
                    <div className="lg:col-span-8 space-y-8">
                        {!tdee ? (
                            <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-12 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors flex flex-col items-center justify-center text-center h-full border-dashed">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                    <Activity className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('diet.awaiting', 'Awaiting Your Stats')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-sm">{t('diet.awaitingDesc', 'Fill out your physical profile on the left to generate your custom daily caloric needs and structured meal plans.')}</p>
                            </div>
                        ) : (
                            <>
                                {/* CALORIE TARGETS */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-500/10 rounded-bl-full -mr-4 -mt-4 transition-colors"></div>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('diet.maintenance', 'Maintenance')}</p>
                                        <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 transition-colors"><CountUp to={tdee} duration={1.5} /></h3>
                                        <p className="text-xs font-semibold text-slate-400 mt-1">{t('diet.kcal', 'kcal / day')}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 dark:bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-colors"></div>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('diet.weightLoss', 'Weight Loss')}</p>
                                        <h3 className="text-3xl font-black text-green-600 dark:text-green-400 transition-colors"><CountUp to={tdee - 500} duration={1.5} /></h3>
                                        <p className="text-xs font-semibold text-slate-400 mt-1">{t('diet.kcal', 'kcal / day')}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors relative overflow-hidden group">
                                         <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-colors"></div>
                                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{t('diet.bulking', 'Bulking')}</p>
                                        <h3 className="text-3xl font-black text-red-600 dark:text-red-400 transition-colors"><CountUp to={tdee + 300} duration={1.5} /></h3>
                                        <p className="text-xs font-semibold text-slate-400 mt-1">{t('diet.kcal', 'kcal / day')}</p>
                                    </div>
                                </div>

                                {/* GENERATED DIET PLANS */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors px-1">
                                        {t('diet.plansLabel', 'Recommended Macro Splits (Based on Maintenance)')}
                                    </h3>
                                    
                                    {isLoading ? (
                                        <p className="text-slate-500">{t('diet.loading', 'Loading diet blueprints...')}</p>
                                    ) : (diets && diets.length > 0) ? (
                                        diets.map(diet => {
                                            // 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal
                                            const proteinKcal = tdee * (diet.macroSplit.protein / 100);
                                            const carbsKcal = tdee * (diet.macroSplit.carbs / 100);
                                            const fatsKcal = tdee * (diet.macroSplit.fats / 100);

                                            const proteinGrams = Math.round(proteinKcal / 4);
                                            const carbsGrams = Math.round(carbsKcal / 4);
                                            const fatsGrams = Math.round(fatsKcal / 9);

                                            return (
                                                <div key={diet._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white transition-colors">{String(t(`db.${diet.identifier}`, diet.name))}</h4>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{String(t(`db.${diet.identifier}_desc`, diet.description))}</p>
                                                        </div>
                                                        <div className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                                                            P:{diet.macroSplit.protein}% C:{diet.macroSplit.carbs}% F:{diet.macroSplit.fats}%
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-4 mb-5">
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center transition-colors">
                                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">Protein</p>
                                                            <p className="text-xl font-black text-slate-800 dark:text-slate-200 transition-colors"><CountUp to={proteinGrams} duration={1.5} />g</p>
                                                        </div>
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center transition-colors">
                                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">Carbs</p>
                                                            <p className="text-xl font-black text-slate-800 dark:text-slate-200 transition-colors"><CountUp to={carbsGrams} duration={1.5} />g</p>
                                                        </div>
                                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-center transition-colors">
                                                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1 flex items-center justify-center gap-1">Fats</p>
                                                            <p className="text-xl font-black text-slate-800 dark:text-slate-200 transition-colors"><CountUp to={fatsGrams} duration={1.5} />g</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl transition-colors">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Apple className="w-4 h-4 text-green-600 dark:text-green-500" />
                                                            <p className="text-sm font-bold text-green-800 dark:text-green-500">{t('diet.goodFoods', 'Recommended Primary Foods')}</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {diet.goodFoods?.map((food, i) => (
                                                                <span key={i} className="text-xs font-semibold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/30 transition-colors shadow-sm">{String(t(`db.${food}`, food))}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl text-center border border-slate-100 dark:border-slate-700 mt-4">
                                            <p className="text-slate-500 dark:text-slate-400 font-medium">No diet templates found.</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Run <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-pink-600 dark:text-pink-400">node seedData.js</code> in the server folder to populate the database.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                </AnimatedContent>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DietPlan;
