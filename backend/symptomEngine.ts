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
  }
};

// Main function to run symptom matching rules engine
export function matchSymptomsAndBiomarkers(
  inputs: PatientInputs,
  targetDisease: string
): Omit<PredictionResult, "id" | "date" | "patientName" | "patientEmail" | "patientDetails"> {
  
  const symptoms = inputs.symptoms.map(s => s.toLowerCase());
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
    if (glucose > 150) riskScore += 15; // Diabetes is a major risk factor for CKD
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
