import { HealthTip, PredictionResult } from "./types";

export const AVAILABLE_DISEASES = [
  { id: "Diabetes", name: "Diabetes Prediction", desc: "Evaluate glycemic indices, pancreas load indicators, and symptoms.", color: "blue", icon: "droplet" },
  { id: "Heart Disease", name: "Heart Disease Prediction", desc: "Profile cardiovascular efficiency, lipid blockages, and blood pressure indices.", color: "red", icon: "heart" },
  { id: "Kidney Disease", name: "Kidney Disease Prediction", desc: "Assess fluid homeostasis, renal markers, urine traits, and filter efficiency.", color: "emerald", icon: "activity" },
  { id: "Liver Disease", name: "Liver Disease Prediction", desc: "Inspect metabolic proteins, fatty accumulation markers, and enzymes.", color: "amber", icon: "shield" },
  { id: "Parkinson's Disease", name: "Parkinson's Disease Prediction", desc: "Assess chronic motor pathways, speech parameters, tremor risk thresholds.", color: "purple", icon: "brain" }
];

export const SYMPTOMS_LIST = [
  { id: "fatigue", label: "Chronic Fatigue", category: "General" },
  { id: "polyuria", label: "Frequent Urination", category: "Glycemic" },
  { id: "polydipsia", label: "Excessive Thirst", category: "Glycemic" },
  { id: "blurred_vision", label: "Blurred Vision", category: "General" },
  { id: "weight_loss", label: "Unexplained Weight Loss", category: "General" },
  { id: "chest_pain", label: "Chest Pain / Tightness", category: "Cardio" },
  { id: "shortness_breath", label: "Shortness of Breath", category: "Cardio" },
  { id: "swelling", label: "Swelling in Ankles/Feet (Edema)", category: "Renal" },
  { id: "nausea", label: "Persistent Nausea", category: "General" },
  { id: "jaundice", label: "Yellowing of Skin/Eyes (Jaundice)", category: "Liver" },
  { id: "abdominal_pain", label: "Upper Abdominal Pain", category: "Liver" },
  { id: "tremors", label: "Tremors in resting hands", category: "Motor" },
  { id: "stiffness", label: "Muscle Stiffness", category: "Motor" },
  { id: "balance", label: "Impaired Grip / Postural Instability", category: "Motor" }
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: "tip-1",
    category: "Nutrition",
    title: "Manage Glycemic Index",
    text: "Prefer complex carbohydrates like steel-cut oats, quinoa, and sweet potatoes over refined sugars to prevent sudden insulin spikes.",
    iconName: "Apple"
  },
  {
    id: "tip-2",
    category: "Prevention",
    title: "Cardio Circulation Routine",
    text: "Engaging in 30 minutes of aerobic exercises (like brisk walking or cycling) five times a week decreases vascular resistance and lowers high blood pressure.",
    iconName: "Heart"
  },
  {
    id: "tip-3",
    category: "Prevention",
    title: "Kidney Hydration Rule",
    text: "Drink water consistently. Staying well-hydrated helps your kidneys clear sodium and urea from the blood stream efficiently, preventing stone aggregation.",
    iconName: "Droplet"
  },
  {
    id: "tip-4",
    category: "Lifestyle",
    title: "Liver Fatty Acid Management",
    text: "Reduce saturated fats and fructose sweeteners in diet. Non-Alcoholic Fatty Liver Disease (NAFLD) is highly correlated with dense fructose loads.",
    iconName: "Activity"
  },
  {
    id: "tip-5",
    category: "Prevention",
    title: "Neuromuscular Exercise",
    text: "Perform active balance coordination tasks. Physical coordination exercises support neural plasticity, mitigating muscular tremor patterns early.",
    iconName: "Brain"
  }
];

export const EMERGENCY_CONTACTS = [
  { region: "Primary Emergency Call", contact: "911 (US/CA) / 112 (EU) / 102 (IN)", icon: "PhoneCall", desc: "Immediate critical trauma or arrest response." },
  { region: "MediPredict Clinical Consult Helpdesk", contact: "+1 (800) 555-0199", icon: "Stethoscope", desc: "General platform inquiries regarding lab test uploads." },
  { region: "American Diabetes & Kidney Alliance", contact: "+1 (800) 342-2383", icon: "Bookmark", desc: "Non-profit preventative wellness organization counselors." },
  { region: "Cardiac Safety First-Aid Counseling", contact: "+1 (800) 242-8721", icon: "ShieldAlert", desc: "Support on chronic vascular and coronary blood pressure care." }
];

export const INITIAL_PREDICTION_HISTORY: PredictionResult[] = [
  {
    id: "report-1",
    date: "2026-05-12T10:30:00Z",
    diseaseName: "Diabetes Prediction",
    riskPercentage: 24,
    confidenceScore: 88,
    severityIndicator: "Low Risk",
    explanation: "Calculated parameters represent stable post-prandial homeostasis. Blood glucose of 98 mg/dL and a low cardiovascular strain index indicates no current progression towards insulin receptor resistance. Moderate exercise suggests highly active GLUT4 vesicle recruitment.",
    precautions: [
      "Retain current intake levels of low-glycemic complexes.",
      "Perform a hemoglobin A1C review once every annual cycle.",
      "Track physical energy dips specifically during fasting states."
    ],
    biomarkerAnalysis: [
      { name: "Blood Glucose Level", value: "98 mg/dL", status: "Normal", impact: "Maintains standard physiological baseline with zero pancreatic fatigue." },
      { name: "Symptom Burden", value: "0 Symptoms", status: "Normal", impact: "No systemic biomarkers or neurological complaints detected." }
    ]
  },
  {
    id: "report-2",
    date: "2026-04-20T14:15:00Z",
    diseaseName: "Heart Disease Prediction",
    riskPercentage: 58,
    confidenceScore: 84,
    severityIndicator: "Medium Risk",
    explanation: "Biomarker profile shows elevated diastolic vascular tension (BP 138/90) and higher total serum cholesterol of 220 mg/dL. The vascular model detects borderline atherogenesis risks. Prompt dietary adjustments can prevent artery wall calcification.",
    precautions: [
      "Reduce dietary sodium intake to below 1,500mg daily.",
      "Incorporate plant sterols or cold-water Omega-3 oils.",
      "Perform weekly blood pressure charting under dry resting conditions."
    ],
    biomarkerAnalysis: [
      { name: "Cholesterol level", value: "220 mg/dL", status: "Elevated", impact: "At-risk of slight density lipoprotein cholesterol plaque deposition." },
      { name: "Blood Pressure", value: "138/90 mmHg", status: "Elevated", impact: "Indicates raised arterial peripheral vascular resistance." }
    ]
  }
];

export const CLINICAL_ANALYTICS_DATA = {
  monthlyPrevalence: [
    { name: "Jan", Diabetes: 12, Heart: 8, Kidney: 5, Liver: 4, Parkinson: 2 },
    { name: "Feb", Diabetes: 15, Heart: 10, Kidney: 6, Liver: 5, Parkinson: 2 },
    { name: "Mar", Diabetes: 18, Heart: 11, Kidney: 8, Liver: 6, Parkinson: 3 },
    { name: "Apr", Diabetes: 24, Heart: 14, Kidney: 9, Liver: 8, Parkinson: 4 },
    { name: "May", Diabetes: 28, Heart: 17, Kidney: 12, Liver: 9, Parkinson: 5 }
  ],
  cohortSpread: [
    { name: "Diabetes Risk", value: 38 },
    { name: "Vascular/Heart", value: 25 },
    { name: "Renal Risk", value: 16 },
    { name: "Hepatic/Liver", value: 12 },
    { name: "Neuromotor", value: 9 }
  ]
};
