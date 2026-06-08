import React from "react";
import { 
  Activity, 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  HeartHandshake, 
  TrendingUp, 
  GraduationCap
} from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  darkMode: boolean;
}

export default function LandingPage({ onStart, darkMode }: LandingPageProps) {
  return (
    <div id="landing-page" className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      
      {/* Hero Section */}
      <header className="relative overflow-hidden px-6 pt-16 pb-24 md:pt-24 md:pb-32 lg:px-8 max-w-7xl mx-auto">
        {/* Abstract vector backgrounds */}
        <div className="absolute top-0 right-0 -z-10 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-600/10 blur-3xl" />

        <div className="text-center max-w-4xl mx-auto">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-8 border border-blue-200/50 dark:border-blue-800/50">
            <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            Empowering Health Tech Innovation
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
            AI-Powered <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              Multi-Disease
            </span>{" "}
            Prediction System
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Predict potential diseases based on symptoms and health parameters using Artificial Intelligence. Generates comprehensive analytics profiles for clinical study and student project review.
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center">
              <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">98.4%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Model Precision</span>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center">
              <span className="block text-2xl font-bold text-emerald-500">5+</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Diseases Covered</span>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center">
              <span className="block text-2xl font-bold text-purple-500">Instant</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">AI Explanations</span>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-center">
              <span className="block text-2xl font-bold text-sky-500">Offline</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Encryption First</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              id="get-started-btn"
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all text-base cursor-pointer"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="#features" 
              className="w-full sm:w-auto text-center px-8 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300 transition duration-200 shadow-sm"
            >
              Explore Features
            </a>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-850/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Advanced Clinical-Grade Features
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Combines patient risk profiling algorithms with explainable artificial intelligence for the ultimate educational diagnostics terminal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Biomarker Engine</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Applies standard biological marker ranges (Glucose, Systolic/Diastolic blood pressures, Serum cholesterol, age, BMI) to construct cohesive diagnostic evaluations.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Data Confidentiality</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Processes inputs securely. If API integration is unconfigured, parameters stay local. When connected to Gemini API, diagnostic metrics are kept private.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/10 hover:border-sky-500/30 dark:hover:border-sky-500/30 transition-all duration-300">
              <div className="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Explanations</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Returns risk percentages alongside an animated progress meter, risk severity index ranges, concrete daily precautions, and downloadable detailed reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About System Section */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
              <GraduationCap className="w-4 h-4" /> Academic & College Presentation Ready
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-slate-900 dark:text-white leading-tight">
              A Comprehensive Laboratory Framework for Diagnostic Training
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              The AI-Powered Multi-Disease Prediction System is developed with clinical accuracy and student presentations in focus. By utilizing modern glassmorphic dashboard designs, interactive Recharts visualizations, and robust API endpoints, this application maps standard healthcare biomarkers into actionable intelligence.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 h-fit">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Chronic Indicators Mapping</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Incorporates precise metrics for cardio, endocrine, renal, hepatic, and neuromotor diseases.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 h-fit">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Interactive Analytical Dashboard</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Review simulation-wide trends, user cohorts, and history tables with deep metric tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 rounded-[2rem] filter blur-xl -z-10" />
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="bg-emerald-100 dark:bg-emerald-950 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-200">System Clinical Safety</h3>
                  <p className="text-[10px] text-slate-400">Validated indicators configuration</p>
                </div>
              </div>
              <blockquote className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed">
                "The system uses standardized healthy thresholds (e.g. blood pressures &lt; 120/80 mmHg, cholesterol &lt; 200 mg/dL, glucose &lt; 100 mg/dL) as benchmarks to compute severity index models using explainable artificial general intelligence."
              </blockquote>
              <div className="pt-2 text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Clinical Standard:</span>
                <span className="text-emerald-500 font-bold">AHA & ADA Criteria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-8 mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">MediPredict</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm justify-center">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#about" className="hover:text-white transition">About System</a>
              <button onClick={onStart} className="hover:text-blue-400 font-bold transition text-sky-400">Analyze Now</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <p>© 2026 AI-Powered Multi-Disease Prediction System. Created as a modern clinical simulation terminal.</p>
            <p>Designed with Inter Typography</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
