import React from "react";
import { 
  FileText, 
  Download, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Heart,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { PredictionResult } from "../types";

interface ResultsViewProps {
  report: PredictionResult | null;
  onBackToForm: () => void;
}

export default function ResultsView({ report, onBackToForm }: ResultsViewProps) {
  if (!report) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold">No Active Report Computed</h3>
        <p className="text-xs text-slate-500 mt-2">
          Please input physiological biomarkers and submit the diagnostics formulary to view analysis graphs.
        </p>
        <button
          onClick={onBackToForm}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
        >
          Go to Form
        </button>
      </div>
    );
  }

  // Calculate SVG stroke offset
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius; // ~502.6
  const strokeDashoffset = circumference - (circumference * report.riskPercentage) / 100;

  // Severity color styles
  const isHigh = report.severityIndicator === "High Risk";
  const isMedium = report.severityIndicator === "Medium Risk";
  const severityConfig = {
    colorClass: isHigh 
      ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400" 
      : isMedium 
        ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400" 
        : "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400",
    icon: isHigh 
      ? XCircle 
      : isMedium 
        ? AlertTriangle 
        : CheckCircle,
    ringColor: isHigh 
      ? "text-rose-500" 
      : isMedium 
        ? "text-amber-500" 
        : "text-emerald-500"
  };

  const SeverityIcon = severityConfig.icon;

  // Create downloadable TXT report
  const handleDownloadReport = () => {
    const link = document.createElement("a");
    link.href = `/api/reports/pdf/${report.id}`;
    link.setAttribute("download", `MediPredict_Report_${report.id}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="results-view" className="space-y-8 animate-in fade-in duration-200">
      
      {/* Back link */}
      <div>
        <button
          onClick={onBackToForm}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Diagnostics Inputs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Score card */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-8 rounded-3xl shadow-sm text-center flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Compute Summary</span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{report.diseaseName}</h3>
          </div>

          {/* SVG Ring */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                className="text-slate-100 dark:text-slate-800"
              />
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`transition-all duration-1000 ease-out ${severityConfig.ringColor}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter">{report.riskPercentage}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Calculated Risk</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Severity Indicator Alert box */}
            <div className={`p-4 border rounded-2xl flex items-center justify-center gap-2.5 font-bold text-sm ${severityConfig.colorClass}`}>
              <SeverityIcon className="w-5 h-5 shrink-0" />
              <span>Diagnostic Level: {report.severityIndicator}</span>
            </div>

            <div className="flex items-center justify-between text-xs px-2">
              <span className="text-slate-500 dark:text-slate-400">Model Confidence:</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md">{report.confidenceScore}% Acc</span>
            </div>
          </div>
        </div>

        {/* Right Side: AI description, Precautions, Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI generated explanation box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
                AI-Generated Synthesis Explanation
              </h4>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical model feed</span>
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800 pt-4">
              {report.explanation}
            </p>
          </div>

          {/* Action buttons list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Recommended Precautions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Precautions & Diet guidance</h4>
              <ul className="space-y-3">
                {report.precautions.map((p, index) => (
                  <li key={index} className="flex gap-2.5 items-start text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick stats download / Action */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Report Compilation</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3">
                  This report includes calculations for standard biomarkers, symptoms reported, and preventative nutrition directives generated securely. Use it for university submission or documentation storage.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  id="download-report-btn"
                  onClick={handleDownloadReport}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white font-extrabold py-3 rounded-xl hover:from-blue-700 hover:to-sky-700 transition duration-150 text-xs shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <span className="text-[10px] text-center block text-slate-400 dark:text-slate-500">Includes secure parameters mapping checksum</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Biomarker details cards list */}
      <div className="space-y-3">
        <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Interactive Biomarkers Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.biomarkerAnalysis.map((b, index) => {
            const isAbnormal = b.status === "Abnormal";
            const isElevated = b.status === "Elevated";
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                    isAbnormal 
                      ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600" 
                      : isElevated 
                        ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600" 
                        : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
                  }`}>
                    {b.status}
                  </span>
                </div>
                
                <div>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-white block tracking-tight">{b.value}</span>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 leading-normal">{b.impact}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
