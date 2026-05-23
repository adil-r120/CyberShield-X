import React, { useState } from 'react';
import { Search, Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import API from '../services/api';

const QuickScan = ({ darkMode }: { darkMode: boolean }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    try {
      const res = await API.post('/api/scan-url', { url });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative pt-10 pb-10 px-8 rounded-[2rem] ring-1 transition-all duration-500 ${darkMode
        ? 'bg-black ring-white/10'
        : 'bg-white ring-slate-200 shadow-sm'
      }`}>
      <div className={`absolute -top-3 left-8 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-all ${darkMode ? 'bg-black border-white/10 text-blue-400' : 'bg-white border-slate-200 text-blue-600'
        }`}>
        Quick Scan
      </div>

      <form onSubmit={handleScan} className="relative group mt-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste URL..."
          className={`w-full border rounded-xl pl-6 pr-32 py-3.5 text-xs font-bold transition-all ${darkMode
              ? 'bg-slate-950 border-white/10 text-white placeholder-slate-700 focus:ring-blue-500/50'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-blue-600/20'
            }`}
        />
        <button
          disabled={loading || !url}
          className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <Search className="w-3 h-3 group-hover:scale-110 transition-transform text-white" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">SCAN</span>
            </>
          )}
        </button>
      </form>

      {result && (
        <div className={`mt-8 p-6 rounded-[2rem] ring-1 animate-in zoom-in-95 duration-500 ${result.result === 'Phishing'
            ? 'bg-red-500/5 ring-red-500/20 text-red-500'
            : result.result === 'Suspicious'
              ? 'bg-amber-500/5 ring-amber-500/20 text-amber-500'
              : 'bg-emerald-500/5 ring-emerald-500/20 text-emerald-500'
          }`}>
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${result.result === 'Phishing' ? 'bg-red-500 text-white' : result.result === 'Suspicious' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {result.result === 'Phishing' ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            </div>
            <div>
              <span className="font-black text-[10px] uppercase tracking-widest leading-none">{result.result} Verdict</span>
              <p className="text-[9px] opacity-70 font-bold uppercase tracking-widest mt-1">Risk Index: {result.risk_score}%</p>
            </div>
          </div>

          {/* New Forensic Insights */}
          {result.explanation && result.explanation.length > 0 && (
            <div className="mt-4 pt-4 border-t border-current/10 space-y-2">
              {result.explanation.slice(0, 2).map((exp: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-current mt-1"></div>
                  <span className="text-[8px] font-black uppercase tracking-wider">{exp.title} detected</span>
                </div>
              ))}
            </div>
          )}

          {result.features && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-current/[0.03] border border-current/10">
                <span className="block text-[7px] uppercase font-black opacity-40">Domain Age</span>
                <span className="text-[9px] font-black">{result.features.domain_age_days}d</span>
              </div>
              <div className="p-2 rounded-xl bg-current/[0.03] border border-current/10">
                <span className="block text-[7px] uppercase font-black opacity-40">Similarity</span>
                <span className="text-[9px] font-black">{Math.round(result.features.similarity_score * 100)}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!result && (
        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
          <p className="text-[9px] text-slate-400 leading-relaxed font-bold italic uppercase tracking-wider">
            * Neural Engine Active Heuristics.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickScan;
