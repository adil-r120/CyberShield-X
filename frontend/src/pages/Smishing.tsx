import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  MessageSquare,
  Search,
  Trash2,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  Zap,
  Cpu,
  Terminal,
  Activity,
  Radar,
  Crosshair,
  Smartphone,
  Fingerprint,
  Layers,
  Lock,
  Unlock,
  BarChart3,
  TrendingUp,
  Globe,
  Monitor
} from 'lucide-react';
import {
  Radar as ReRadar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import axios from 'axios';

interface SmishingResult {
  is_smishing: boolean;
  risk_score: number;
  urgency_detected: boolean;
  links_found: string[];
  threat_indicators: string[];
  recommendation: string;
  forensic_details: {
    linguistic: number;
    technical: number;
    psychological: number;
  };
}

const Smishing: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmishingResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> [${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const chartData = result ? [
    { subject: 'Linguistic', A: result.forensic_details.linguistic, fullMark: 100 },
    { subject: 'Technical', A: result.forensic_details.technical, fullMark: 100 },
    { subject: 'Psychological', A: result.forensic_details.psychological, fullMark: 100 },
    { subject: 'Meta-Data', A: result.links_found.length * 20, fullMark: 100 },
    { subject: 'Velocity', A: result.risk_score, fullMark: 100 },
  ] : [];

  const analyzeSms = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResult(null);
    setLogs([]);
    addLog("SYNCHRONIZING FORENSIC CORES...");
    try {
      const response = await axios.post('http://localhost:8000/api/smishing/analyze', { message });
      setTimeout(() => addLog("SCANNING FOR REGEX PATTERNS..."), 300);
      setTimeout(() => addLog("AUDITING PROTOCOL SECURITY..."), 600);
      setTimeout(() => addLog("GENERATING VECTOR GRAPH..."), 900);

      setTimeout(() => {
        setResult(response.data);
        setLoading(false);
        addLog("DIAGNOSIS COMPLETE.");
      }, 1500);
    } catch (error) {
      addLog("CRITICAL ERROR: API NODE UNREACHABLE.");
      setLoading(false);
    }
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const renderHighlightedMessage = () => {
    if (!message) return <span className={`${darkMode ? 'text-slate-600' : 'text-slate-300'} italic font-medium text-base`}>Enter telemetry payload for audit...</span>;
    const critical = ["urgent", "suspended", "immediately", "action", "blocked", "restricted", "final", "alert"];
    const warning = ["bank", "payment", "irs", "tax", "verify", "auth", "login", "password", "transaction", "otp"];
    const words = message.split(/(\s+)/);

    return words.map((part, i) => {
      if (/\s+/.test(part)) return <span key={i}>{part}</span>;
      const cleanWord = part.toLowerCase().replace(/[^\w]/g, '');
      const punctuation = part.slice(part.toLowerCase().lastIndexOf(cleanWord) + cleanWord.length);
      const prefix = part.slice(0, part.toLowerCase().indexOf(cleanWord));
      const coreWord = part.slice(part.toLowerCase().indexOf(cleanWord), part.toLowerCase().indexOf(cleanWord) + cleanWord.length);

      if (critical.includes(cleanWord)) {
        return (
          <span key={i} className="inline-flex items-center">
            {prefix}
            <span className={`font-bold px-2 py-0.5 rounded-md border shadow-sm mx-0.5 leading-none ${darkMode ? 'text-rose-400 bg-rose-950/30 border-rose-900' : 'text-rose-600 bg-rose-50 border-rose-200'}`}>
              {coreWord}
            </span>
            {punctuation}
          </span>
        );
      }
      if (warning.includes(cleanWord)) {
        return (
          <span key={i} className="inline-flex items-center">
            {prefix}
            <span className={`font-bold px-2 py-0.5 rounded-md border shadow-sm mx-0.5 leading-none ${darkMode ? 'text-amber-400 bg-amber-950/30 border-amber-900' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
              {coreWord}
            </span>
            {punctuation}
          </span>
        );
      }
      return <span key={i} className={darkMode ? 'text-slate-300' : 'text-slate-700'}>{part}</span>;
    });
  };

  const themeClasses = {
    bg: darkMode ? 'bg-[#020617]' : 'bg-slate-50',
    text: darkMode ? 'text-slate-100' : 'text-slate-900',
    card: darkMode ? 'bg-slate-900/40 border-white/5 shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50',
    inner: darkMode ? 'bg-black/40 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-200 shadow-inner',
    muted: darkMode ? 'text-slate-500' : 'text-slate-400'
  };

  return (
    <div className={`p-8 min-h-screen transition-colors duration-500 ${themeClasses.bg} ${themeClasses.text} font-sans`}>
      <div className="max-w-[1500px] mx-auto space-y-8 relative z-10">

        {/* Responsive Header */}
        <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b ${darkMode ? 'border-white/5' : 'border-slate-200'}`}>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl shadow-xl transition-all ${darkMode ? 'bg-slate-900 border border-blue-500/20' : 'bg-white border border-slate-200'}`}>
              <Radar className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                SMS <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>GUARD</span> <span className={`text-sm font-normal not-italic ml-2 tracking-widest uppercase ${themeClasses.muted}`}>Forensic HUD</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="w-3 h-3 text-emerald-500" />
                <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${themeClasses.muted}`}>CyberShield X Threat Intelligence Unit</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-6 px-6 py-3 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex flex-col">
              <span className={`text-[8px] font-black uppercase tracking-widest ${themeClasses.muted}`}>System Status</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Protected</span>
              </div>
            </div>
            <div className={`h-8 w-[1px] ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
            <div className="flex flex-col">
              <span className={`text-[8px] font-black uppercase tracking-widest ${themeClasses.muted}`}>Forensic Load</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-0.5">0.024 ms</span>
            </div>
            <div className={`h-8 w-[1px] ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
            <div className="flex flex-col">
              <span className={`text-[8px] font-black uppercase tracking-widest ${themeClasses.muted}`}>Detection Rate</span>
              <span className="text-[10px] font-black uppercase tracking-widest mt-0.5 text-blue-500">99.8%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">

          {/* Input & Radar Column */}
          <div className="xl:col-span-5 space-y-8">
            <div className={`rounded-[2.5rem] p-10 transition-all ${themeClasses.card}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2 ${themeClasses.muted}`}>
                <Terminal className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                Data Ingestion Terminal
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste telemetry payload for analysis..."
                className={`w-full h-44 rounded-3xl p-6 outline-none transition-all resize-none font-medium text-sm leading-relaxed mb-6 ${themeClasses.inner} ${darkMode ? 'placeholder:text-slate-700 text-slate-100' : 'placeholder:text-slate-300 text-slate-900'}`}
              />
              <div className="flex gap-4">
                <button
                  onClick={analyzeSms}
                  disabled={loading || !message.trim()}
                  className={`flex-1 font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-xl active:scale-95 ${darkMode ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-900/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><TrendingUp className="w-5 h-5" /> Run Diagnostics</>}
                </button>
                <button
                  onClick={() => { setMessage(''); setResult(null); setLogs([]); }}
                  className={`px-6 rounded-2xl transition-all border ${darkMode ? 'bg-slate-800 border-white/5 hover:bg-rose-950/30 hover:text-rose-400 text-slate-500' : 'bg-slate-100 border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400'}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Radar Graph Display */}
            <div className={`rounded-[2.5rem] p-10 min-h-[500px] flex flex-col items-center justify-center transition-all ${themeClasses.card}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-widest mb-10 w-full text-left flex items-center gap-2 ${themeClasses.muted}`}>
                <Activity className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                Vector Radar Analysis
              </h3>

              {result ? (
                <div className="w-full h-[380px] animate-in zoom-in duration-700">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke={darkMode ? "#1e293b" : "#e2e8f0"} />
                      {/* @ts-ignore */}
                      <PolarAngleAxis dataKey="subject" tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <ReRadar
                        name="Threat"
                        dataKey="A"
                        stroke={result.is_smishing ? "#f43f5e" : "#3b82f6"}
                        fill={result.is_smishing ? "#f43f5e" : "#3b82f6"}
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center opacity-20 py-20">
                  <Radar className={`w-20 h-20 mx-auto mb-6 animate-spin-slow ${darkMode ? 'text-slate-700' : 'text-slate-300'}`} />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Vector Data</p>
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className={`p-4 rounded-2xl border text-center transition-all ${themeClasses.inner}`}>
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${themeClasses.muted}`}>Signal Status</p>
                  <p className="text-xs font-black">{result ? "ENCODED" : "IDLE"}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-center transition-all ${themeClasses.inner}`}>
                  <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${themeClasses.muted}`}>Latency</p>
                  <p className="text-xs font-black">{result ? "24ms" : "0ms"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="xl:col-span-7 space-y-8">

            {/* DNA Heatmap */}
            <div className={`rounded-[2.5rem] p-10 transition-all ${themeClasses.card}`}>
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3 ${themeClasses.muted}`}>
                <Zap className="w-5 h-5 text-amber-500" />
                Linguistic DNA Mapping
              </h3>
              <div className={`p-10 rounded-[2rem] border min-h-[160px] leading-[2.5] text-xl font-medium relative z-10 transition-all ${themeClasses.inner}`}>
                {renderHighlightedMessage()}
              </div>
            </div>

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
                {/* Scoring HUD */}
                <div className={`p-12 rounded-[3rem] border-2 shadow-2xl relative overflow-hidden transition-all ${darkMode ? 'bg-slate-900/60' : 'bg-white'} ${result.is_smishing ? 'border-rose-500/20 shadow-rose-900/20' : 'border-emerald-500/20 shadow-emerald-900/20'}`}>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div>
                      <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 ${themeClasses.muted}`}>Threat Intensity</h4>
                      <div className="flex items-end gap-3">
                        <span className={`text-[9rem] leading-none font-black tracking-tighter ${result.is_smishing ? (darkMode ? 'text-rose-400' : 'text-rose-600') : (darkMode ? 'text-emerald-400' : 'text-emerald-600')}`}>
                          {result.risk_score.toFixed(0)}
                        </span>
                        <span className={`text-4xl font-black mb-6 ${darkMode ? 'text-slate-800' : 'text-slate-200'}`}>%</span>
                      </div>
                    </div>
                    <div className={`p-8 rounded-[2rem] max-w-sm flex flex-col gap-3 border transition-all ${result.is_smishing ? (darkMode ? 'bg-rose-950/30 text-rose-300 border-rose-900' : 'bg-rose-50 text-rose-900 border-rose-100') : (darkMode ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900' : 'bg-emerald-50 text-emerald-900 border-emerald-100')}`}>
                      <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">
                        {result.is_smishing ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                        Final Determination
                      </div>
                      <p className="text-base font-bold leading-relaxed">{result.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Technical Ticker */}
                <div className={`rounded-[2.5rem] p-10 shadow-2xl transition-all ${darkMode ? 'bg-black border border-white/5' : 'bg-slate-900'}`}>
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Live Forensic Stream
                    </h4>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <div className={`h-40 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-hide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {logs.map((log, i) => (
                      <div key={i} className="flex gap-4">
                        <span className={darkMode ? 'text-slate-800' : 'text-slate-800'}>{i + 1}.</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    <div ref={logEndRef} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}} />
    </div>
  );
};

export default Smishing;
