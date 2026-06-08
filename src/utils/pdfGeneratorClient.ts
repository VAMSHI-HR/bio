import { jsPDF } from "jspdf";
import { PredictionResult } from "../types";

export function generatePredictionPdfClient(report: PredictionResult) {
  // Initialize A4 document in portrait with point measurements
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4"
  });

  // Color Palette
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

  let currentY = 45;

  // Helper function to check page boundaries and add a new page if needed
  const checkPage = (neededHeight: number) => {
    if (currentY + neededHeight > 730) {
      doc.addPage();
      currentY = 50;
      return true;
    }
    return false;
  };

  // --- HEADER SECTION ---
  doc.setTextColor(mutedBlue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("MEDIPREDICT AI", 50, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(slateGray);
  doc.text("CLINICAL DIAGNOSTICS & SCREENING LEDGER", 50, currentY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(darkNavy);
  doc.text(`REPORT ID: ${report.id}`, 545, currentY, { align: "right" });
  doc.text(`DATE: ${new Date(report.date).toLocaleString()}`, 545, currentY + 12, { align: "right" });
  doc.text("STATUS: SIMULATED NODE TEST", 545, currentY + 24, { align: "right" });

  currentY += 38;

  // Divider line
  doc.setDrawColor(lineDivider);
  doc.setLineWidth(1);
  doc.line(50, currentY, 545, currentY);

  currentY += 12;

  // --- REPORT SUMMARY BANNER ---
  doc.setFillColor(lightGray);
  doc.rect(50, currentY, 495, 45, "F");

  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("DIAGNOSTIC TARGET:", 65, currentY + 26);
  
  doc.setFont("helvetica", "normal");
  doc.text(report.diseaseName.toUpperCase(), 195, currentY + 26);

  doc.setTextColor(severityColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(report.severityIndicator.toUpperCase(), 530, currentY + 26, { align: "right" });

  currentY += 60;

  // --- PATIENT PROFILE SECTION ---
  doc.setTextColor(mutedBlue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PATIENT DEMOGRAPHICS & CLINICAL ASSAY BASELINE", 50, currentY);

  currentY += 5;
  doc.setDrawColor(lineDivider);
  doc.setLineWidth(0.5);
  doc.line(50, currentY, 545, currentY);

  currentY += 15;

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
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Patient Name: ", 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(pName, 120, currentY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Email: ", 280, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(pEmail, 320, currentY);

  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Age & Gender: ", 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${pAge} yrs / ${pGender}`, 120, currentY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Weight & Height: ", 280, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${pWeight} kg / ${pHeight} cm`, 365, currentY);

  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Fasting Glucose: ", 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${pGlu} mg/dL`, 120, currentY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Serum Cholesterol: ", 280, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${pChol} mg/dL`, 365, currentY);

  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Blood Pressure: ", 50, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(pBp, 120, currentY);
  
  doc.setFont("helvetica", "bold");
  doc.text("Symptoms List: ", 280, currentY);
  doc.setFont("helvetica", "normal");
  
  // Wrap symptoms list text
  const symLines = doc.splitTextToSize(pSyms, 180);
  symLines.forEach((line: string, idx: number) => {
    doc.text(line, 365, currentY + (idx * 10));
  });

  currentY += Math.max(30, symLines.length * 10 + 10);

  // --- METRIC METERS (RISK / CONFIDENCE) ---
  doc.setFillColor(lightGray);
  doc.rect(50, currentY, 235, 45, "F");
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ASSESSOR RISK ESTIMATE", 60, currentY + 15);
  doc.setFontSize(16);
  doc.setTextColor(severityColor);
  doc.text(`${report.riskPercentage}%`, 60, currentY + 32);

  doc.setFillColor(lightGray);
  doc.rect(310, currentY, 235, 45, "F");
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("AI MODEL ACCURACY CONFIDENCE", 320, currentY + 15);
  doc.setFontSize(16);
  doc.setTextColor(mutedBlue);
  doc.text(`${report.confidenceScore}% ACC`, 320, currentY + 32);

  currentY += 60;

  // --- BIOMARKER BREAKDOWN TABLE ---
  doc.setTextColor(mutedBlue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("CLINICAL BIOMARKERS SCREENING BREAKDOWN", 50, currentY);

  currentY += 5;
  doc.setDrawColor(lineDivider);
  doc.setLineWidth(0.5);
  doc.line(50, currentY, 545, currentY);

  currentY += 12;
  
  // Table Header
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("BIOMARKER ASSAY", 55, currentY);
  doc.text("OBSERVED VALUE", 175, currentY);
  doc.text("SEVERITY", 275, currentY);
  doc.text("PATHOPHYSIOLOGICAL IMPACT", 365, currentY);
  
  currentY += 8;
  doc.line(50, currentY, 545, currentY);
  
  // Table Rows
  (report.biomarkerAnalysis || []).forEach((bio) => {
    currentY += 14;
    
    let statusColor = "#10B981";
    if (bio.status === "Abnormal") statusColor = "#EF4444";
    else if (bio.status === "Elevated") statusColor = "#F59E0B";

    doc.setTextColor(darkNavy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(bio.name, 55, currentY);
    
    doc.setFont("helvetica", "normal");
    doc.text(bio.value, 175, currentY);
    
    doc.setTextColor(statusColor);
    doc.setFont("helvetica", "bold");
    doc.text(bio.status, 275, currentY);
      
    doc.setTextColor(slateGray);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(bio.impact, 180);
    lines.forEach((line: string, idx: number) => {
      doc.text(line, 365, currentY + (idx * 9));
    });

    const impactHeight = lines.length * 9;
    currentY += Math.max(12, impactHeight);
  });

  currentY += 25;

  // --- PATHOPHYSIOLOGICAL EXPLANATION ---
  checkPage(100);
  doc.setTextColor(mutedBlue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AI CLINICAL SYNTHESIS EXPLANATION", 50, currentY);

  currentY += 5;
  doc.setDrawColor(lineDivider);
  doc.setLineWidth(0.5);
  doc.line(50, currentY, 545, currentY);

  currentY += 12;
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  
  const explanationLines = doc.splitTextToSize(report.explanation, 495);
  explanationLines.forEach((line: string) => {
    checkPage(12);
    doc.text(line, 50, currentY);
    currentY += 11;
  });

  currentY += 15;

  // --- PRECAUTIONS SECTION ---
  checkPage(100);
  doc.setTextColor(mutedBlue);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("RECOMMENDED PRECAUTIONARY LIFESTYLE INTERVENTIONS", 50, currentY);

  currentY += 5;
  doc.setDrawColor(lineDivider);
  doc.setLineWidth(0.5);
  doc.line(50, currentY, 545, currentY);

  currentY += 12;
  doc.setTextColor(darkNavy);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  (report.precautions || []).forEach((prec) => {
    const precLines = doc.splitTextToSize(`• ${prec}`, 495);
    precLines.forEach((line: string, idx: number) => {
      checkPage(12);
      const indent = idx === 0 ? 50 : 58;
      doc.text(line, indent, currentY);
      currentY += 11;
    });
    currentY += 4;
  });

  // --- DISCLAIMER FOOTER ---
  if (currentY > 740) {
    doc.addPage();
    currentY = 50;
  }
  doc.setTextColor(slateGray);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  
  const disclaimerText = "CONFIDENTIALITY AND DISCLAIMER: This document is compiled via simulation protocols for education testing purposes only. It is not an actual certified medical diagnostic sheet. Please review metrics with qualified healthcare professionals.";
  const disclaimerLines = doc.splitTextToSize(disclaimerText, 495);
  
  let footerY = 750;
  disclaimerLines.forEach((line: string) => {
    doc.text(line, 297, footerY, { align: "center" });
    footerY += 9;
  });

  doc.save(`MediPredict_Report_${report.id}.pdf`);
}
