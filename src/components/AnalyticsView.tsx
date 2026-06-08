import React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { 
  BarChart2, 
  Layers, 
  TrendingUp, 
  Activity, 
  Users, 
  Clock, 
  BookmarkCheck,
  Eye
} from "lucide-react";
import { PredictionResult } from "../types";
import { CLINICAL_ANALYTICS_DATA } from "../data";

interface AnalyticsViewProps {
  history: PredictionResult[];
  onSelectRecord: (id: string) => void;
}

export default function AnalyticsView({ history, onSelectRecord }: AnalyticsViewProps) {
  
  // Color palette constants for Recharts
  const COLORS = ["#2563EB", "#10B981", "#D97706", "#EF4444", "#8B5CF6"];

  // Calculate some simple analytics from user history
  const totalReportsNum = history.length;
  const avgRiskValue = totalReportsNum > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskPercentage, 0) / totalReportsNum) 
    : 0;

  const countRiskSeverity = (level: "Low Risk" | "Medium Risk" | "High Risk") => {
    return history.filter(item => item.severityIndicator === level).length;
  };

  // Compile user's specific mini history distribution for a PieChart if they have computed reports!
  const userPieData = history.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.diseaseName);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.diseaseName, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div id="analytics-view" className="space-y-8 animate-in fade-in duration-200">
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Diagnoses Run</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{totalReportsNum}</span>
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">calculated cycles</span>
          </div>
          <div className="mt-3.5 flex items-center gap-1.5 text-[10.5px] text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/20 py-1 px-2.5 rounded-lg w-fit">
            <Clock className="w-3.5 h-3.5" /> Tracked History
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Average Risk Index</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white">{avgRiskValue}%</span>
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">calculated average</span>
          </div>
          <div className="mt-3.5 flex items-center gap-1.5 text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 py-1 px-2.5 rounded-lg w-fit">
            <TrendingUp className="w-3.5 h-3.5" /> Stable Baseline
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Cohort Safe Cases</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-[#10B981]">{countRiskSeverity("Low Risk")}</span>
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">low danger reports</span>
          </div>
          <div className="mt-3.5 flex items-center gap-1.5 text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 py-1 px-2.5 rounded-lg w-fit">
            <BookmarkCheck className="w-3.5 h-3.5" /> Action Plan Stable
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Attention Warning Cases</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-rose-500">{countRiskSeverity("High Risk") + countRiskSeverity("Medium Risk")}</span>
            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">at-risk threshold</span>
          </div>
          <div className="mt-3.5 flex items-center gap-1.5 text-[10.5px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 py-1 px-2.5 rounded-lg w-fit">
            <Activity className="w-3.5 h-3.5" /> Elevated Warning
          </div>
        </div>
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trend line: Monthly Simulation Incidence */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-widest uppercase">Incidence Trends By Month</h3>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">Cohort studies monitoring disease growth levels.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 text-xs font-semibold">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CLINICAL_ANALYTICS_DATA.monthlyPrevalence} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" className="hidden dark:block" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1e293b", 
                    color: "#f8fafc", 
                    borderRadius: "12px", 
                    border: "none", 
                    fontSize: "12px" 
                  }} 
                />
                <Legend iconSize={10} iconType="circle" />
                <Line type="monotone" dataKey="Diabetes" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Heart" stroke="#EF4444" strokeWidth={3} />
                <Line type="monotone" dataKey="Kidney" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="Parkinson" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spread breakdown: Cohort Distribution Map */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-widest uppercase">Risk Prevalences Breakdown</h3>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">Distribution map of cohort markers assessment.</p>
            </div>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-semibold">
            {/* Pie Chart element */}
            <div className="w-full sm:w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userPieData.length > 0 ? userPieData : CLINICAL_ANALYTICS_DATA.cohortSpread}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(userPieData.length > 0 ? userPieData : CLINICAL_ANALYTICS_DATA.cohortSpread).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      color: "#f8fafc", 
                      borderRadius: "12px", 
                      border: "none", 
                      fontSize: "12px" 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recharts Legend labels Custom display */}
            <div className="w-full sm:w-1/2 space-y-2 px-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Legend:</span>
              {(userPieData.length > 0 ? userPieData : CLINICAL_ANALYTICS_DATA.cohortSpread).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-slate-350 truncate">{item.name}</span>
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200 shrink-0">
                    {userPieData.length > 0 ? `${item.value} times` : `${item.value}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Recent History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-widest uppercase">Recent Prediction Logs</h3>
            <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">Click "View Analysis" to restore the interactive progress wheel of any report.</p>
          </div>
          <span className="text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-xl">History Ledger</span>
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No reports available on this workstation. Run some analysis to populate logs.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4">Disease Analysis Target</th>
                  <th className="px-6 py-4">Diagnostic Timestamp</th>
                  <th className="px-6 py-4 text-center">Risk Factor</th>
                  <th className="px-6 py-4">Severity Code</th>
                  <th className="px-6 py-4">Accuracy Confidence</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {history.map((h) => {
                  const isHigh = h.severityIndicator === "High Risk";
                  const isMedium = h.severityIndicator === "Medium Risk";
                  
                  return (
                    <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition duration-150 text-slate-700 dark:text-slate-300">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        {h.diseaseName}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(h.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-extrabold text-sm">{h.riskPercentage}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isHigh 
                            ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600" 
                            : isMedium 
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600" 
                              : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600"
                        }`}>
                          {h.severityIndicator}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-600 dark:text-blue-400 font-semibold">
                        {h.confidenceScore}% confidence
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          id={`history-btn-view-${h.id}`}
                          onClick={() => onSelectRecord(h.id)}
                          className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-blue-600 hover:text-white hover:shadow-xs transition duration-150 inline-flex items-center gap-1.5 cursor-pointer font-bold border border-slate-200/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Results
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
