import { Link } from "react-router-dom";
import { ArrowLeft, Dumbbell, Brain, Shield, Heart } from "lucide-react";

const About = () => {
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
          <h1 className="text-3xl font-black text-[#1b3061] dark:text-white uppercase tracking-tight">About Muscle Map</h1>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <p className="text-base text-slate-700 dark:text-slate-300">
              <strong>Muscle Map</strong> is an AI-powered fitness platform built to make professional-level training knowledge accessible to everyone — from complete beginners to advanced athletes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 text-[#1b3061] dark:text-blue-400">What We Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                <Dumbbell className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Interactive Muscle Map</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Click on any muscle group to discover targeted exercises, form tips, and training guides.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">AI Fitness Coach</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Chat with our AI coach for personalized workout advice, diet tips, and motivation — in English or Bulgarian.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Privacy First</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">No ads, no tracking cookies, no data selling. Your fitness journey is yours alone.</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400 mb-2" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Built with Passion</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Created by fitness enthusiasts and developers who believe technology should empower health.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#1b3061] dark:text-blue-400">Our Mission</h2>
            <p>We believe that everyone deserves access to quality fitness guidance — not just those who can afford personal trainers. Muscle Map combines anatomical knowledge, AI technology, and clean design to deliver a platform that educates, motivates, and helps you build the best version of yourself.</p>
          </section>


        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <Link to="/" className="inline-block bg-[#274690] hover:bg-[#1f3770] text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
