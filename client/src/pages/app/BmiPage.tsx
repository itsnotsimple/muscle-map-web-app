import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Calculator, RefreshCcw, Info, Activity } from "lucide-react";
import CountUp from "../../components/reactbits/CountUp";
import ScrollFloat from "../../components/reactbits/ScrollFloat";
import AnimatedContent from "../../components/reactbits/AnimatedContent";

const BmiPage = () => {
  const { t } = useTranslation();
  // Стейт за входните данни (по подразбиране слагаме средни стойности)
  const [height, setHeight] = useState(175); // см
  const [weight, setWeight] = useState(75);  // кг
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("text-slate-800 dark:text-slate-100");

  // Логиката за смятане
  const calculateBMI = () => {
    if (!height || !weight) return;

    // Формула: кг / (м * м)
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    setBmi(bmiValue);
    determineCategory(parseFloat(bmiValue));
  };

  // Логика за категорията и цветовете
  const determineCategory = (value: number) => {
    if (value < 18.5) {
      setCategory("under");
      setColor("text-blue-500"); // Синьо за поднормено
    } else if (value >= 18.5 && value < 24.9) {
      setCategory("normal");
      setColor("text-green-500"); // Зелено за нормално
    } else if (value >= 25 && value < 29.9) {
      setCategory("over");
      setColor("text-yellow-500"); // Жълто за наднормено
    } else {
      setCategory("obese");
      setColor("text-red-500"); // Червено за затлъстяване
    }
  };

  const reset = () => {
    setBmi(null);
    setCategory("");
    setHeight(175);
    setWeight(75);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent relative transition-colors">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 flex flex-col items-center">
        
        {/* ЗАГЛАВИЕ */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-3">
            <Calculator className="text-blue-600 dark:text-blue-400" size={40} />
            <ScrollFloat 
              animationDuration={1} 
              ease='back.out(2)' 
              scrub={false}
              containerClassName="!m-0"
              textClassName="text-4xl md:text-5xl font-black text-slate-800 dark:text-white transition-colors tracking-tight"
            >
              {t('bmi.title', 'BMI Calculator')}
            </ScrollFloat>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">
            {t('bmi.subtitle')}
          </p>
        </div>

        <AnimatedContent distance={60} direction="vertical" duration={1.2} ease="back.out(1.5)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            
            {/* ЛЯВО: ВХОДНИ ДАННИ (INPUTS) */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 h-fit transition-colors">
              
              {/* Height Slider */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="text-slate-700 dark:text-slate-300 font-bold transition-colors">{t('bmi.height')} (cm)</label>
                  <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-lg transition-colors">
                      {height} cm
                  </span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="220" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Weight Slider */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="text-slate-700 dark:text-slate-300 font-bold transition-colors">{t('bmi.weight')} (kg)</label>
                  <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-lg transition-colors">
                      {weight} kg
                  </span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="180" 
                  value={weight} 
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* БУТОНИ */}
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={calculateBMI}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-blue-200 dark:shadow-none flex justify-center items-center gap-2"
                >
                  <Activity size={20} /> {t('bmi.calculate')}
                </button>
                
                <button 
                  onClick={reset}
                  className="px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                  title="Reset"
                >
                  <RefreshCcw size={20} />
                </button>
              </div>
            </div>

            {/* ДЯСНО: РЕЗУЛТАТ */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px] transition-colors">
              {!bmi ? (
                // СЪСТОЯНИЕ: ПРЕДИ ДА НАТИСНЕШ БУТОНА
                <div className="text-center opacity-50">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Activity size={40} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-lg font-medium text-slate-500 dark:text-slate-400 transition-colors">
                      {t('bmi.preCalculate')}
                  </p>
                </div>
              ) : (
                // СЪСТОЯНИЕ: РЕЗУЛТАТ
                <div className="text-center w-full animate-in fade-in zoom-in duration-300">
                  <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs mb-2 transition-colors">
                      {t('bmi.result')}
                  </p>
                  
                  {/* ЧИСЛОТО */}
                  <div className={`text-6xl font-black mb-2 ${color}`}>
                      <CountUp to={parseFloat(bmi)} duration={1.5} />
                  </div>
                  
                  {/* КАТЕГОРИЯТА */}
                  <div className={`text-xl font-bold mb-6 ${color} bg-opacity-10 px-4 py-2 rounded-full inline-block`}>
                      {t(`bmi.${category}`)}
                  </div>

                  {/* СКАЛА (Visual Bar) */}
                  <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative mb-6 transition-colors">
                      {/* Маркер къде си ти */}
                      <div 
                          className="absolute top-0 bottom-0 w-1 bg-slate-800 dark:bg-slate-200 z-10 transition-all duration-500"
                          style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }} 
                      ></div>
                      
                      {/* Цветовете на скалата */}
                      <div className="w-full h-full flex">
                          <div className="w-[46%] h-full bg-blue-300"></div>   {/* Underweight */}
                          <div className="w-[16%] h-full bg-green-400"></div>  {/* Normal */}
                          <div className="w-[13%] h-full bg-yellow-400"></div> {/* Overweight */}
                          <div className="w-[25%] h-full bg-red-400"></div>    {/* Obese */}
                      </div>
                  </div>

                  {/* ЛЕГЕНДА */}
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">
                      <span>{t('bmi.under')}</span>
                      <span>{t('bmi.normal')}</span>
                      <span>{t('bmi.over')}</span>
                      <span>{t('bmi.obese')}</span>
                  </div>

                  {/* СЪВЕТ */}
                  <div className="mt-8 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 text-left flex gap-3 transition-colors">
                      <Info className="flex-shrink-0 text-blue-500" size={20} />
                      <p>
                        {category === "normal" 
                          ? t('bmi.adviceNormal') 
                          : t('bmi.adviceOther')}
                      </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </AnimatedContent>
      </main>
      <Footer />
    </div>
  );
};

export default BmiPage;