import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

const FAQ_DATA = [
  {
    q: "What is Muscle Map?",
    a: "Muscle Map is an AI-powered fitness platform that offers an interactive muscle anatomy map, personalized workout plans, calorie/diet calculations, and an AI fitness coach chatbot — all designed to help you reach your fitness goals."
  },
  {
    q: "Is Muscle Map free?",
    a: "Yes! Muscle Map offers a free tier with access to the muscle map, exercises, BMI calculator, and limited AI chatbot messages (5/day). Premium unlocks unlimited AI usage, unlimited bookmarks, and AI-generated workout plans."
  },
  {
    q: "How much does Premium cost?",
    a: "Muscle Map Premium is a one-time lifetime purchase. Once you upgrade, you have permanent access to all premium features — no monthly fees, no recurring charges."
  },
  {
    q: "Can I get a refund?",
    a: "Refunds are available within 48 hours of purchase if you haven't extensively used Premium features, or if you experienced a technical issue preventing access. See our Refund Policy for full details."
  },
  {
    q: "Does the AI chatbot give medical advice?",
    a: "No. MuscleMap AI is a fitness coach assistant — it provides workout plans, nutrition guidance, and motivation. It is NOT a medical professional. Always consult a doctor before starting any new exercise or diet program."
  },
  {
    q: "What data do you collect?",
    a: "We collect your email (for login), an optional physical profile (age, weight, height for calorie calculations), and your exercise bookmarks. We do NOT sell your data. See our Privacy Policy for full details."
  },
  {
    q: "Can I use Muscle Map in Bulgarian?",
    a: "Yes! Muscle Map supports both English and Bulgarian. You can switch languages using the BG/EN toggle in the header. The AI chatbot also responds in the language you write to it."
  },
  {
    q: "How does the AI workout planner work?",
    a: "You select your goal (muscle gain, weight loss, or maintenance), training frequency (3-6 days/week), and experience level. Our AI generates a complete structured weekly plan with exercises, sets, reps, rest times, and form tips."
  },
  {
    q: "Is my payment information safe?",
    a: "Absolutely. All payments are processed through Stripe, a PCI-compliant payment processor. Muscle Map never sees or stores your credit card number."
  },
  {
    q: "How do I delete my account?",
    a: "You can delete your account directly from the Profile page. Go to your Profile, scroll down, and use the delete account option. All your data will be permanently removed."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#E5ECEF] dark:bg-slate-950 py-12 px-4 transition-colors">
      <Link to="/" className="absolute top-8 left-8 p-3 bg-white dark:bg-slate-900 rounded-full shadow-md text-slate-800 dark:text-white hover:scale-110 transition-transform z-50">
        <ArrowLeft size={24} />
      </Link>
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md p-8 md:p-12 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95 mb-4">
            <img src="/images/logo.png" alt="Muscle Map" className="h-14 w-auto drop-shadow-sm" />
          </Link>
          <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">FAQ</h1>
          <p className="text-sm text-slate-500 mt-2">Frequently Asked Questions</p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, i) => (
            <div key={i} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100 pr-4">{item.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Still have questions?</p>
          <Link to="/contact" className="inline-block bg-[#274690] hover:bg-[#1f3770] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
