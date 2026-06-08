import React, { useState } from "react";
import { 
  Stethoscope, 
  Activity, 
  ChevronRight, 
  User, 
  Dumbbell, 
  Heart, 
  Droplet, 
  ShieldAlert,
  Loader2,
  ListRestart
} from "lucide-react";
import { AVAILABLE_DISEASES, SYMPTOMS_LIST } from "../data";
import { PatientInputs } from "../types";

interface PredictionFormProps {
  onSubmit: (inputs: PatientInputs) => void;
  loading: boolean;
}

export default function PredictionForm({
  onSubmit,
  loading
}: PredictionFormProps) {
  
  // Input fields state
  const [age, setAge] = useState("54");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("78");
  const [height, setHeight] = useState("174");
  const [bloodPressure, setBloodPressure] = useState("135/88");
  const [glucose, setGlucose] = useState("142");
  const [cholesterol, setCholesterol] = useState("215");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(["fatigue", "polyuria"]);

  // Multi-select toggle
  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAutofill = (presetType: string) => {
    if (presetType === "diabetes") {
      setAge("48");
      setGender("Female");
      setWeight("82");
      setHeight("165");
      setBloodPressure("128/84");
      setGlucose("168");
      setCholesterol("195");
      setSelectedSymptoms(["polyuria", "fatigue", "polydipsia"]);
    } else if (presetType === "heart") {
      setAge("62");
      setGender("Male");
      setWeight("91");
      setHeight("178");
      setBloodPressure("155/95");
      setGlucose("105");
      setCholesterol("268");
      setSelectedSymptoms(["chest_pain", "shortness_breath", "fatigue"]);
    } else if (presetType === "kidney") {
      setAge("58");
      setGender("Female");
      setWeight("74");
      setHeight("160");
      setBloodPressure("140/90");
      setGlucose("130");
      setCholesterol("210");
      setSelectedSymptoms(["swelling", "nausea", "fatigue"]);
    } else if (presetType === "liver") {
      setAge("45");
      setGender("Male");
      setWeight("86");
      setHeight("172");
      setBloodPressure("122/80");
      setGlucose("112");
      setCholesterol("225");
      setSelectedSymptoms(["jaundice", "abdominal_pain", "nausea"]);
    } else if (presetType === "parkinsons") {
      setAge("68");
      setGender("Male");
      setWeight("71");
      setHeight("175");
      setBloodPressure("118/76");
      setGlucose("92");
      setCholesterol("188");
      setSelectedSymptoms(["tremors", "stiffness", "balance"]);
    }
  };

  const handlePredictClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age,
      gender,
      weight,
      height,
      bloodPressure,
      glucose,
      cholesterol,
      symptoms: selectedSymptoms.map(id => {
        const item = SYMPTOMS_LIST.find(s => s.id === id);
        return item ? item.label : id;
      })
    });
  };

  return (
    <div id="prediction-form-view" className="space-y-6">
      
      {/* Autofill helper buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <ListRestart className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quick Clinical Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            onClick={() => handleAutofill("diabetes")} 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 hover:bg-blue-100 dark:hover:bg-blue-950 transition cursor-pointer"
          >
            Diabetes Template
          </button>
          <button 
            type="button" 
            onClick={() => handleAutofill("heart")} 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 text-rose-600 dark:text-rose-400 border border-red-100 hover:bg-rose-100 dark:hover:bg-rose-950 transition cursor-pointer"
          >
            Coronary/Heart Template
          </button>
          <button 
            type="button" 
            onClick={() => handleAutofill("kidney")} 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition cursor-pointer"
          >
            Renal/Kidney Template
          </button>
          <button 
            type="button" 
            onClick={() => handleAutofill("liver")} 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 hover:bg-amber-100 dark:hover:bg-amber-950 transition cursor-pointer"
          >
            Hepatic/Liver Template
          </button>
          <button 
            type="button" 
            onClick={() => handleAutofill("parkinsons")} 
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 hover:bg-purple-100 dark:hover:bg-purple-950 transition cursor-pointer"
          >
            Neuromotor Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main form card */}
        <form onSubmit={handlePredictClick} className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-600 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Active Diagnostics Form</h3>
                <p className="text-blue-100/80 text-xs sm:text-sm">Adjust vital biomarkers and outline active symptoms to evaluate potential risks.</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* 1. Patient Demographics & Physiology */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-800 pb-2">1. Physiological Biomarkers</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Age */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500" /> Age (Years)
                  </span>
                  <input
                    id="input-age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="E.g., 54"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500" /> Gender
                  </span>
                  <select
                    id="input-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Dumbbell className="w-3.5 h-3.5 text-blue-500" /> Weight (kg)
                  </span>
                  <input
                    id="input-weight"
                    type="number"
                    min="20"
                    max="300"
                    placeholder="E.g., 78"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-500" /> Height (cm)
                  </span>
                  <input
                    id="input-height"
                    type="number"
                    min="100"
                    max="250"
                    placeholder="E.g., 174"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Biomarkers Vitals */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-800 pb-2">2. Cardiovascular & Fasting Assays</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Blood Pressure */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500" /> Blood Pressure (mmHg)
                  </span>
                  <input
                    id="input-bp"
                    type="text"
                    required
                    placeholder="E.g., 120/80"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block font-normal">Format: Systolic/Diastolic (e.g. 135/88)</span>
                </div>

                {/* Glucose Level */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" /> Fasting Glucose (mg/dL)
                  </span>
                  <input
                    id="input-glucose"
                    type="number"
                    min="40"
                    max="600"
                    required
                    placeholder="E.g., 100"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block font-normal">Fasting levels. Under 100 is optimal baseline.</span>
                </div>

                {/* Cholesterol Level */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Cholesterol Level (mg/dL)
                  </span>
                  <input
                    id="input-cholesterol"
                    type="number"
                    min="100"
                    max="500"
                    required
                    placeholder="E.g., 200"
                    value={cholesterol}
                    onChange={(e) => setCholesterol(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 block font-normal">Total serum lipids. Under 200 is healthy.</span>
                </div>
              </div>
            </div>

            {/* 3. Symptoms Multi-select */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block border-b border-slate-100 dark:border-slate-800 pb-2">3. Co-morbid Symptoms Profile</label>
              
              <div className="flex flex-wrap gap-2 py-2">
                {SYMPTOMS_LIST.map((s) => {
                  const isChecked = selectedSymptoms.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      id={`symptom-pill-${s.id}`}
                      onClick={() => toggleSymptom(s.id)}
                      className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                        isChecked 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15 scale-102" 
                          : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10.5px] text-slate-400 block">Select all symptoms currently being monitored or reported.</span>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <button
                type="submit"
                id="predict-disease-btn"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 text-white font-extrabold py-4 rounded-2xl hover:from-blue-700 hover:to-sky-700 transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Compiling Deep Diagnostic Risk Assessment...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-5 h-5" />
                    Generate Prediction Report
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Informative Side Guideline */}
        <div className="lg:col-span-4 bg-gradient-to-tr from-slate-900 to-[#1e293b] text-slate-300 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" />
            <h4 className="font-extrabold text-sm text-semibold text-white tracking-wider uppercase">Diagnostic Advice</h4>
          </div>
          
          <div className="space-y-4 text-xs leading-relaxed">
            <p>
              This system calculates diagnostic indicators by feeding inputs directly to our artificial intelligence modeling processor.
            </p>
            <p>
              <strong className="text-white">Normal Benchmarks:</strong>
              <br />
              • BP: &lt; 120/80 mmHg
              <br />
              • Glucose: 70 - 99 mg/dL (fasting)
              <br />
              • Cholesterol: &lt; 200 mg/dL
            </p>
            <p className="text-slate-400 italic">
              <strong>Simulated Parameters Disclaimer:</strong>
              <br />
              The risk levels presented reflect an estimated projection output. Ensure a medical doctor validates final diagnostic metrics before any preventative lifestyle transitions.
            </p>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <h5 className="text-white font-bold text-xs uppercase mb-3">Model Status</h5>
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span>Predictive Algorithm:</span>
              <span className="text-emerald-400 font-semibold">Gemini 3.5 Flash</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>Clinical Test Cohort:</span>
              <span className="text-sky-400 font-semibold">Academic Simulation v2</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
