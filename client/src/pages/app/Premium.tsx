import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Crown, Zap, Bookmark, Bot } from "lucide-react";
import AnimatedContent from "../../components/reactbits/AnimatedContent";
import SpotlightCard from "../../components/reactbits/SpotlightCard";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import { ApiService } from "../../services/api";

const Premium = () => {
    const { user, updateUser } = useAuth();
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const success = searchParams.get('success');
        if (success === 'true' && user && !user.isPremium) {
            const verifyStatus = async () => {
                try {
                    const res = await ApiService.getUserStatus(user.token);
                    if (res.ok) {
                        const data = await res.json();
                        if (data.isPremium) {
                            updateUser({ isPremium: true });
                            setSearchParams({});
                        }
                    }
                } catch (err) {
                    console.error("Failed to verify premium status", err);
                }
            };
            verifyStatus();
        }
    }, [searchParams, user, updateUser, setSearchParams]);

    const handleUpgrade = async () => {
        if (!user) {
            window.location.href = "/auth";
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await ApiService.createCheckoutSession(user.token);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong initiating checkout.");
            }

            // Redirect to Stripe Checkout Hosted Page
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans overflow-hidden relative bg-transparent">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <Header />

            <main className="flex-1 container mx-auto py-16 px-4 flex flex-col items-center relative z-10">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <ScrollFloat
                        animationDuration={1}
                        ease='back.out(2)'
                        scrub={false}
                        containerClassName="!m-0 pointer-events-auto inline-block mb-4"
                        textClassName="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
                    >
                        {t('premium.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-300 dark:to-amber-500">{t('premium.pro')}</span>
                    </ScrollFloat>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                        {t('premium.subtitle')}
                    </p>
                </div>

                <AnimatedContent distance={40} direction="vertical" duration={1} ease="back.out(1.5)">
                    <div className="max-w-md w-full mx-auto">
                        <SpotlightCard
                            spotlightColor="rgba(251, 191, 36, 0.15)"
                            className="bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="text-center pb-8 border-b border-slate-200 dark:border-slate-800">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                                    <Crown size={32} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('premium.cardTitle')}</h2>
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">€0.50</span>
                                    <span className="text-slate-600 dark:text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs">{t('premium.oneTime')}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="py-8 space-y-4">
                                {[
                                    { icon: Bot, text: t("premium.features.deepContext", "Unlimited AI Coach Messages"), color: "text-purple-500 dark:text-purple-400" },
                                    { icon: Zap, text: t("premium.features.workoutPlanner", "AI Custom Workout Generator"), color: "text-emerald-500 dark:text-emerald-400" },
                                    { icon: Bookmark, text: t("premium.features.workouts", "Unlimited Saved Custom Workouts"), color: "text-blue-500 dark:text-blue-400" },
                                    { icon: Crown, text: t("premium.features.badge", "Exclusive 'Pro Athlete' Profile Badge"), color: "text-yellow-500 dark:text-yellow-400" },
                                ].map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${feature.color}`}>
                                            <feature.icon size={20} />
                                        </div>
                                        <p className="text-slate-700 dark:text-slate-300 font-medium">{feature.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action */}
                            <div className="pt-2">
                                {error && <p className="text-red-400 text-sm font-bold text-center mb-4 bg-red-400/10 p-3 rounded-xl">{error}</p>}
                                
                                {user?.isPremium ? (
                                    <div className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30">
                                        <Crown size={20} /> {t("premium.alreadyMember")}
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)] transition-all flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? t("premium.redirecting") : t("premium.upgradeBtn")}
                                    </button>
                                )}
                                <p className="text-center text-xs text-slate-500 mt-4 font-medium flex justify-center gap-1.5 items-center">
                                    {t("premium.stripeText")} <span className="font-bold text-slate-700 dark:text-slate-400">stripe</span>
                                </p>
                            </div>
                        </SpotlightCard>
                    </div>
                </AnimatedContent>

            </main>
            <Footer />
        </div>
    );
};

export default Premium;
