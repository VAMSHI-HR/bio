import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Menu, 
  Bell, 
  Apple, 
  Clock, 
  PhoneCall
} from "lucide-react";

// Sub-components
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";
import LoginPage from "./components/LoginPage";
import PredictionForm from "./components/PredictionForm";
import ResultsView from "./components/ResultsView";
import AnalyticsView from "./components/AnalyticsView";

// Static Data
import { 
  HEALTH_TIPS, 
  EMERGENCY_CONTACTS, 
  INITIAL_PREDICTION_HISTORY 
} from "./data";
import { PredictionResult, PatientInputs } from "./types";

export default function App() {
  // Global States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patientEmail, setPatientEmail] = useState("");
  const [activeTab, setActiveTab] = useState("prediction");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Predict States
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PredictionResult[]>(INITIAL_PREDICTION_HISTORY);
  const [activeReport, setActiveReport] = useState<PredictionResult | null>(null);

  // Health Tips Carousel State
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  // Auto rotate tips
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTipIdx(prev => (prev + 1) % HEALTH_TIPS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Sync dark mode class with page
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    if (isLoggedIn) {
      loadHistory();
    }
  }, [isLoggedIn]);

  // Handle clinical form submission
  const handleFormSubmit = async (inputs: PatientInputs) => {
    setLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          disease: "Auto-Detect",
          age: inputs.age,
          gender: inputs.gender,
          weight: inputs.weight,
          height: inputs.height,
          bloodPressure: inputs.bloodPressure,
          glucose: inputs.glucose,
          cholesterol: inputs.cholesterol,
          symptoms: inputs.symptoms,
          symptomsDescription: inputs.symptomsDescription,
          customSymptoms: inputs.customSymptoms,
          patientName: patientEmail.split('@')[0],
          patientEmail: patientEmail
        })
      });

      if (!response.ok) {
        throw new Error("Prediction API generated an abnormal server fault.");
      }

      const resData = await response.json();
      
      const newReport: PredictionResult = {
        id: resData.id || `report-${Date.now()}`,
        date: resData.date || new Date().toISOString(),
        diseaseName: resData.diseaseName || "Auto-Detected Assessment",
        riskPercentage: typeof resData.riskPercentage === "number" ? resData.riskPercentage : 30,
        confidenceScore: typeof resData.confidenceScore === "number" ? resData.confidenceScore : 85,
        severityIndicator: resData.severityIndicator || "Low Risk",
        explanation: resData.explanation || "Biomarkers parsed successfully. Fasting indicators sit inside predicted thresholds.",
        precautions: resData.precautions || ["Consult primary practitioner.", "Slightly reduce processed sugar intake."],
        biomarkerAnalysis: resData.biomarkerAnalysis || []
      };

      // Prepend to history tracking, set active report, navigate to results
      setHistory(prev => [newReport, ...prev]);
      setActiveReport(newReport);
      setActiveTab("results");
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Note: Prediction API request returned simulation status. Compiling fallback calculations.");
      
      // Secondary fallback client calculations
      const gFloat = parseFloat(inputs.glucose) || 100;
      const cFloat = parseFloat(inputs.cholesterol) || 180;
      
      // Extract symptoms
      const syms = [...inputs.symptoms.map(s => s.toLowerCase())];
      if (inputs.symptomsDescription) {
        const descLower = inputs.symptomsDescription.toLowerCase();
        // Simple client-side extraction helper
        const keywords: Record<string, string[]> = {
          fever: ["fever", "temperature", "chills", "feverish"],
          cough: ["cough", "coughing"],
          sore_throat: ["sore throat", "throat pain"],
          body_aches: ["body aches", "muscle pain", "body ache"],
          runny_nose: ["runny nose", "congestion", "sneezing"],
          headache: ["headache", "migraine", "head pain"],
          wheezing: ["wheezing", "wheeze"],
          chest_tightness: ["chest tightness", "tight chest"],
          heartburn: ["heartburn", "acid reflux"],
          dry_mouth: ["dry mouth", "extreme thirst"]
        };
        for (const [key, list] of Object.entries(keywords)) {
          if (list.some(kw => descLower.includes(kw)) && !syms.includes(key)) {
            syms.push(key);
          }
        }
      }
      if (inputs.customSymptoms) {
        inputs.customSymptoms.forEach(cs => {
          const norm = cs.toLowerCase().trim();
          if (norm && !syms.includes(norm)) {
            syms.push(norm);
          }
        });
      }

      let predictedDisease = "General Metabolic Syndrome";
      let precautions = [
        "Maintain current fiber nutrition densities.",
        "Restrict saturated lipid fats under 2g per meal.",
        "Perform continuous tracking of diastolic blood pressures.",
        "A Hemoglobin A1C blood review should be performed within 45 days."
      ];
      let bRisk = gFloat > 140 || cFloat > 240 ? 68 : 28;

      if (syms.some(s => s.includes("urination") || s.includes("thirst") || s.includes("fatigue") || s.includes("polyuria") || s.includes("polydipsia")) || gFloat > 140) {
        predictedDisease = "Diabetes";
        precautions = [
          "Monitor blood glucose levels daily before meals.",
          "Restrict simple carbohydrate intakes and sugar-sweetened beverages.",
          "Engage in daily brisk walking to enhance insulin sensitivity.",
          "Consult an endocrinologist for a comprehensive HbA1c review."
        ];
        if (gFloat > 125) bRisk = 75;
      } else if (syms.some(s => s.includes("chest_pain") || s.includes("breath")) || cFloat > 240) {
        predictedDisease = "Heart Disease";
        precautions = [
          "Restrict dietary sodium intake to under 1,500 mg per day.",
          "Adopt a Mediterranean diet rich in leafy greens, olive oil, and fish.",
          "Track resting and active heart rates daily.",
          "Consult a cardiologist for an echocardiogram or stress test."
        ];
        if (cFloat > 240) bRisk = 80;
      } else if (syms.some(s => s.includes("swelling") || s.includes("edema") || s.includes("kidney"))) {
        predictedDisease = "Kidney Disease";
        precautions = [
          "Limit dietary protein intake to reduce workload on nephrons.",
          "Monitor urine output volume and color changes.",
          "Avoid NSAIDs (like ibuprofen) which can exacerbate renal strain.",
          "Consult a nephrologist to check serum creatinine and eGFR."
        ];
        bRisk = 55;
      } else if (syms.some(s => s.includes("yellow") || s.includes("jaundice") || s.includes("liver"))) {
        predictedDisease = "Liver Disease";
        precautions = [
          "Strictly avoid alcohol consumption and hepatotoxic medications.",
          "Limit fructose and saturated fat intake to prevent hepatic steatosis.",
          "Maintain a moderate weight to decrease visceral fat load.",
          "Consult a hepatologist for liver enzyme panels (ALT/AST)."
        ];
        bRisk = 65;
      } else if (syms.some(s => s.includes("tremor") || s.includes("stiff") || s.includes("balance") || s.includes("parkinson"))) {
        predictedDisease = "Parkinson's Disease";
        precautions = [
          "Practice balance and coordination exercises daily.",
          "Engage in speech therapy to maintain vocal muscle tone.",
          "Ensure a safe home environment to minimize fall risks.",
          "Consult a neurologist specializing in movement disorders."
        ];
        bRisk = 60;
      } else if (syms.some(s => s.includes("fever") || s.includes("body_aches") || s.includes("flu") || s.includes("sore_throat"))) {
        if (syms.some(s => s.includes("taste") || s.includes("smell"))) {
          predictedDisease = "COVID-19";
          precautions = [
            "Isolate immediately to prevent transmission.",
            "Monitor oxygen levels using a pulse oximeter.",
            "Rest, stay hydrated, and take fever reducers.",
            "Seek urgent care if experiencing breathing difficulties."
          ];
          bRisk = 70;
        } else {
          predictedDisease = "Influenza (Flu)";
          precautions = [
            "Get plenty of rest and sleep.",
            "Stay hydrated by drinking plenty of water, broth, or electrolyte fluids.",
            "Use over-the-counter fever reducers and pain relievers.",
            "Avoid contact with others to limit spreading the virus."
          ];
          bRisk = 62;
        }
      } else if (syms.some(s => s.includes("wheez") || s.includes("asthma") || s.includes("tightness"))) {
        predictedDisease = "Asthma";
        precautions = [
          "Carry your rescue inhaler at all times.",
          "Identify and avoid triggers (dust, cold air, smoking).",
          "Ensure proper inhaler technique.",
          "Have an asthma action plan reviewed by your doctor."
        ];
        bRisk = 50;
      } else if (syms.some(s => s.includes("headache") || s.includes("migraine") || s.includes("light") || s.includes("sound"))) {
        predictedDisease = "Migraine";
        precautions = [
          "Rest in a quiet, dark, and cool room.",
          "Apply a cold compress to your forehead or neck.",
          "Stay hydrated and avoid skipped meals.",
          "Keep a headache diary to identify trigger foods or stressors."
        ];
        bRisk = 45;
      } else if (syms.some(s => s.includes("heartburn") || s.includes("reflux") || s.includes("acid"))) {
        predictedDisease = "GERD (Acid Reflux)";
        precautions = [
          "Avoid lying down for 3 hours after a meal.",
          "Limit carbonated beverages, caffeine, chocolate, and citrus.",
          "Eat smaller, more frequent meals.",
          "Elevate the head of your bed by 6 to 9 inches."
        ];
        bRisk = 48;
      } else if (syms.some(s => s.includes("dry_mouth") || s.includes("dark_urine") || s.includes("dehydrat"))) {
        predictedDisease = "Dehydration";
        precautions = [
          "Drink water or an oral rehydration solution immediately.",
          "Sip small amounts of fluid frequently rather than gulping.",
          "Eat water-rich foods like fruits and vegetables.",
          "Avoid strenuous activity in high temperatures."
        ];
        bRisk = 58;
      }

      const fallbackReport: PredictionResult = {
        id: `report-${Date.now()}`,
        date: new Date().toISOString(),
        diseaseName: predictedDisease.endsWith("Assessment") || predictedDisease.endsWith("Prediction") || predictedDisease.endsWith("Syndrome") || predictedDisease.endsWith("Reflux)") ? `${predictedDisease}` : `${predictedDisease} Prediction`,
        riskPercentage: bRisk,
        confidenceScore: 82,
        severityIndicator: bRisk > 70 ? "High Risk" : bRisk > 35 ? "Medium Risk" : "Low Risk",
        explanation: `This is a simulated review compiled by fallback math engine. Fasting blood glucose is ${inputs.glucose} mg/dL, cholesterol level is ${inputs.cholesterol} mg/dL, and reported symptoms match the profile of ${predictedDisease}. Please configure a valid Gemini API key to enable live AI analysis.`,
        precautions: precautions,
        biomarkerAnalysis: [
          { name: "Blood Glucose Level", value: `${inputs.glucose} mg/dL`, status: gFloat > 125 ? "Abnormal" : gFloat > 100 ? "Elevated" : "Normal", impact: "Fasting indicators trace potential glycemic processing loads." },
          { name: "Serum Lipids", value: `${inputs.cholesterol} mg/dL`, status: cFloat > 200 ? "Abnormal" : "Normal", impact: "High cholesterol values increase arterial vascular blockages risks." }
        ]
      };

      setHistory(prev => [fallbackReport, ...prev]);
      setActiveReport(fallbackReport);
      setActiveTab("results");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecord = (id: string) => {
    const reportItem = history.find(h => h.id === id);
    if (reportItem) {
      setActiveReport(reportItem);
      setActiveTab("results");
    }
  };

  const currentTip = HEALTH_TIPS[activeTipIdx];

  // Under Landing Page cover
  if (!isLoggedIn) {
    return (
      <div className={darkMode ? "dark" : ""}>
        <LoginPage 
          onLogin={(email) => {
            setPatientEmail(email);
            setIsLoggedIn(true);
          }} 
          darkMode={darkMode} 
        />
        {/* Floating Chatbot can float anywhere */}
        <Chatbot darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? "dark bg-slate-950 font-sans" : "bg-slate-50 font-sans"} transition-colors duration-300`}>
      
      {/* 1. Sidebar Panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => {
          setIsLoggedIn(false);
          setPatientEmail("");
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        patientEmail={patientEmail}
      />

      {/* 2. Main Container Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest block">Operational Node</span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white capitalize">
                {activeTab === "prediction" ? "Symptom Predictor" : 
                 activeTab === "results" ? "Calculation Output" : 
                 activeTab === "analytics" ? "Cohort Trends" : 
                 activeTab === "history" ? "Stored Reports Ledger" : "Vascular Helpline"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Informative Notification check */}
            <div className="relative">
              <button 
                id="notif-btn"
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-600 dark:text-slate-300 relative cursor-pointer hover:bg-slate-100"
                title="System Operational"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Inner views router space */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: Symptom Predictor */}
          {activeTab === "prediction" && (
            <div id="tab-prediction" className="space-y-8 animate-in fade-in duration-200">
              
              {/* Dynamic Health tips rotating carousel */}
              <div 
                id="tips-carousel"
                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-md"
              >
                <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 rotate-12 scale-125">
                  <Apple className="w-48 h-48" />
                </div>
                
                <span className="bg-white/20 text-white font-extrabold text-[9.5px] uppercase tracking-wider px-2.5 py-1 rounded-md inline-block mb-3 border border-white/10">
                  Daily Preventative Guideline
                </span>
                
                <div className="space-y-2 max-w-2xl relative">
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-2">
                    {currentTip.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
                    {currentTip.text}
                  </p>
                </div>
                
                {/* Dots */}
                <div className="flex gap-1.5 mt-6">
                  {HEALTH_TIPS.map((_, idx) => (
                    <button
                      key={idx}
                      id={`tip-dot-${idx}`}
                      onClick={() => setActiveTipIdx(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeTipIdx ? "bg-white w-4" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <PredictionForm 
                onSubmit={handleFormSubmit}
                loading={loading}
              />
            </div>
          )}

          {/* TAB 3: Results View */}
          {activeTab === "results" && (
            <ResultsView 
              report={activeReport} 
              onBackToForm={() => setActiveTab("prediction")} 
            />
          )}

          {/* TAB 4: Analytics Trends */}
          {activeTab === "analytics" && (
            <AnalyticsView 
              history={history} 
              onSelectRecord={handleSelectRecord} 
            />
          )}

          {/* TAB 5: History overview list alternative */}
          {activeTab === "history" && (
            <div id="tab-history" className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Active Diagnostic Reports Log</h3>
                  <p className="text-xs text-slate-400">Complete list of simulation histories calculated on this node.</p>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to clear the entire history ledger?")) {
                        try {
                          const response = await fetch("/api/history/clear", {
                            method: "POST"
                          });
                          if (response.ok) {
                            setHistory([]);
                            setActiveReport(null);
                          } else {
                            alert("Failed to clear history.");
                          }
                        } catch (error) {
                          console.error("Clear history error:", error);
                          alert("Could not reach server to clear history.");
                        }
                      }
                    }} 
                    className="px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Wipe History Ledger
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400">
                  No records stored in history database. Run a prediction to begin.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {history.map((r) => {
                    const isHigh = r.severityIndicator === "High Risk";
                    const isMedium = r.severityIndicator === "Medium Risk";
                    
                    return (
                      <div 
                        key={r.id} 
                        className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{new Date(r.date).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 rounded-sm text-[9.5px] font-bold ${
                              isHigh 
                                ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600" 
                                : isMedium 
                                  ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600" 
                                  : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
                            }`}>
                              {r.severityIndicator}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-base text-slate-800 dark:text-white">{r.diseaseName}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{r.explanation}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-white">{r.riskPercentage}% Risk Factor</span>
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to permanently delete this report?")) {
                                  try {
                                    const response = await fetch(`/api/history/${r.id}`, {
                                      method: "DELETE"
                                    });
                                    if (response.ok) {
                                      setHistory(prev => prev.filter(item => item.id !== r.id));
                                      if (activeReport?.id === r.id) {
                                        setActiveReport(null);
                                      }
                                    } else {
                                      alert("Failed to delete record.");
                                    }
                                  } catch (error) {
                                    console.error("Delete record error:", error);
                                    alert("Could not reach server to delete record.");
                                  }
                                }
                              }}
                              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleSelectRecord(r.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                            >
                              Restore Report
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Helpline Contacts, Tips & Emergency Information */}
          {activeTab === "contacts" && (
            <div id="tab-contacts" className="space-y-8 animate-in fade-in duration-200">
              
              {/* Healthy Nutrition Guideline Grid */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Preventative Lifestyle Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {HEALTH_TIPS.map((tip) => (
                    <div 
                      key={tip.id} 
                      className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex gap-4"
                    >
                      <div className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 p-3 h-fit rounded-2xl shrink-0">
                        <Apple className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-wider">{tip.category}</span>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{tip.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{tip.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency grid */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Emergency Helpdesk Contacts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {EMERGENCY_CONTACTS.map((c, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="bg-rose-50 dark:bg-rose-950 text-rose-500 p-3 rounded-2xl shrink-0">
                          <PhoneCall className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white">{c.region}</h4>
                          <span className="text-xs font-extrabold text-rose-500 mt-1 block">{c.contact}</span>
                          <p className="text-[10.5px] text-slate-400 mt-1">{c.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Floating chatbot assistant wrapper */}
      <Chatbot darkMode={darkMode} />
    </div>
  );
}
