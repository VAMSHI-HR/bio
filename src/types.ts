export interface Biomarker {
  name: string;
  value: string;
  status: 'Normal' | 'Elevated' | 'Abnormal';
  impact: string;
}

export interface PredictionResult {
  id: string;
  date: string;
  diseaseName: string;
  riskPercentage: number;
  confidenceScore: number;
  severityIndicator: 'Low Risk' | 'Medium Risk' | 'High Risk';
  explanation: string;
  precautions: string[];
  biomarkerAnalysis: Biomarker[];
  patientName?: string;
  patientEmail?: string;
  patientDetails?: PatientInputs;
}

export interface PatientInputs {
  age: string;
  gender: string;
  weight: string;
  height: string;
  bloodPressure: string;
  glucose: string;
  cholesterol: string;
  symptoms: string[];
  symptomsDescription?: string;
  customSymptoms?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface HealthTip {
  id: string;
  category: 'Nutrition' | 'Lifestyle' | 'Mental Health' | 'Prevention';
  title: string;
  text: string;
  iconName: string;
}
