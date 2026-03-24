import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, ChevronDown, ChevronUp } from 'lucide-react';
import Confetti from 'react-confetti';
import { GAMIFICATION_BADGES } from '../utils/badges';
import { useAuth } from '../context/AuthContext';

const BadgesDisplay = () => {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const token = user?.token;
    
    const [showAll, setShowAll] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    if (!user) return null;

    // Evaluate all badges
    const evaluatedBadges = GAMIFICATION_BADGES.map(badge => {
        const hasSavedBefore = user.unlockedBadges?.includes(badge.id);
        const conditionMetNow = badge.evaluate(user);
        const isUnlocked = hasSavedBefore || conditionMetNow;
        const newlyUnlocked = !hasSavedBefore && conditionMetNow;
        
        return { ...badge, isUnlocked, newlyUnlocked };
    });

    const unlockedCount = evaluatedBadges.filter(b => b.isUnlocked).length;
    const allUnlocked = unlockedCount === GAMIFICATION_BADGES.length;

    // Sync newly unlocked badges to the DB permanently
    useEffect(() => {
        const newlyUnlockedBadges = evaluatedBadges.filter(b => b.newlyUnlocked);
        
        if (newlyUnlockedBadges.length > 0 && token) {
            newlyUnlockedBadges.forEach(async (badge) => {
                try {
                    const res = await fetch('https://electronic-nadiya-musclemap-a30e9055.koyeb.app/api/user/badges', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ badgeId: badge.id })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        // Update context so we don't spam the API on re-render
                        updateUser({ unlockedBadges: data.unlockedBadges });
                    }
                } catch (error) {
                    console.error("Failed to sync badge:", error);
                }
            });
        }
    }, [evaluatedBadges, token, updateUser]);

    // Check for 6/6 Celebration Popup
    useEffect(() => {
        if (allUnlocked) {
            const hasSeenPopup = localStorage.getItem(`hasSeenGamificationCompletion_${user.email}`);
            if (!hasSeenPopup) {
                setShowConfetti(true);
                localStorage.setItem(`hasSeenGamificationCompletion_${user.email}`, 'true');
                
                // Stop confetti after 7 seconds
                setTimeout(() => {
                    setShowConfetti(false);
                }, 7000);
            }
        }
    }, [allUnlocked, user.email]);

    // Default: show only unlocked. If toggled, show all.
    const visibleBadges = showAll ? evaluatedBadges : evaluatedBadges.filter(b => b.isUnlocked);

    return (
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 transition-colors w-full relative">
            {/* Confetti Explosion Layer */}
            {showConfetti && (
                <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
                    <Confetti 
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.2}
                    />
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-800 text-center animate-bounce-in max-w-sm mx-4 transform transition-all pointer-events-auto">
                        <div className="text-6xl mb-4">🏆</div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Platform Mastered!</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            You've unlocked every single achievement on Muscle Map! Welcome to the elite tier. 
                        </p>
                        <button 
                            onClick={() => setShowConfetti(false)}
                            className="mt-6 bg-[#274690] hover:bg-[#1f3770] text-white px-6 py-2.5 rounded-full font-bold transition-colors w-full shadow-lg"
                        >
                            Awesome
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {t('badges.title', 'Achievements')}
                        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-black px-2 py-0.5 rounded-full">
                            {unlockedCount} / {GAMIFICATION_BADGES.length}
                        </span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {t('badges.subtitle', 'Unlock badges by exploring the platform.')}
                    </p>
                </div>
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                    {showAll ? t('badges.hideLocked', 'Hide Locked') : t('badges.showAll', 'Show All')}
                    {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {visibleBadges.map((badge) => {
                    const Icon = badge.icon;
                    const isUnlocked = badge.isUnlocked;

                    return (
                        <div 
                            key={badge.id}
                            className={`relative overflow-hidden rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-300 border ${
                                isUnlocked 
                                    ? `bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${badge.borderClass} border-opacity-50` 
                                    : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 opacity-70 grayscale'
                            }`}
                        >
                            {/* Glow Effect Background (Only if unlocked) */}
                            {isUnlocked && (
                                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20 ${badge.bgClass.replace('/10', '')}`} />
                            )}

                            {/* Badge Icon Container */}
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 relative z-10 ${
                                isUnlocked ? badge.bgClass : 'bg-slate-200 dark:bg-slate-800'
                            }`}>
                                <Icon className={`w-7 h-7 ${isUnlocked ? badge.colorClass : 'text-slate-400 dark:text-slate-500'}`} />
                                {!isUnlocked && (
                                    <div className="absolute -bottom-1 -right-1 bg-slate-700 dark:bg-slate-900 rounded-full p-1 border-2 border-slate-50 dark:border-slate-950">
                                        <Lock size={10} className="text-white" />
                                    </div>
                                )}
                            </div>

                            <h3 className={`text-sm font-extrabold mb-1 relative z-10 ${
                                isUnlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-500'
                            }`}>
                                {t(`${badge.translationKey}.title`, badge.id)}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight relative z-10">
                                {t(`${badge.translationKey}.desc`, 'Unlock this badge.')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BadgesDisplay;
