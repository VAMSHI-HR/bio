import { PatientInputs, PredictionResult } from "../src/types";

// Disease match template configuration
interface DiseaseTemplate {
  name: string;
  symptoms: string[];
  vitals: {
    glucoseMin?: number;
    cholesterolMin?: number;
    bpHighSystolic?: number;
    bpHighDiastolic?: number;
  };
  precautions: string[];
  biomarkers: string[];
}

const DISEASE_TEMPLATES: Record<string, DiseaseTemplate> = {
  "Diabetes": {
    name: "Diabetes",
    symptoms: ["polyuria", "polydipsia", "fatigue", "blurred_vision", "weight_loss"],
    vitals: { glucoseMin: 125 },
    precautions: [
      "Monitor blood glucose levels daily before meals.",
      "Restrict simple carbohydrate intakes and sugar-sweetened beverages.",
      "Engage in daily brisk walking to enhance insulin sensitivity.",
      "Consult an endocrinologist for a comprehensive HbA1c review."
    ],
    biomarkers: ["Blood Glucose Level", "Symptom Load Index", "Age & Weight Factor"]
  },
  "Heart Disease": {
    name: "Heart Disease",
    symptoms: ["chest_pain", "shortness_breath", "fatigue"],
    vitals: { cholesterolMin: 240, bpHighSystolic: 140, bpHighDiastolic: 90 },
    precautions: [
      "Restrict dietary sodium intake to under 1,500 mg per day.",
      "Adopt a Mediterranean diet rich in leafy greens, olive oil, and fish.",
      "Track resting and active heart rates daily.",
      "Consult a cardiologist for an echocardiogram or stress test."
    ],
    biomarkers: ["Serum Cholesterol Level", "Blood Pressure Index", "Cardiovascular Symptoms"]
  },
  "Kidney Disease": {
    name: "Kidney Disease",
    symptoms: ["swelling", "nausea", "fatigue"],
    vitals: { bpHighSystolic: 140, bpHighDiastolic: 90 },
    precautions: [
      "Limit dietary protein intake to reduce workload on nephrons.",
      "Monitor urine output volume and color changes.",
      "Avoid NSAIDs (like ibuprofen) which can exacerbate renal strain.",
      "Consult a nephrologist to check serum creatinine and eGFR."
    ],
    biomarkers: ["Blood Pressure Level", "Renal Fluid Fluid Homeostasis", "Symptom Strain Index"]
  },
  "Liver Disease": {
    name: "Liver Disease",
    symptoms: ["jaundice", "abdominal_pain", "nausea", "fatigue"],
    vitals: { cholesterolMin: 220 },
    precautions: [
      "Strictly avoid alcohol consumption and hepatotoxic medications.",
      "Limit fructose and saturated fat intake to prevent hepatic steatosis.",
      "Maintain a moderate weight to decrease visceral fat load.",
      "Consult a hepatologist for liver enzyme panels (ALT/AST)."
    ],
    biomarkers: ["Cholesterol Accumulation", "Hepatic Symptoms Index", "Visceral Strain Status"]
  },
  "Parkinson's Disease": {
    name: "Parkinson's Disease",
    symptoms: ["tremors", "stiffness", "balance", "fatigue"],
    vitals: {},
    precautions: [
      "Practice balance and coordination exercises daily.",
      "Engage in speech therapy to maintain vocal muscle tone.",
      "Ensure a safe home environment to minimize fall risks.",
      "Consult a neurologist specializing in movement disorders."
    ],
    biomarkers: ["Neuromotor Tremor Load", "Symptom Motor Index", "Age Baseline Factor"]
  },
  "Influenza": {
    name: "Influenza (Flu)",
    symptoms: ["fever", "cough", "sore_throat", "body_aches", "fatigue", "runny_nose", "headache"],
    vitals: {},
    precautions: [
      "Rest and stay well-hydrated.",
      "Take over-the-counter fever reducers if necessary.",
      "Avoid close contact with others to prevent transmission.",
      "Consult a doctor if breathing becomes difficult or fever persists."
    ],
    biomarkers: ["Viral Symptom Load", "Temperature Indicator"]
  },
  "COVID-19": {
    name: "COVID-19",
    symptoms: ["fever", "cough", "shortness_breath", "loss_of_taste", "loss_of_smell", "fatigue", "sore_throat", "body_aches"],
    vitals: {},
    precautions: [
      "Isolate and monitor oxygen saturation levels.",
      "Stay hydrated and get plenty of rest.",
      "Wear a mask when around others and ensure proper ventilation.",
      "Seek emergency care for severe chest pressure or breathing difficulties."
    ],
    biomarkers: ["Respiratory Risk", "Sensory Disruptions"]
  },
  "Asthma": {
    name: "Asthma",
    symptoms: ["wheezing", "cough", "shortness_breath", "chest_tightness"],
    vitals: {},
    precautions: [
      "Keep a rescue inhaler readily accessible.",
      "Identify and avoid environmental asthma triggers (pollen, dust).",
      "Monitor peak flow readings regularly.",
      "Consult a pulmonologist for a long-term asthma action plan."
    ],
    biomarkers: ["Bronchial Wheezing", "Airflow Resistance"]
  },
  "Hypertension": {
    name: "Hypertension",
    symptoms: ["headache", "dizziness", "blurred_vision", "chest_pain"],
    vitals: { bpHighSystolic: 130, bpHighDiastolic: 80 },
    precautions: [
      "Adopt a low-sodium DASH diet (rich in grains, fruits, vegetables).",
      "Monitor blood pressure daily at rest.",
      "Engage in regular aerobic exercise to improve vascular health.",
      "Consult a physician regarding antihypertensive medication management."
    ],
    biomarkers: ["Blood Pressure Level", "Arterial Tension Factor"]
  },
  "GERD": {
    name: "GERD",
    symptoms: ["heartburn", "acid_reflux", "chest_pain", "difficulty_swallowing", "nausea"],
    vitals: {},
    precautions: [
      "Avoid lying down for at least 3 hours after eating.",
      "Limit trigger foods like spicy, fatty, or highly acidic dishes.",
      "Eat smaller, more frequent meals throughout the day.",
      "Consult a gastroenterologist if antacids do not relieve symptoms."
    ],
    biomarkers: ["Acid Reflux Index", "Gastric Load Indicator"]
  },
  "Migraine": {
    name: "Migraine",
    symptoms: ["headache", "nausea", "sensitivity_to_light", "sensitivity_to_sound", "blurred_vision"],
    vitals: {},
    precautions: [
      "Rest in a quiet, dark, and cool room during attacks.",
      "Identify dietary or stress triggers (caffeine, lack of sleep).",
      "Stay hydrated and maintain regular meal schedules.",
      "Consult a neurologist for preventative or abortive migraine therapy."
    ],
    biomarkers: ["Neurological Pain Index", "Sensory Sensitivity"]
  },
  "Dehydration": {
    name: "Dehydration",
    symptoms: ["polydipsia", "dry_mouth", "dizziness", "fatigue", "dark_urine", "headache"],
    vitals: {},
    precautions: [
      "Rehydrate with water and electrolyte-rich fluids immediately.",
      "Avoid caffeine and alcohol, which can exacerbate fluid loss.",
      "Monitor urine color to target a pale, clear yellow baseline.",
      "Seek medical attention if unable to retain fluids due to vomiting."
    ],
    biomarkers: ["Fluid Balance Status", "Urinary Concentration Index"]
  }
};

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  "polyuria": ["frequent urination", "urination", "pee a lot", "peeing", "polyuria"],
  "polydipsia": ["excessive thirst", "thirsty", "extreme thirst", "thirst", "polydipsia"],
  "fatigue": ["fatigue", "tired", "weakness", "exhausted", "energy loss", "weary"],
  "blurred_vision": ["blurred vision", "blurry", "vision problem", "eyesight"],
  "weight_loss": ["weight loss", "losing weight", "weight dropping"],
  "chest_pain": ["chest pain", "chest tightness", "angina", "heart pain"],
  "shortness_breath": ["shortness of breath", "breathing difficulty", "difficulty breathing", "breathless", "gasping"],
  "swelling": ["swelling", "edema", "swollen"],
  "nausea": ["nausea", "nauseous", "vomit", "throwing up", "sick to stomach"],
  "jaundice": ["jaundice", "yellow skin", "yellow eyes", "yellowish"],
  "abdominal_pain": ["abdominal pain", "stomach pain", "stomach ache", "belly ache"],
  "tremors": ["tremors", "tremor", "shaking", "shake"],
  "stiffness": ["stiffness", "stiff"],
  "balance": ["balance", "impaired grip", "instability", "falling"],
  
  // New symptoms
  "fever": ["fever", "high temperature", "chills", "feverish"],
  "cough": ["cough", "coughing"],
  "sore_throat": ["sore throat", "throat pain", "pain swallowing"],
  "body_aches": ["body aches", "body ache", "muscle pain", "muscle ache", "muscle aches"],
  "runny_nose": ["runny nose", "congestion", "stuffy nose", "sneezing", "sneeze"],
  "headache": ["headache", "migraine", "head pain"],
  "loss_of_taste": ["loss of taste", "cannot taste", "no taste"],
  "loss_of_smell": ["loss of smell", "cannot smell", "no smell"],
  "wheezing": ["wheezing", "wheeze"],
  "chest_tightness": ["chest tightness", "tight chest"],
  "dizziness": ["dizziness", "dizzy", "lightheaded"],
  "heartburn": ["heartburn", "acid reflux", "acid regurgitation", "burning chest"],
  "difficulty_swallowing": ["difficulty swallowing", "swallowing difficulty"],
  "sensitivity_to_light": ["light sensitivity", "sensitivity to light", "photophobia"],
  "sensitivity_to_sound": ["sound sensitivity", "sensitivity to sound", "phonophobia"],
  "dry_mouth": ["dry mouth", "cotton mouth"],
  "dark_urine": ["dark urine", "yellow urine"]
};

// Main function to run symptom matching rules engine
export function matchSymptomsAndBiomarkers(
  inputs: PatientInputs,
  targetDisease: string
): Omit<PredictionResult, "id" | "date" | "patientName" | "patientEmail" | "patientDetails"> {
  
  const symptoms = [...inputs.symptoms.map(s => s.toLowerCase())];

  // Extract symptoms from free-text description if provided
  if (inputs.symptomsDescription) {
    const descLower = inputs.symptomsDescription.toLowerCase();
    for (const [symKey, keywords] of Object.entries(SYMPTOM_KEYWORDS)) {
      if (keywords.some(kw => descLower.includes(kw))) {
        if (!symptoms.includes(symKey)) {
          symptoms.push(symKey);
        }
      }
    }
  }

  // Also include custom symptoms from tags
  if (inputs.customSymptoms) {
    inputs.customSymptoms.forEach(cs => {
      const normalized = cs.toLowerCase().trim();
      if (normalized && !symptoms.includes(normalized)) {
        symptoms.push(normalized);
      }
    });
  }

  const glucose = parseFloat(inputs.glucose) || 100;
  const cholesterol = parseFloat(inputs.cholesterol) || 180;
  
  // Parse blood pressure
  let systolic = 120;
  let diastolic = 80;
  if (inputs.bloodPressure && inputs.bloodPressure.includes("/")) {
    const parts = inputs.bloodPressure.split("/");
    systolic = parseInt(parts[0]) || 120;
    diastolic = parseInt(parts[1]) || 80;
  }

  // Determine target disease template
  let predictedDiseaseKey = targetDisease;
  
  if (targetDisease === "General" || targetDisease === "Auto-Detect" || !DISEASE_TEMPLATES[targetDisease]) {
    // Run scoring to auto-detect the disease with the highest matches
    let bestMatchKey = "Diabetes";
    let highestScore = -1;

    for (const [key, template] of Object.entries(DISEASE_TEMPLATES)) {
      let score = 0;
      
      // Add symptom score
      const matchingSymptoms = template.symptoms.filter(sym => symptoms.includes(sym));
      score += matchingSymptoms.length * 10;

      // Add biomarker matches
      if (key === "Diabetes" && glucose > 125) score += 20;
      if (key === "Heart Disease" && (cholesterol > 240 || systolic > 135 || diastolic > 85)) score += 20;
      if (key === "Kidney Disease" && (systolic > 140 || symptoms.includes("swelling"))) score += 15;
      if (key === "Liver Disease" && (cholesterol > 220 || symptoms.includes("jaundice"))) score += 15;
      if (key === "Parkinson's Disease" && (symptoms.includes("tremors") || symptoms.includes("stiffness"))) score += 25;
      
      // New diseases biomarker checks
      if (key === "Influenza" && (symptoms.includes("fever") || symptoms.includes("body_aches"))) score += 25;
      if (key === "COVID-19" && (symptoms.includes("loss_of_taste") || symptoms.includes("loss_of_smell"))) score += 30;
      if (key === "Asthma" && symptoms.includes("wheezing")) score += 25;
      if (key === "Hypertension" && (systolic > 130 || diastolic > 80)) score += 25;
      if (key === "GERD" && (symptoms.includes("heartburn") || symptoms.includes("acid_reflux"))) score += 25;
      if (key === "Migraine" && symptoms.includes("headache") && (symptoms.includes("sensitivity_to_light") || symptoms.includes("sensitivity_to_sound"))) score += 25;
      if (key === "Dehydration" && symptoms.includes("polydipsia") && symptoms.includes("dry_mouth")) score += 25;

      if (score > highestScore) {
        highestScore = score;
        bestMatchKey = key;
      }
    }
    predictedDiseaseKey = bestMatchKey;
  }

  const template = DISEASE_TEMPLATES[predictedDiseaseKey] || DISEASE_TEMPLATES["Diabetes"];
  
  // Calculate specific risk percentage
  let riskScore = 15; // baseline

  // Biomarkers influence
  if (predictedDiseaseKey === "Diabetes") {
    if (glucose > 180) riskScore += 45;
    else if (glucose > 140) riskScore += 30;
    else if (glucose > 100) riskScore += 15;

    const matches = template.symptoms.filter(sym => symptoms.includes(sym)).length;
    riskScore += matches * 10;
  } else if (predictedDiseaseKey === "Heart Disease") {
    if (cholesterol > 260) riskScore += 35;
    else if (cholesterol > 200) riskScore += 20;

    if (systolic > 160 || diastolic > 100) riskScore += 25;
    else if (systolic > 130 || diastolic > 85) riskScore += 12;

    const matches = template.symptoms.filter(sym => symptoms.includes(sym)).length;
    riskScore += matches * 10;
  } else if (predictedDiseaseKey === "Kidney Disease") {
    if (systolic > 140 || diastolic > 90) riskScore += 20;
    if (symptoms.includes("swelling")) riskScore += 25;
    if (symptoms.includes("nausea")) riskScore += 15;
    if (glucose > 150) riskScore += 15;
  } else if (predictedDiseaseKey === "Liver Disease") {
    if (symptoms.includes("jaundice")) riskScore += 40;
    if (symptoms.includes("abdominal_pain")) riskScore += 20;
    if (cholesterol > 230) riskScore += 15;
  } else if (predictedDiseaseKey === "Parkinson's Disease") {
    if (symptoms.includes("tremors")) riskScore += 30;
    if (symptoms.includes("stiffness")) riskScore += 20;
    if (symptoms.includes("balance")) riskScore += 20;
    
    const age = parseInt(inputs.age) || 45;
    if (age > 60) riskScore += 10;
  } else if (predictedDiseaseKey === "Influenza") {
    if (symptoms.includes("fever")) riskScore += 30;
    if (symptoms.includes("body_aches")) riskScore += 20;
    if (symptoms.includes("cough")) riskScore += 15;
    const matches = template.symptoms.filter(sym => symptoms.includes(sym)).length;
    riskScore += matches * 10;
  } else if (predictedDiseaseKey === "COVID-19") {
    if (symptoms.includes("loss_of_taste") || symptoms.includes("loss_of_smell")) riskScore += 40;
    if (symptoms.includes("fever")) riskScore += 20;
    if (symptoms.includes("shortness_breath")) riskScore += 15;
    const matches = template.symptoms.filter(sym => symptoms.includes(sym)).length;
    riskScore += matches * 10;
  } else if (predictedDiseaseKey === "Asthma") {
    if (symptoms.includes("wheezing")) riskScore += 35;
    if (symptoms.includes("chest_tightness")) riskScore += 20;
    if (symptoms.includes("shortness_breath")) riskScore += 15;
    const matches = template.symptoms.filter(sym => symptoms.includes(sym)).length;
    riskScore += matches * 10;
  } else if (predictedDiseaseKey === "Hypertension") {
    if (systolic > 150 || diastolic > 95) riskScore += 40;
    else if (systolic > 130 || diastolic > 80) riskScore += 20;
    if (symptoms.includes("headache")) riskScore += 15;
    if (symptoms.includes("dizziness")) riskScore += 10;
  } else if (predictedDiseaseKey === "GERD") {
    if (symptoms.includes("heartburn") || symptoms.includes("acid_reflux")) riskScore += 45;
    if (symptoms.includes("chest_pain")) riskScore += 15;
    if (symptoms.includes("difficulty_swallowing")) riskScore += 15;
  } else if (predictedDiseaseKey === "Migraine") {
    if (symptoms.includes("headache")) riskScore += 30;
    if (symptoms.includes("sensitivity_to_light") || symptoms.includes("sensitivity_to_sound")) riskScore += 25;
    if (symptoms.includes("nausea")) riskScore += 15;
  } else if (predictedDiseaseKey === "Dehydration") {
    if (symptoms.includes("polydipsia")) riskScore += 30; // thirst
    if (symptoms.includes("dry_mouth")) riskScore += 20;
    if (symptoms.includes("dark_urine")) riskScore += 20;
    if (symptoms.includes("dizziness")) riskScore += 10;
  }

  // Bound risk score between 5 and 95
  const riskPercentage = Math.min(Math.max(riskScore, 5), 95);

  // Set severity
  let severityIndicator: "Low Risk" | "Medium Risk" | "High Risk" = "Low Risk";
  if (riskPercentage > 70) {
    severityIndicator = "High Risk";
  } else if (riskPercentage > 35) {
    severityIndicator = "Medium Risk";
  }

  // Set confidence score (simulated model rating)
  const confidenceScore = Math.floor(Math.random() * 10) + 85; // 85% to 94%

  // Build explanation text
  let explanation = `Based on rule-based algorithmic screening for ${template.name}. `;
  if (predictedDiseaseKey === "Diabetes") {
    explanation += `The patient presents a fasting glucose of ${glucose} mg/dL. ${
      glucose > 125 
        ? "This level falls within the clinical diabetes threshold (>125 mg/dL)." 
        : glucose > 100 
          ? "This is indicative of pre-diabetes impaired fasting glucose." 
          : "Fasting glucose is in the normal physiological range."
    } Symptom burden is calculated at ${template.symptoms.filter(s => symptoms.includes(s)).join(", ") || "none"}.`;
  } else if (predictedDiseaseKey === "Heart Disease") {
    explanation += `Total cholesterol is measured at ${cholesterol} mg/dL, and resting blood pressure is ${inputs.bloodPressure} mmHg. ${
      cholesterol > 240 || systolic > 140 
        ? "These levels suggest hypercholesterolemia or Stage 1/2 hypertension, escalating cardiovascular atherosclerotic load." 
        : "Vascular profile sits at acceptable standard baselines."
    }`;
  } else if (predictedDiseaseKey === "Kidney Disease") {
    explanation += `Evaluation focuses on fluid retention parameters and blood pressure load. Edema (swelling) symptoms (${
      symptoms.includes("swelling") ? "present" : "absent"
    }) paired with blood pressure indicators (${inputs.bloodPressure}) represent potential filtration strain on nephron structures.`;
  } else if (predictedDiseaseKey === "Liver Disease") {
    explanation += `Screening tracks jaundice and metabolic signs. The presence of yellowing of skin/eyes (${
      symptoms.includes("jaundice") ? "present" : "absent"
    }) strongly correlates with elevated serum bilirubin levels, requiring direct hepatic function testing (LFT).`;
  } else if (predictedDiseaseKey === "Parkinson's Disease") {
    explanation += `Assessment covers neuromotor pathway disruption. Tremor symptoms (${
      symptoms.includes("tremors") ? "present" : "absent"
    }) and grip/balance limitations (${
      symptoms.includes("balance") ? "present" : "absent"
    }) indicate progressive basal ganglia pathway stress, highly typical of motor-network deterioration.`;
  } else if (predictedDiseaseKey === "Influenza") {
    explanation += `Assessment covers viral upper-respiratory and systemic response indicators. Presentation of fever symptoms (${
      symptoms.includes("fever") ? "detected" : "not detected"
    }) and body aches are characteristic of acute influenza infection profiles.`;
  } else if (predictedDiseaseKey === "COVID-19") {
    explanation += `Evaluation covers SARS-CoV-2 clinical patterns. Key sensory disruptions like loss of taste/smell (${
      (symptoms.includes("loss_of_taste") || symptoms.includes("loss_of_smell")) ? "reported" : "not reported"
    }) and acute fatigue suggest active respiratory viral pathogenesis.`;
  } else if (predictedDiseaseKey === "Asthma") {
    explanation += `Screening focuses on bronchial airway obstruction markers. Symptoms of wheezing (${
      symptoms.includes("wheezing") ? "present" : "absent"
    }) and chest tightness represent acute hyperresponsiveness of respiratory airways.`;
  } else if (predictedDiseaseKey === "Hypertension") {
    explanation += `Vascular load review indicates persistent high systemic blood pressure. Readings of ${inputs.bloodPressure} mmHg exceed normal physiological thresholds, escalating peripheral resistance.`;
  } else if (predictedDiseaseKey === "GERD") {
    explanation += `Assessment tracks gastroesophageal acid reflux. Symptoms of heartburn (${
      symptoms.includes("heartburn") ? "present" : "absent"
    }) suggest transient lower esophageal sphincter relaxation allowing gastric acid regurgitation.`;
  } else if (predictedDiseaseKey === "Migraine") {
    explanation += `Assessment targets neurovascular headache pathways. Recurring headaches accompanied by photophobia (${
      symptoms.includes("sensitivity_to_light") ? "present" : "absent"
    }) suggest active trigeminovascular pathway excitation.`;
  } else if (predictedDiseaseKey === "Dehydration") {
    explanation += `Fluid homeostasis review indicates cellular hypovolemia. Excessive thirst, dry mouth (${
      symptoms.includes("dry_mouth") ? "observed" : "none"
    }), and concentrated dark urine are signs of water-electrolyte deficit.`;
  }

  explanation += `\n\nDISCLAIMER: This assessment is computed by a clinical rules engine for diagnostic training and study presentation. It does not replace a professional diagnostic assay.`;

  // Build biomarker list
  const biomarkerAnalysis = [];
  
  if (predictedDiseaseKey === "Diabetes") {
    biomarkerAnalysis.push({
      name: "Blood Glucose Level",
      value: `${glucose} mg/dL`,
      status: glucose > 125 ? "Abnormal" as const : glucose > 100 ? "Elevated" as const : "Normal" as const,
      impact: glucose > 125 ? "Direct indicator of critical endocrine glycemic load." : "Represents early insulin-response inefficiencies."
    });
    biomarkerAnalysis.push({
      name: "Glycemic Symptom Load",
      value: `${symptoms.filter(s => template.symptoms.includes(s)).length} Symptoms`,
      status: symptoms.filter(s => template.symptoms.includes(s)).length > 1 ? "Abnormal" as const : "Normal" as const,
      impact: "Clinical complaints suggest cellular starvation due to lack of glucose uptake."
    });
  } else if (predictedDiseaseKey === "Heart Disease") {
    biomarkerAnalysis.push({
      name: "Serum Cholesterol",
      value: `${cholesterol} mg/dL`,
      status: cholesterol > 240 ? "Abnormal" as const : cholesterol > 200 ? "Elevated" as const : "Normal" as const,
      impact: "High serum cholesterol creates substantial risks of coronary plaque buildup."
    });
    biomarkerAnalysis.push({
      name: "Systolic Blood Pressure",
      value: `${systolic} mmHg`,
      status: systolic > 140 ? "Abnormal" as const : systolic > 120 ? "Elevated" as const : "Normal" as const,
      impact: "High blood pressure strains cardiac muscle walls and blood vessel compliance."
    });
  } else if (predictedDiseaseKey === "Kidney Disease") {
    biomarkerAnalysis.push({
      name: "Vascular Loading (BP)",
      value: `${inputs.bloodPressure} mmHg`,
      status: systolic > 140 ? "Abnormal" as const : "Normal" as const,
      impact: "Glomerular capillary beds are highly sensitive to systemic arterial hypertension."
    });
    biomarkerAnalysis.push({
      name: "Fluid Volume Edema",
      value: symptoms.includes("swelling") ? "Detected" : "None",
      status: symptoms.includes("swelling") ? "Abnormal" as const : "Normal" as const,
      impact: "Indicates water and sodium retention, typical of decreased glomerular filtration rate (GFR)."
    });
  } else if (predictedDiseaseKey === "Liver Disease") {
    biomarkerAnalysis.push({
      name: "Hepatic Jaundice Sign",
      value: symptoms.includes("jaundice") ? "Positive" : "Negative",
      status: symptoms.includes("jaundice") ? "Abnormal" as const : "Normal" as const,
      impact: "Signals liver processing failure regarding bilirubin excretion."
    });
    biomarkerAnalysis.push({
      name: "Cholesterol level",
      value: `${cholesterol} mg/dL`,
      status: cholesterol > 200 ? "Elevated" as const : "Normal" as const,
      impact: "Tracks overall lipid metabolic processing capabilities of hepatocytes."
    });
  } else if (predictedDiseaseKey === "Parkinson's Disease") {
    biomarkerAnalysis.push({
      name: "Resting Tremors Sign",
      value: symptoms.includes("tremors") ? "Observed" : "None",
      status: symptoms.includes("tremors") ? "Abnormal" as const : "Normal" as const,
      impact: "Resting tremor index is a hallmark motor feature of dopaminergic cell loss."
    });
    biomarkerAnalysis.push({
      name: "Age Factor",
      value: `${inputs.age} years`,
      status: parseInt(inputs.age) > 60 ? "Elevated" as const : "Normal" as const,
      impact: "Parkinson's incidence rates increase significantly in cohorts aged above 60."
    });
  } else if (predictedDiseaseKey === "Influenza") {
    biomarkerAnalysis.push({
      name: "Viral Symptom Load",
      value: `${symptoms.filter(s => template.symptoms.includes(s)).length} Symptoms`,
      status: symptoms.filter(s => template.symptoms.includes(s)).length > 2 ? "Abnormal" as const : "Normal" as const,
      impact: "High concentration of respiratory and systemic viral signs."
    });
    biomarkerAnalysis.push({
      name: "Fever Indicator",
      value: symptoms.includes("fever") ? "Feverish" : "No Fever",
      status: symptoms.includes("fever") ? "Elevated" as const : "Normal" as const,
      impact: "Fever indicates active immunological response to viral pathogen replication."
    });
  } else if (predictedDiseaseKey === "COVID-19") {
    biomarkerAnalysis.push({
      name: "Respiratory Risk",
      value: symptoms.includes("shortness_breath") ? "High Risk" : "Moderate Risk",
      status: symptoms.includes("shortness_breath") ? "Abnormal" as const : "Normal" as const,
      impact: "Difficulty breathing indicates potential alveolar and lung tissue strain."
    });
    biomarkerAnalysis.push({
      name: "Sensory Disruption Sign",
      value: (symptoms.includes("loss_of_taste") || symptoms.includes("loss_of_smell")) ? "Positive" : "Negative",
      status: (symptoms.includes("loss_of_taste") || symptoms.includes("loss_of_smell")) ? "Abnormal" as const : "Normal" as const,
      impact: "Olfactory nerve pathway stress is highly characteristic of SARS-CoV-2 viral strain."
    });
  } else if (predictedDiseaseKey === "Asthma") {
    biomarkerAnalysis.push({
      name: "Bronchial Wheezing Sign",
      value: symptoms.includes("wheezing") ? "Positive" : "Negative",
      status: symptoms.includes("wheezing") ? "Abnormal" as const : "Normal" as const,
      impact: "Direct sign of bronchial constriction and turbulent airflow."
    });
    biomarkerAnalysis.push({
      name: "Airflow Resistance Load",
      value: symptoms.includes("chest_tightness") ? "Elevated" : "Normal",
      status: symptoms.includes("chest_tightness") ? "Elevated" as const : "Normal" as const,
      impact: "Chest tightness indicates increased physical work required to vent airways."
    });
  } else if (predictedDiseaseKey === "Hypertension") {
    biomarkerAnalysis.push({
      name: "Systolic Blood Pressure",
      value: `${systolic} mmHg`,
      status: systolic > 140 ? "Abnormal" as const : systolic > 130 ? "Elevated" as const : "Normal" as const,
      impact: "Elevated pressure indicates high vascular resistance inside system arteries."
    });
    biomarkerAnalysis.push({
      name: "Diastolic Blood Pressure",
      value: `${diastolic} mmHg`,
      status: diastolic > 90 ? "Abnormal" as const : diastolic > 80 ? "Elevated" as const : "Normal" as const,
      impact: "Represents arterial pressure during cardiac resting phases."
    });
  } else if (predictedDiseaseKey === "GERD") {
    biomarkerAnalysis.push({
      name: "Reflux Symptom Sign",
      value: symptoms.includes("heartburn") ? "Positive" : "Negative",
      status: symptoms.includes("heartburn") ? "Abnormal" as const : "Normal" as const,
      impact: "Corresponds directly to esophageal mucosal lining irritation from backflowing acids."
    });
    biomarkerAnalysis.push({
      name: "Gastric Load Indicator",
      value: symptoms.includes("nausea") ? "Elevated" : "Normal",
      status: symptoms.includes("nausea") ? "Elevated" as const : "Normal" as const,
      impact: "Stomach volume loading and pressure affect the integrity of sphincter barriers."
    });
  } else if (predictedDiseaseKey === "Migraine") {
    biomarkerAnalysis.push({
      name: "Neurological Pain Index",
      value: symptoms.includes("headache") ? "Active Migraine" : "None",
      status: symptoms.includes("headache") ? "Abnormal" as const : "Normal" as const,
      impact: "Unilateral throbbing pain pathways are triggered by neurovascular release."
    });
    biomarkerAnalysis.push({
      name: "Sensory Hypersensitivity",
      value: (symptoms.includes("sensitivity_to_light") || symptoms.includes("sensitivity_to_sound")) ? "Positive" : "Negative",
      status: (symptoms.includes("sensitivity_to_light") || symptoms.includes("sensitivity_to_sound")) ? "Abnormal" as const : "Normal" as const,
      impact: "Indicates cortical excitability typical of migraine brain states."
    });
  } else if (predictedDiseaseKey === "Dehydration") {
    biomarkerAnalysis.push({
      name: "Fluid Volume Deficit",
      value: symptoms.includes("dry_mouth") ? "Observed" : "Mild",
      status: symptoms.includes("dry_mouth") ? "Abnormal" as const : "Normal" as const,
      impact: "Reduced salivary secretion signals acute systemic body water deficit."
    });
    biomarkerAnalysis.push({
      name: "Urinary Concentration Index",
      value: symptoms.includes("dark_urine") ? "Concentrated" : "Standard",
      status: symptoms.includes("dark_urine") ? "Abnormal" as const : "Normal" as const,
      impact: "Renal compensation mechanisms save fluid by outputting high solute concentrations."
    });
  }

  // Common vital marker
  biomarkerAnalysis.push({
    name: "Body Mass Index Baseline",
    value: `${inputs.weight} kg / ${inputs.height} cm`,
    status: "Normal" as const,
    impact: "Establishes basic physiological metabolism rate index."
  });

  return {
    diseaseName: `${template.name} Assessment`,
    riskPercentage,
    confidenceScore,
    severityIndicator,
    explanation,
    precautions: template.precautions,
    biomarkerAnalysis
  };
}
