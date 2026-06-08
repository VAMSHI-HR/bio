import React, { useState } from "react";
import { 
  Activity, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Loader2 
} from "lucide-react";

interface LoginPageProps {
  onLogin: (email: string) => void;
  darkMode: boolean;
}

export default function LoginPage({ onLogin, darkMode }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    // Simulate clinical login check
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1200);
  };

  return (
    <div id="login-page" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-600/10 blur-3xl" />

      {/* Decorative Grid wave lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent -z-10" />

      {/* Login Card container */}
      <div className="w-full max-w-md bg-white/75 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 p-8 rounded-3xl shadow-xl space-y-8 relative">
        
        {/* Top Header Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto bg-gradient-to-tr from-blue-600 to-sky-500 text-white p-3 rounded-2xl w-fit shadow-md shadow-blue-500/20 animate-pulse">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">MediPredict AI</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-1">Comprehensive Diagnostics Terminal</p>
          </div>
        </div>

        {/* Informative alert banner */}
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-3.5 rounded-xl text-center">
          <p className="text-[11px] text-blue-600 dark:text-blue-400 leading-normal font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Enter any valid email and password to log in.
          </p>
        </div>

        {/* Validation Errors */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold transition-all">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="doctor@medipredict.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition duration-200"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Security Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Establishing Session...
              </>
            ) : (
              <>
                Sign In to Terminal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info text */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            Secured Research Network Connection
          </p>
        </div>

      </div>
    </div>
  );
}
