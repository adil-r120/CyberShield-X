import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Search, Loader2, Shield, ShieldCheck, AlertCircle,
  Zap, Fingerprint, AlertTriangle, Info, Terminal, RotateCcw, Trash2
} from 'lucide-react';
import API from '../services/api';
import RiskMeter from '../components/RiskMeter';

interface ScannerProps {
  darkMode: boolean;
}

interface ForensicEvidence {
  code: string;
  title: string;
  desc: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

const Scanner: React.FC<ScannerProps> = ({ darkMode }) => {
  const location = useLocation();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [recentAudits, setRecentAudits] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'raw'>('logs');

  useEffect(() => {
    if (location.state?.scanUrl) {
      setUrl(location.state.scanUrl);
    }
    fetchRecentAudits();
  }, [location.state]);

  const scanSteps = [
    'Initializing Neural Core...',
    'Extracting URL Heuristics...',
    'Verifying SSL Integrity...',
    'Analyzing Domain Reputation...',
    'Consulting Forensic Model...'
  ];

  const fetchRecentAudits = async () => {
    try {
      const res = await API.get('/api/recent-audits?limit=8');
      setRecentAudits(res.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setRecentAudits([]);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    for (let i = 0; i < scanSteps.length; i++) {
      setScanStep(scanSteps[i]);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const res = await API.post('/api/scan-url', { url });
      if (res.data.error) {
        setError(res.data.error);
        setResult(null);
      } else {
        setResult(res.data);
        fetchRecentAudits();
      }
    } catch (err) {
      setError("Forensic engine offline. Check neural link.");
    } finally {
      setLoading(false);
      setScanStep('');
    }
  };

  const handleDeleteAudit = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Purge this forensic record? This cannot be undone.")) return;

    try {
      await API.delete(`/api/delete-scan/${id}`);
      setRecentAudits(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  const defangUrl = (input: string) => {
    if (!input) return 'N/A';
    return input.replace(/http/g, 'hXXp').replace(/\./g, '[.]');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-20 space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-black tracking-tight uppercase italic ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  URL <span className="text-blue-400">GUARD</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Advanced Neural Link Intelligence</p>
              </div>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] pl-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Neural Forensics Engine</p>
          </div>
        </div>

        {/* Search Bar Area */}
        <div className="relative z-10">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
                <Zap className="absolute inset-0 m-auto w-10 h-10 text-blue-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-blue-500 font-mono text-xl tracking-[0.3em] uppercase animate-pulse">{scanStep}</p>
                <p className="text-slate-500 text-[10px] mt-4 font-black uppercase tracking-[0.6em]">Neural Synchronization Active</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleScan} className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className={`flex items-center gap-6 p-6 rounded-[3rem] border transition-all duration-500 ${darkMode ? 'bg-black border-white/5 focus-within:border-blue-500/50 shadow-2xl' : 'bg-white border-slate-100 focus-within:border-blue-600/30 shadow-2xl shadow-slate-200/50'}`}>
                  <Search className={`w-8 h-8 ml-4 transition-colors ${darkMode ? 'text-slate-700 group-focus-within:text-blue-500' : 'text-slate-300 group-focus-within:text-blue-600'}`} />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL for Deep Forensic Audit..."
                    className="flex-1 bg-transparent border-none outline-none text-lg font-bold placeholder:text-slate-400"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading || !url}
                      className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-600/30 active:scale-95 disabled:opacity-50 flex items-center gap-4"
                    >
                      <Zap className="w-5 h-5 fill-white" />
                      Scan URL
                    </button>
                    {result && (
                      <button
                        type="button"
                        onClick={() => { setUrl(''); setResult(null); setError(''); }}
                        className={`p-5 rounded-[1.5rem] border transition-all active:rotate-180 hover:bg-blue-500/10 hover:border-blue-500/30 ${darkMode ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-white border-slate-200 text-slate-400'}`}
                        title="Clear Forensic Data"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                {error && (
                  <div className="max-w-3xl mx-auto mt-6 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Result Area */}
        {result && !loading && (
          <div className="space-y-10 animate-in zoom-in-95 duration-700">
            {/* Verdict Ribbon */}
            <div className={`p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl ${result.result === 'Safe' ? 'bg-emerald-500/5 border-emerald-500/20' :
              result.result === 'Suspicious' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/5 border-red-500/20'
              }`}>
              <div className="flex items-center gap-8">
                <div className={`p-6 rounded-[2rem] shadow-2xl ${result.result === 'Safe' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                  result.result === 'Suspicious' ? 'bg-amber-500 text-white shadow-amber-500/30' :
                    'bg-red-500 text-white shadow-red-500/30'
                  }`}>
                  {result.result === 'Safe' ? <ShieldCheck className="w-10 h-10" /> : <Shield className="w-10 h-10" />}
                </div>
                <div>
                  <h2 className={`text-3xl font-black uppercase tracking-tighter ${result.result === 'Safe' ? 'text-emerald-500' :
                    result.result === 'Suspicious' ? 'text-amber-500' :
                      'text-red-500'
                    }`}>
                    {result.result === 'Safe' ? 'AUTHENTICATED' :
                      result.result === 'Suspicious' ? 'SUSPICIOUS ACTIVITY' :
                        'THREAT NEUTRALIZED'}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Certainty: {result.confidence}%</p>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Status: <span className={result.features?.is_live ? 'text-emerald-500' : 'text-red-500'}>
                        {result.features?.is_live ? 'HOST REACHABLE' : 'HOST OFFLINE'}
                      </span>
                    </p>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] truncate max-w-sm">{defangUrl(result.url)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const reportContent = `
============================================================
           🛡️ CYBERSHIELD X: FORENSIC DOSSIER 🛡️
============================================================
REPORT ID: ${Math.random().toString(36).substring(2, 15).toUpperCase()}
TIMESTAMP: ${new Date().toLocaleString()}
AUDIT URL: ${result.url}
VERDICT  : ${result.result.toUpperCase()}
RISK LVL : ${result.risk_score}%
CERTAINTY: ${result.confidence}%

------------------------------------------------------------
[1] NEURAL SUMMARY
------------------------------------------------------------
The CyberShield Neural Core has classified this asset as ${result.result.toUpperCase()}. 
Detection probability is indexed at ${result.risk_score}%, resulting in an 
overall certainty rating of ${result.confidence}%.

------------------------------------------------------------
[2] FORENSIC EVIDENCE LOGS
------------------------------------------------------------
${result.explanation?.length > 0
                      ? result.explanation.map((e: any) => `• [${e.severity}] ${e.title}: ${e.desc}`).join('\n')
                      : 'NO MALICIOUS PATTERNS DETECTED. INTEGRITY VERIFIED.'}

------------------------------------------------------------
[3] TECHNICAL HEURISTICS (RAW)
------------------------------------------------------------
• URL Length      : ${result.features?.url_length} chars
• Dot Count       : ${result.features?.dot_count}
• Special Chars   : ${result.features?.special_chars}
• SSL/HTTPS       : ${result.features?.has_https ? 'ACTIVE' : 'INACTIVE'}
• IP-Based        : ${result.features?.has_ip ? 'YES' : 'NO'}
• Subdomain Layers: ${result.features?.subdomain_count}
• Brand Similarity: ${(result.features?.similarity_score * 100).toFixed(1)}%
• Domain Age      : ${result.features?.domain_age_days} Days

============================================================
      END OF REPORT | SECURED BY CYBERSHIELD X
============================================================
`;
                  const blob = new Blob([reportContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Forensic_Dossier_${result.url.replace(/[^a-z0-9]/gi, '_')}.txt`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all hover:scale-105 active:scale-95 ${darkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black'}`}
              >
                Export Case
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* Risk Profile Card */}
              <div className={`border rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-10 shadow-sm ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Neural Risk Index</h3>
                  <RiskMeter score={result.risk_score} />
                </div>
                <div className="w-full space-y-4 pt-10 border-t border-slate-100 dark:border-white/5">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Risk</span>
                    <span className="text-xs font-black text-blue-500">{result.risk_score > 50 ? 'HIGH' : 'LOW'}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visual Spoof</span>
                    <span className="text-xs font-black text-blue-500">{result.risk_score > 70 ? 'DETECTED' : 'CLEAN'}</span>
                  </div>
                </div>
              </div>

              {/* Forensic Explanation Center */}
              <div className={`xl:col-span-2 border rounded-[3rem] p-12 space-y-12 shadow-sm ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl">
                    <button
                      onClick={() => setActiveTab('logs')}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? (darkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl') : 'text-slate-500'}`}
                    >
                      Forensic Logs
                    </button>
                    <button
                      onClick={() => setActiveTab('raw')}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'raw' ? (darkMode ? 'bg-white text-black' : 'bg-black text-white shadow-xl') : 'text-slate-500'}`}
                    >
                      Intelligence Breakdown
                    </button>
                  </div>
                </div>

                {activeTab === 'logs' ? (
                  <div className="grid grid-cols-1 gap-6">
                    {result.explanation?.map((item: ForensicEvidence, i: number) => (
                      <div key={i} className={`p-8 rounded-[2rem] border group transition-all hover:translate-x-2 ${item.severity === 'Critical' ? 'bg-red-500/[0.03] border-red-500/20' :
                        item.severity === 'High' ? 'bg-amber-500/[0.03] border-amber-500/20' :
                          'bg-blue-500/[0.03] border-blue-500/20'
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {item.severity === 'Critical' ? <AlertCircle className="w-5 h-5 text-red-500" /> : <Info className="w-5 h-5 text-blue-500" />}
                            <span className={`text-sm font-black uppercase tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                          </div>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${item.severity === 'Critical' ? 'bg-red-500 text-white' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                            {item.severity}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    ))}

                    {(!result.explanation || result.explanation.length === 0) && (
                      <div className={`p-12 rounded-[2.5rem] border flex flex-col items-center text-center gap-6 ${result.result === 'Safe'
                        ? (darkMode ? 'bg-emerald-500/[0.03] border-emerald-500/20' : 'bg-emerald-500/[0.02] border-emerald-500/10')
                        : (darkMode ? 'bg-red-500/[0.03] border-red-500/20' : 'bg-red-500/[0.02] border-red-500/10')
                        }`}>
                        {result.result === 'Safe' ? (
                          <>
                            <ShieldCheck className="w-16 h-16 text-emerald-500" />
                            <div className="max-w-md">
                              <h4 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Integrity Verified</h4>
                              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wide">No malicious patterns identified in the current neural slice. The asset is classified as authenticated.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-16 h-16 text-red-500" />
                            <div className="max-w-md">
                              <h4 className={`text-xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Security Breach Detected</h4>
                              <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-wide">Structural anomalies detected by the neural core. Evidence points towards a high-probability phishing or spoofing signature.</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(result.features || {}).map(([key, value]) => (
                      <div key={key} className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <p className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {typeof value === 'number' && (key.includes('score') || key.includes('certainty')) ? `${(value * 100).toFixed(0)}%` : (value as any)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Scans Archive */}
        <div className="space-y-10 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recent Forensic Audits</h3>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Global Intelligence History</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentAudits?.map((audit, i) => (
              <div
                key={i}
                onClick={() => setUrl(audit.url)}
                className={`group cursor-pointer border rounded-[2.5rem] p-8 transition-all hover:scale-[1.03] active:scale-95 shadow-sm relative ${darkMode
                  ? 'bg-black border-white/5 hover:border-blue-500/30'
                  : 'bg-white border-slate-100 hover:border-blue-600/30 shadow-slate-200/20'
                  }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-2.5 h-2.5 rounded-full ${audit.result === 'Safe' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'}`}></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{new Date(audit.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={(e) => handleDeleteAudit(e, audit.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
                      title="Purge Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className={`text-xs font-black truncate mb-6 transition-colors ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>{audit.url}</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter ${audit.result === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {audit.result}
                  </span>
                  <p className="text-[10px] font-black text-slate-400">{audit.risk_score}% RISK</p>
                </div>
              </div>
            ))}

            {(!recentAudits || recentAudits.length === 0) && (
              <div className="col-span-full py-20 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem]">
                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">No forensic history found. Initialize your first scan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
