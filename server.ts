import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { 
  initDb, 
  savePrediction, 
  getHistory, 
  deletePrediction, 
  getPredictionById, 
  clearHistory 
} from "./backend/db";
import { matchSymptomsAndBiomarkers } from "./backend/symptomEngine";
import { generatePredictionPdf } from "./backend/pdfGenerator";
import { IPredictionResult } from "./backend/models";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log("Gemini Client successfully initialized.");
  } else {
    console.warn("Warning: GEMINI_API_KEY environment variable is not defined. AI functionality will be mocked.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini Client:", error);
}

// 1. Prediction API endpoint with DB storage and rules engine backup
app.post("/api/predict", async (req, res) => {
  const {
    disease = "Auto-Detect",
    age,
    gender,
    weight,
    height,
    bloodPressure,
    glucose,
    cholesterol,
    symptoms = [],
    symptomsDescription = "",
    customSymptoms = [],
    patientName = "",
    patientEmail = ""
  } = req.body;

  const inputs = { age, gender, weight, height, bloodPressure, glucose, cholesterol, symptoms, symptomsDescription, customSymptoms };

  // Run the rule-based clinical engine first to auto-detect the disease category
  const ruleResult = matchSymptomsAndBiomarkers(inputs, disease);

  let finalReport: IPredictionResult = {
    id: `report-${Date.now()}`,
    date: new Date().toISOString(),
    patientName,
    patientEmail,
    patientDetails: inputs,
    ...ruleResult
  };

  // If Gemini is configured, use it to perform deep clinical analysis and refine the summary
  if (ai) {
    try {
      const targetDiseaseText = (disease === "General" || disease === "Auto-Detect") 
        ? "Auto-Detect (evaluate the patient's symptoms, custom symptoms, and detailed description to identify the most likely disease condition. You are NOT restricted to the original 5 diseases; you may detect other conditions such as Influenza, COVID-19, Asthma, Hypertension, GERD, Migraine, Dehydration, etc.)" 
        : disease;

      const prompt = `Analyze the following patient health metrics and symptoms for assessing risk.
      
      PATIENT PARAMETERS:
      - Assessment Target request: ${targetDiseaseText}
      - Rule-Engine Pre-classified Target: ${finalReport.diseaseName}
      - Rule-Engine Risk: ${finalReport.riskPercentage}%
      - Rule-Engine Severity: ${finalReport.severityIndicator}
      - Age: ${age} years
      - Gender: ${gender}
      - Weight: ${weight} kg
      - Height: ${height} cm
      - Blood Pressure: ${bloodPressure}
      - Blood Glucose Level: ${glucose} mg/dL
      - Serum Cholesterol Level: ${cholesterol} mg/dL
      - Symptoms Selected: ${symptoms.length > 0 ? symptoms.join(", ") : "None reported"}
      - Custom Symptoms Added: ${customSymptoms.length > 0 ? customSymptoms.join(", ") : "None reported"}
      - Detailed Symptoms Description: ${symptomsDescription || "None provided"}

      You are an advanced medical diagnostics expert system. Identify the most likely disease based on symptoms, custom symptom list, free-text description, and biomarkers. Validate the risk and provide a highly professional, encouraging, and educational clinical explanation outlining the biological mechanism of risk, list actionable precautions, and break down each biomarker (Glucose, Cholesterol, age/vitals) explaining its impact on this specific disease risk.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a clinical artificial intelligence diagnostics processor. Analyze indicators and output complete and valid structured clinical reports according to the JSON schema. If the target request is 'Auto-Detect', identify which disease is most relevant. You are NOT restricted to the five pre-classified diseases; you can detect ANY likely medical condition (e.g. Influenza Assessment, COVID-19 Prediction, Asthma Assessment, Hypertension Assessment, GERD Prediction, Migraine Assessment, Dehydration Assessment, etc.) followed by 'Assessment' or 'Prediction'. Populate this in the 'diseaseName' output field. Always include standard precautionary disclaimers within the explanation text.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              diseaseName: { type: Type.STRING, description: "Identified disease name followed by 'Assessment' or 'Prediction', e.g., 'Influenza Assessment', 'COVID-19 Prediction'" },
              riskPercentage: { type: Type.INTEGER, description: "Risk value between 5 and 95" },
              confidenceScore: { type: Type.INTEGER, description: "Model diagnostic confidence value between 70 and 99" },
              severityIndicator: { type: Type.STRING, description: "Must be exactly 'Low Risk', 'Medium Risk', or 'High Risk'" },
              explanation: { type: Type.STRING, description: "In-depth clinical summary outlining the biological mechanism of risk" },
              precautions: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }, 
                description: "At least 4 lifestyle or clinical precautions" 
              },
              biomarkerAnalysis: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "E.g., Glucose Level" },
                    value: { type: Type.STRING, description: "E.g., 140 mg/dL" },
                    status: { type: Type.STRING, description: "Must be exactly 'Normal', 'Elevated', or 'Abnormal'" },
                    impact: { type: Type.STRING, description: "Brief explanation of impact" }
                  },
                  required: ["name", "value", "status", "impact"]
                }
              }
            },
            required: ["diseaseName", "riskPercentage", "confidenceScore", "severityIndicator", "explanation", "precautions", "biomarkerAnalysis"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const aiData = JSON.parse(responseText);
        finalReport = {
          ...finalReport,
          diseaseName: aiData.diseaseName || finalReport.diseaseName,
          riskPercentage: typeof aiData.riskPercentage === "number" ? aiData.riskPercentage : finalReport.riskPercentage,
          confidenceScore: typeof aiData.confidenceScore === "number" ? aiData.confidenceScore : finalReport.confidenceScore,
          severityIndicator: aiData.severityIndicator || finalReport.severityIndicator,
          explanation: aiData.explanation || finalReport.explanation,
          precautions: aiData.precautions && aiData.precautions.length >= 4 ? aiData.precautions : finalReport.precautions,
          biomarkerAnalysis: aiData.biomarkerAnalysis || finalReport.biomarkerAnalysis
        };
      }
    } catch (aiError) {
      console.error("Gemini AI API prediction error, fallback to rules engine details:", aiError);
    }
  }

  try {
    const saved = await savePrediction(finalReport);
    res.json(saved);
  } catch (error) {
    console.error("Failed to save report to database:", error);
    res.status(500).json({ error: "Failed to compile results into database." });
  }
});

// 2. Fetch all reports history
app.get("/api/history", async (req, res) => {
  try {
    const list = await getHistory();
    res.json(list);
  } catch (error) {
    console.error("Fetch history error:", error);
    res.status(500).json({ error: "Failed to retrieve history." });
  }
});

// 3. Delete a report by ID
app.delete("/api/history/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await deletePrediction(id);
    if (deleted) {
      res.json({ success: true, message: "Record successfully deleted." });
    } else {
      res.status(404).json({ error: "Record not found in system." });
    }
  } catch (error) {
    console.error("Delete history error:", error);
    res.status(500).json({ error: "Failed to delete record." });
  }
});

// 4. Clear all reports history
app.post("/api/history/clear", async (req, res) => {
  try {
    await clearHistory();
    res.json({ success: true, message: "All logs wiped successfully." });
  } catch (error) {
    console.error("Clear database logs error:", error);
    res.status(500).json({ error: "Failed to wipe history ledger." });
  }
});

// 5. Generate PDF report stream
app.get("/api/reports/pdf/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const record = await getPredictionById(id);
    if (!record) {
      return res.status(404).json({ error: "Diagnostic report not found." });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=MediPredict_${id}.pdf`);
    
    generatePredictionPdf(record, res);
  } catch (error) {
    console.error("PDF generator error:", error);
    res.status(500).json({ error: "Could not compile PDF binary." });
  }
});

// 6. Aggregate Dashboard Analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const history = await getHistory();
    
    // Aggregation maps
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyPrevalence = months.slice(0, new Date().getMonth() + 1).map(m => ({
      name: m,
      Diabetes: 0,
      Heart: 0,
      Kidney: 0,
      Liver: 0,
      Parkinson: 0
    }));

    let lowRiskCount = 0;
    let mediumRiskCount = 0;
    let highRiskCount = 0;
    let totalRiskSum = 0;

    const cohortCounts: Record<string, number> = {
      "Diabetes Risk": 0,
      "Vascular/Heart": 0,
      "Renal Risk": 0,
      "Hepatic/Liver": 0,
      "Neuromotor": 0
    };

    history.forEach((h) => {
      const date = new Date(h.date);
      const mIdx = date.getMonth();
      const mName = months[mIdx];
      
      const bucket = monthlyPrevalence.find(b => b.name === mName);
      if (bucket) {
        const dName = h.diseaseName.toLowerCase();
        if (dName.includes("diabetes")) bucket.Diabetes++;
        else if (dName.includes("heart") || dName.includes("vascular")) bucket.Heart++;
        else if (dName.includes("kidney") || dName.includes("renal")) bucket.Kidney++;
        else if (dName.includes("liver") || dName.includes("hepatic")) bucket.Liver++;
        else if (dName.includes("parkinson") || dName.includes("neuromotor")) bucket.Parkinson++;
      }

      if (h.severityIndicator === "High Risk") highRiskCount++;
      else if (h.severityIndicator === "Medium Risk") mediumRiskCount++;
      else lowRiskCount++;

      totalRiskSum += h.riskPercentage;

      const dName = h.diseaseName.toLowerCase();
      if (dName.includes("diabetes")) cohortCounts["Diabetes Risk"]++;
      else if (dName.includes("heart") || dName.includes("vascular")) cohortCounts["Vascular/Heart"]++;
      else if (dName.includes("kidney") || dName.includes("renal")) cohortCounts["Renal Risk"]++;
      else if (dName.includes("liver") || dName.includes("hepatic")) cohortCounts["Hepatic/Liver"]++;
      else if (dName.includes("parkinson") || dName.includes("neuromotor")) cohortCounts["Neuromotor"]++;
    });

    const cohortSpread = Object.entries(cohortCounts).map(([name, value]) => ({ name, value }));
    const avgRisk = history.length > 0 ? Math.round(totalRiskSum / history.length) : 0;

    res.json({
      totalReports: history.length,
      avgRisk,
      lowRiskCount,
      mediumRiskCount,
      highRiskCount,
      monthlyPrevalence,
      cohortSpread
    });
  } catch (error) {
    console.error("Fetch stats aggregation error:", error);
    res.status(500).json({ error: "Failed to query analytics." });
  }
});

// 7. Chat API endpoint for medical chatbot assistant (context-aware)
app.post("/api/chat", async (req, res) => {
  const { messages = [] } = req.body;

  if (messages.length === 0) {
    return res.status(400).json({ error: "Message content is required." });
  }

  // Fallback if Gemini client is not initialized
  if (!ai) {
    return res.json({
      text: "Hello! I am the MediPredict AI Assistant. I can see you've asked a health-related question. If you configure a valid GEMINI_API_KEY, I can review your disease results, evaluate symptom metrics, and provide specific medical guidance. For now, please consult your healthcare provider or review standard diagnostic guidelines.",
    });
  }

  try {
    // Inject latest patient diagnostic context to make the chatbot context-aware
    const history = await getHistory();
    const latestRecord = history[0];
    let contextString = "";

    if (latestRecord) {
      contextString = `\n[Context: The user's latest clinical risk assessment is for ${
        latestRecord.diseaseName
      } computed on ${new Date(latestRecord.date).toLocaleDateString()}. Patient Details: Age: ${
        latestRecord.patientDetails?.age
      }, Gender: ${latestRecord.patientDetails?.gender}, Glucose: ${
        latestRecord.patientDetails?.glucose
      } mg/dL, Cholesterol: ${
        latestRecord.patientDetails?.cholesterol
      } mg/dL. Risk: ${latestRecord.riskPercentage}% (${
        latestRecord.severityIndicator
      }). AI Explanation: ${latestRecord.explanation.slice(0, 300)}...]\n`;
    }

    const chatContext = messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join("\n");
    const prompt = `${chatContext}\n${contextString}\nHelp the user with their medical query. Maintain a supportive, reassuring, and professional clinical tone. Reference their patient metrics when answering if relevant, but always remind them this is a simulation and they should consult a real provider.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are MediPredict AI, a friendly, professional, and knowledgeable medical conversational agent. Answer health questions clearly. Avoid giving raw diagnoses, emphasize simulation purposes, and suggest consulting professionals for serious symptoms.",
      }
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini /api/chat error:", error);
    res.status(500).json({ error: "Sorry, I encountered an error. Please try again." });
  }
});

// Vite & Static file serving setup
async function startServer() {
  // Initialize Database before starting listener
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode setup
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware attached in development mode.");
  } else {
    // Production Mode setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
