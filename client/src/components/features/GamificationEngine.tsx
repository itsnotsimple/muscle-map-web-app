import React, { useEffect, useState, useMemo } from 'react';
import Confetti from 'react-confetti';
import { GAMIFICATION_BADGES } from '../../utils/badges';
import { useAuth } from '../../context/AuthContext';
import { ApiService } from '../../services/api';

export const GamificationEngine = () => {
    const { user, updateUser } = useAuth();
    const token = user?.token;
    const [showConfetti, setShowConfetti] = useState(false);

    // useMemo предотвратява безкраен цикъл — evaluatedBadges е стабилна референция
    // между renders ако user полетата не са се сменили
    const evaluatedBadges = useMemo(() => {
        if (!user) return [];
        return GAMIFICATION_BADGES.map((badge) => {
            const hasSavedBefore = user.unlockedBadges?.includes(badge.id);
            const conditionMetNow = badge.evaluate(user);
            const newlyUnlocked = !hasSavedBefore && conditionMetNow;
            return { id: badge.id, isUnlocked: hasSavedBefore || conditionMetNow, newlyUnlocked };
        });
    }, [
        // Само конкретните полета като deps за максимална точност
        user?.unlockedBadges,
        user?.isVerified,
        user?.isPremium,
        user?.theme,
        user?.language,
        user?.savedExercises?.length,
        user?.physicalProfile?.age,
        user?.physicalProfile?.weight,
        user?.physicalProfile?.height,
        user?.physicalProfile?.gender,
        user?.physicalProfile?.activityLevel,
        !!user,
    ]);

    const unlockedCount = evaluatedBadges.filter((b) => b.isUnlocked).length;
    const allUnlocked = user ? unlockedCount === GAMIFICATION_BADGES.length : false;

    useEffect(() => {
        const newlyUnlockedBadges = evaluatedBadges.filter((b) => b.newlyUnlocked);
        
        if (newlyUnlockedBadges.length > 0 && token) {
            newlyUnlockedBadges.forEach(async (badge) => {
                try {
                    const res = await ApiService.addBadge(token, badge.id);
                    if (res.ok) {
                        const data = await res.json();
                        updateUser({ unlockedBadges: data.unlockedBadges });
                    }
                } catch (error) {
                    console.error("Failed to sync badge:", error);
                }
            });
        }
    }, [evaluatedBadges, token, updateUser]);

    useEffect(() => {
        if (allUnlocked && user?.email) {
            const hasSeenPopup = localStorage.getItem(`hasSeenGamificationCompletion_${user.email}`);
            if (!hasSeenPopup) {
                setShowConfetti(true);
                localStorage.setItem(`hasSeenGamificationCompletion_${user.email}`, 'true');
            }
        }
    }, [allUnlocked, user?.email]);

    if (!user || !showConfetti) return null;

    return (
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
    );
};

