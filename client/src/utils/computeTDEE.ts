/**
 * Изчислява TDEE (Total Daily Energy Expenditure) по Mifflin-St Jeor формулата.
 * Споделена между DietPlan и бъдещи компоненти.
 */

interface PhysicalProfile {
    weight: number;
    height: number;
    age: number;
    gender: string;
    activityLevel: string;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
};

export const computeTDEE = (profile: PhysicalProfile): number => {
    const { weight, height, age, gender, activityLevel } = profile;
    
    let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
    bmr = gender === 'male' ? bmr + 5 : bmr - 161;

    return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.2));
};

export default computeTDEE;
