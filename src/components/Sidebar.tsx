import React from "react";
import { 
  BarChart2, 
  Stethoscope, 
  History, 
  Contact, 
  Activity, 
  LogOut, 
  Sun, 
  Moon,
  User
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  patientEmail: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  patientEmail
}: SidebarProps) {
  
  const navItems = [
    { id: "prediction", label: "Diagnostics Form", desc: "Biomarker Input", icon: Stethoscope },
    { id: "analytics", label: "Health Analytics", desc: "Visual Trends", icon: BarChart2 },
    { id: "history", label: "Saved Reports", desc: "Your History", icon: History },
    { id: "contacts", label: "Helpline & Tips", desc: "Emergency Care", icon: Contact },
  ];

  return (
    <>
      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-sky-500 p-2 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-white tracking-tight uppercase text-xs">MediPredict AI</span>
              <span className="block text-[10px] text-emerald-500 font-bold">Research Portal</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-3">Main Navigation</div>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false); // Auto close on mobile select
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-medium transition-all group duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-sky-50/50 dark:from-blue-950/40 dark:to-sky-950/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-500"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white"
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                <div className="text-left">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="block text-[10.5px] text-slate-400 dark:text-slate-500 font-normal leading-tight">{item.desc}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Theme select & Quick Profile */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 bg-slate-50/40 dark:bg-slate-900/20">
          
          {/* Theme custom toggle */}
          <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {darkMode ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-200 dark:bg-blue-600"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  darkMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Patient Profile */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {patientEmail ? patientEmail.slice(0, 2).toUpperCase() : "JD"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate leading-snug">
                  {patientEmail ? patientEmail.split('@')[0] : "Guest User"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-0.5 truncate">
                  <User className="w-2.5 h-2.5 text-sky-500 shrink-0" />
                  {patientEmail || "Not logged in"}
                </p>
              </div>
            </div>

            <button 
              id="logout-btn"
              className="w-full text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer" 
              onClick={onLogout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
