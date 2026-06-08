import PDFDocument from "pdfkit";
import { Response } from "express";
import { IPredictionResult } from "./models";

export function generatePredictionPdf(report: IPredictionResult, res: Response) {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  // Stream output to HTTP response
  doc.pipe(res);

  // Colors
  const darkNavy = "#0F172A";
  const mutedBlue = "#2563EB";
  const slateGray = "#475569";
  const lightGray = "#F1F5F9";
  const lineDivider = "#CBD5E1";

  let severityColor = "#10B981"; // Emerald
  if (report.severityIndicator === "High Risk") {
    severityColor = "#EF4444"; // Rose
  } else if (report.severityIndicator === "Medium Risk") {
    severityColor = "#F59E0B"; // Amber
  }

  // --- HEADER SECTION ---
  doc
    .fillColor(mutedBlue)
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("MEDIPREDICT AI", 50, 45)
    .fontSize(10)
    .fillColor(slateGray)
    .text("CLINICAL DIAGNOSTICS & SCREENING LEDGER", 50, 68);

  doc
    .fillColor(darkNavy)
    .fontSize(8)
    .text(`REPORT ID: ${report.id}`, 380, 45, { align: "right" })
    .text(`DATE: ${new Date(report.date).toLocaleString()}`, 380, 58, { align: "right" })
    .text("STATUS: SIMULATED NODE TEST", 380, 71, { align: "right" });

  doc.moveTo(50, 88).lineTo(545, 88).strokeColor(lineDivider).lineWidth(1).stroke();

  // --- REPORT SUMMARY BANNER ---
  doc
    .rect(50, 100, 495, 45)
    .fill(lightGray);

  doc
    .fillColor(darkNavy)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("DIAGNOSTIC TARGET:", 65, 116)
    .font("Helvetica")
    .text(report.diseaseName.toUpperCase(), 195, 116);

  doc
    .fillColor(severityColor)
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(report.severityIndicator.toUpperCase(), 380, 116, { align: "right", width: 150 });

  // --- PATIENT PROFILE SECTION ---
  doc.y = 160;
  doc
    .fillColor(mutedBlue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("PATIENT DEMOGRAPHICS & CLINICAL ASSAY BASELINE", 50, doc.y);

  doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor(lineDivider).lineWidth(0.5).stroke();

  doc.y = doc.y + 12;
  const pName = report.patientName || "Anonymous";
  const pEmail = report.patientEmail || "N/A";
  const pAge = report.patientDetails?.age || "N/A";
  const pGender = report.patientDetails?.gender || "N/A";
  const pWeight = report.patientDetails?.weight || "N/A";
  const pHeight = report.patientDetails?.height || "N/A";
  const pBp = report.patientDetails?.bloodPressure || "N/A";
  const pGlu = report.patientDetails?.glucose || "N/A";
  const pChol = report.patientDetails?.cholesterol || "N/A";
  const allSymptomsList = [
    ...(report.patientDetails?.symptoms || []),
    ...(report.patientDetails?.customSymptoms || [])
  ];
  const pSyms = allSymptomsList.join(", ") || "None reported";

  // Grid Layout
  doc
    .fillColor(darkNavy)
    .font("Helvetica-Bold")
    .fontSize(9)
    .text("Patient Name: ", 50, doc.y)
    .font("Helvetica")
    .text(pName, 120, doc.y)
    .font("Helvetica-Bold")
    .text("Email: ", 280, doc.y)
    .font("Helvetica")
    .text(pEmail, 320, doc.y);

  doc.y = doc.y + 12;
  doc
    .font("Helvetica-Bold")
    .text("Age & Gender: ", 50, doc.y)
    .font("Helvetica")
    .text(`${pAge} yrs / ${pGender}`, 120, doc.y)
    .font("Helvetica-Bold")
    .text("Weight & Height: ", 280, doc.y)
    .font("Helvetica")
    .text(`${pWeight} kg / ${pHeight} cm`, 365, doc.y);

  doc.y = doc.y + 12;
  doc
    .font("Helvetica-Bold")
    .text("Fasting Glucose: ", 50, doc.y)
    .font("Helvetica")
    .text(`${pGlu} mg/dL`, 120, doc.y)
    .font("Helvetica-Bold")
    .text("Serum Cholesterol: ", 280, doc.y)
    .font("Helvetica")
    .text(`${pChol} mg/dL`, 365, doc.y);

  doc.y = doc.y + 12;
  doc
    .font("Helvetica-Bold")
    .text("Blood Pressure: ", 50, doc.y)
    .font("Helvetica")
    .text(pBp, 120, doc.y)
    .font("Helvetica-Bold")
    .text("Symptoms List: ", 280, doc.y)
    .font("Helvetica")
    .text(pSyms, 365, doc.y, { width: 180, height: 25 });

  // --- METRIC METERS (RISK / CONFIDENCE) ---
  const metersY = doc.y + 30;
  doc.y = metersY;

  // Left Box (Risk)
  doc
    .rect(50, metersY, 235, 45)
    .fill(lightGray);
  doc
    .fillColor(darkNavy)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("ASSESSOR RISK ESTIMATE", 60, metersY + 10)
    .fontSize(16)
    .fillColor(severityColor)
    .text(`${report.riskPercentage}%`, 60, metersY + 20);

  // Right Box (Confidence)
  doc
    .rect(310, metersY, 235, 45)
    .fill(lightGray);
  doc
    .fillColor(darkNavy)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("AI MODEL ACCURACY CONFIDENCE", 320, metersY + 10)
    .fontSize(16)
    .fillColor(mutedBlue)
    .text(`${report.confidenceScore}% ACC`, 320, metersY + 20);

  doc.y = metersY + 45;

  // --- BIOMARKER BREAKDOWN TABLE ---
  doc.y = doc.y + 15;
  doc
    .fillColor(mutedBlue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("CLINICAL BIOMARKERS SCREENING BREAKDOWN", 50, doc.y);

  doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor(lineDivider).lineWidth(0.5).stroke();

  doc.y = doc.y + 12;
  
  // Table Header
  doc
    .fillColor(darkNavy)
    .font("Helvetica-Bold")
    .fontSize(8.5)
    .text("BIOMARKER ASSAY", 55, doc.y)
    .text("OBSERVED VALUE", 175, doc.y)
    .text("SEVERITY", 275, doc.y)
    .text("PATHOPHYSIOLOGICAL IMPACT", 365, doc.y);
  
  doc.moveTo(50, doc.y + 8).lineTo(545, doc.y + 8).strokeColor(lineDivider).lineWidth(0.5).stroke();
  
  // Table Rows
  (report.biomarkerAnalysis || []).forEach((bio) => {
    doc.y = doc.y + 14;
    
    let statusColor = "#10B981";
    if (bio.status === "Abnormal") statusColor = "#EF4444";
    else if (bio.status === "Elevated") statusColor = "#F59E0B";

    doc
      .fillColor(darkNavy)
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(bio.name, 55, doc.y)
      .font("Helvetica")
      .text(bio.value, 175, doc.y);
    
    doc
      .fillColor(statusColor)
      .font("Helvetica-Bold")
      .text(bio.status, 275, doc.y);
      
    doc
      .fillColor(slateGray)
      .font("Helvetica")
      .text(bio.impact, 365, doc.y, { width: 180 });

    const impactHeight = doc.heightOfString(bio.impact, { width: 180 });
    doc.y = doc.y + Math.max(12, impactHeight);
  });

  // --- PATHOPHYSIOLOGICAL EXPLANATION ---
  doc.y = doc.y + 25;
  doc
    .fillColor(mutedBlue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("AI CLINICAL SYNTHESIS EXPLANATION", 50, doc.y);

  doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor(lineDivider).lineWidth(0.5).stroke();

  doc.x = 50;
  doc.y = doc.y + 12;
  doc
    .fillColor(darkNavy)
    .font("Helvetica")
    .fontSize(8.5)
    .text(report.explanation, { width: 495, align: "justify", lineGap: 2.5 });

  // --- PRECAUTIONS SECTION ---
  doc.y = doc.y + 15;
  doc
    .fillColor(mutedBlue)
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("RECOMMENDED PRECAUTIONARY LIFESTYLE INTERVENTIONS", 50, doc.y);

  doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).strokeColor(lineDivider).lineWidth(0.5).stroke();

  doc.x = 50;
  doc.y = doc.y + 12;
  (report.precautions || []).forEach((prec) => {
    doc
      .fillColor(darkNavy)
      .font("Helvetica")
      .fontSize(8.5)
      .text(`• ${prec}`, { width: 495, paragraphGap: 4 });
  });

  // --- DISCLAIMER FOOTER ---
  doc
    .fillColor(slateGray)
    .font("Helvetica-Oblique")
    .fontSize(7.5)
    .text(
      "CONFIDENTIALITY AND DISCLAIMER: This document is compiled via simulation protocols for education testing purposes only. It is not an actual certified medical diagnostic sheet. Please review metrics with qualified healthcare professionals.",
      50,
      740,
      { align: "center", width: 495 }
    );

  doc.end();
}
