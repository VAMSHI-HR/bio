import mongoose, { Schema, Document } from "mongoose";

// Interface definitions matching the frontend TypeScript models
export interface IBiomarker {
  name: string;
  value: string;
  status: 'Normal' | 'Elevated' | 'Abnormal';
  impact: string;
}

export interface IPatientDetails {
  age: string;
  gender: string;
  weight: string;
  height: string;
  bloodPressure: string;
  glucose: string;
  cholesterol: string;
  symptoms: string[];
}

export interface IPredictionResult {
  id: string;
  date: string;
  diseaseName: string;
  riskPercentage: number;
  confidenceScore: number;
  severityIndicator: 'Low Risk' | 'Medium Risk' | 'High Risk';
  explanation: string;
  precautions: string[];
  biomarkerAnalysis: IBiomarker[];
  patientName?: string;
  patientEmail?: string;
  patientDetails?: IPatientDetails;
}

export interface IPredictionDocument extends Document, Omit<IPredictionResult, 'id'> {
  id: string;
}

const BiomarkerSchema = new Schema<IBiomarker>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  status: { type: String, enum: ['Normal', 'Elevated', 'Abnormal'], required: true },
  impact: { type: String, required: true }
});

const PatientDetailsSchema = new Schema<IPatientDetails>({
  age: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  bloodPressure: { type: String, required: true },
  glucose: { type: String, required: true },
  cholesterol: { type: String, required: true },
  symptoms: [{ type: String }]
});

const PredictionSchema = new Schema<IPredictionDocument>({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true, default: () => new Date().toISOString() },
  diseaseName: { type: String, required: true },
  riskPercentage: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  severityIndicator: { type: String, enum: ['Low Risk', 'Medium Risk', 'High Risk'], required: true },
  explanation: { type: String, required: true },
  precautions: [{ type: String }],
  biomarkerAnalysis: [BiomarkerSchema],
  patientName: { type: String },
  patientEmail: { type: String },
  patientDetails: PatientDetailsSchema
});

export const PredictionModel = mongoose.models.Prediction || mongoose.model<IPredictionDocument>("Prediction", PredictionSchema);
