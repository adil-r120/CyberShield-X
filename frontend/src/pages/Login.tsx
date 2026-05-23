import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Zap, Loader2, AlertTriangle, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/api/auth/login', { email, password });
      login(res.data.access_token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Access Denied. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 py-12 overflow-x-hidden overflow-y-auto select-none relative font-sans">
      {/* Background Intelligence Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Themed Gradients */}
        <div className="absolute top-[-25%] left-[-15%] w-[70%] h-[70%] bg-blue-500/20 blur-[140px] rounded-full animate-pulse opacity-60"></div>
        <div className="absolute bottom-[-25%] right-[-15%] w-[70%] h-[70%] bg-cyan-600/10 blur-[140px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"></div>

        {/* Background Image */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <img
            src="/logo.png"
            alt="Background"
            className="w-full h-full object-cover opacity-15 mix-blend-screen"
          />
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Main Command Unit */}
      <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 transition-all duration-700 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000">
        
        {/* Terminal Header / Branding (Left Side) */}
        <div className="text-center space-y-6 md:flex-1 w-full flex flex-col items-center justify-center">
          <div className="relative inline-flex mb-2">
            <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-40 animate-pulse"></div>
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-black rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              CyberShield <span className="text-blue-500">X</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-[0.8em]">
              Forensic Intelligence Hub
            </p>
          </div>
        </div>

        {/* Access Module (Glass Card - Right Side) */}
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group shrink-0">
          {/* Internal Glow Effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Success Message Protocol */}
            {successMessage && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Identity Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 block">Identity Identifier</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@cybershield.x"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/60 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Encryption Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4 block">Encryption Key</label>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-12 text-sm font-bold text-white placeholder:text-slate-700 focus:border-blue-500/50 focus:bg-black/60 outline-none transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 group active:scale-95 overflow-hidden relative"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Zap className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                  Login Securely
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </>
              )}
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Module Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              No clearance level?
              <Link to="/signup" className="text-blue-500 ml-2 hover:text-blue-400 hover:underline transition-colors">Sign Up</Link>
            </p>
          </div>
        </div>

        {/* Environmental Metadata */}
        <div className="absolute bottom-6 left-6 flex-col items-start space-y-4 opacity-40 hidden md:flex">
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.6em]">
            System Status: <span className="text-emerald-500">Operational</span>
          </p>
          <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
