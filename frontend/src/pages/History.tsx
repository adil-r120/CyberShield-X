import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { 
  Search, Filter, ChevronLeft, ChevronRight, Download, 
  ShieldAlert, ShieldCheck, Clock, Eye, Trash2, X, ExternalLink, Zap,
  Activity, Shield, FileText, AlertTriangle
} from 'lucide-react';

interface HistoryProps {
  darkMode: boolean;
}

const History: React.FC<HistoryProps> = ({ darkMode }) => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const limit = 10;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/history', {
        params: {
          limit,
          offset: page * limit,
          result: filter || undefined,
          search: search || undefined
        }
      });
      setScans(response.data.scans);
      setTotal(response.data.total);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, filter, search]);

  const purgeFullArchive = async () => {
    if (!window.confirm("CRITICAL: Purge entire forensic archive? This will remove ALL incident records.")) return;
    try {
      await API.delete('/api/purge-all');
      fetchHistory();
    } catch (err) {
      console.error("Purge failed", err);
    }
  };

  const formatForensicTime = (isoString: string) => {
    if (!isoString) return 'LEGACY_LOG';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'ARCHIVE_LEGACY_LOG';
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).toUpperCase() + ' UTC';
  };

  const exportToCSV = () => {
    const headers = ['URL', 'Verdict', 'Risk Score', 'Timestamp'];
    const rows = scans.map(s => [s.url, s.result, s.risk_score, s.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "cybershield_audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const deleteRecord = async (id: number) => {
    if (!window.confirm("Are you sure you want to purge this record from the archive?")) return;
    try {
      await API.delete(`/api/history/${id}`);
      setSelectedCase(null);
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const handleReScan = (url: string) => {
    navigate('/scanner', { state: { scanUrl: url } });
  };

  const stats = [
    { label: 'Total Audits', value: total, icon: FileText, color: 'text-blue-500' },
    { label: 'Threats Neutralized', value: scans.filter(s => s.result === 'Phishing').length, icon: Shield, color: 'text-red-500' },
    { label: 'Avg Risk Index', value: `${total > 0 ? Math.round(scans.reduce((acc, s) => acc + s.risk_score, 0) / scans.length) : 0}%`, icon: Activity, color: 'text-amber-500' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Stats HUD */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className={`text-4xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              <Clock className="w-8 h-8 text-blue-500" />
              Case Archive
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-[0.3em]">Historical Forensic Intelligence Archive</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={purgeFullArchive}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-500 hover:text-white hover:border-red-500 ${
                darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Purge All
            </button>
            <button 
              onClick={exportToCSV}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                darkMode ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" /> Export Ledger
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`p-6 rounded-[2rem] border flex items-center gap-6 shadow-sm ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-slate-100/50'}`}>
              <div className={`p-4 rounded-2xl bg-slate-500/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className={`p-4 rounded-[2rem] border flex flex-col lg:flex-row items-center justify-between gap-6 ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search Archives..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className={`w-full md:w-80 border rounded-xl py-3 pl-12 pr-6 focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-[11px] font-bold tracking-wide transition-all ${
                darkMode ? 'bg-slate-950 border-white/10 text-white placeholder-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>
          
          <div className={`flex items-center border rounded-xl px-4 transition-all ${
            darkMode ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(0); }}
              className="bg-transparent text-slate-900 dark:text-white py-3 pl-2 pr-4 appearance-none focus:outline-none font-black text-[9px] uppercase tracking-[0.2em]"
            >
              <option value="" className={darkMode ? 'bg-black' : 'bg-white'}>All Records</option>
              <option value="Phishing" className={darkMode ? 'bg-black' : 'bg-white'}>Neutralized</option>
              <option value="Safe" className={darkMode ? 'bg-black' : 'bg-white'}>Authenticated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button
             onClick={() => setPage(p => Math.max(0, p - 1))}
             disabled={page === 0}
             className={`p-2.5 border rounded-xl disabled:opacity-20 transition-all ${darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
           >
             <ChevronLeft className="w-4 h-4" />
           </button>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-4">CASE_PAGE {page + 1}</span>
           <button
             onClick={() => setPage(p => p + 1)}
             disabled={(page + 1) * limit >= total}
             className={`p-2.5 border rounded-xl disabled:opacity-20 transition-all ${darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
           >
             <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Archive Grid */}
      <div className={`border rounded-[3rem] overflow-hidden shadow-2xl transition-all ${
        darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-slate-200/20'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b ${
                darkMode ? 'border-white/5 bg-slate-950/30' : 'border-slate-50 bg-slate-50/50'
              }`}>
                <th className="px-10 py-6">Target Asset</th>
                <th className="px-10 py-6 text-center">Verdict</th>
                <th className="px-10 py-6">Risk Profile</th>
                <th className="px-10 py-6">Incident Timestamp</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className={`px-10 py-10 h-24 ${darkMode ? 'bg-slate-900/10' : 'bg-slate-50/20'}`}></td>
                  </tr>
                ))
              ) : scans.length > 0 ? (
                scans.map((scan, i) => (
                  <tr key={i} className={`group transition-all hover:bg-blue-600/[0.03]`}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl shadow-sm ${scan.result === 'Phishing' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {scan.result === 'Phishing' ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div>
                           <p className={`text-xs font-black truncate max-w-sm transition-colors ${darkMode ? 'text-white' : 'text-slate-900'}`}>{scan.url}</p>
                           <p className="text-[9px] text-slate-500 font-mono mt-1.5 uppercase tracking-widest opacity-60">AUDIT_REF: {scan.id?.toString().slice(-10).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${scan.result === 'Phishing' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        {scan.result}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                          <div className={`w-32 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${scan.risk_score > 70 ? 'bg-red-500' : scan.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${scan.risk_score}%` }}
                             ></div>
                          </div>
                          <span className={`text-[10px] font-black font-mono ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{scan.risk_score}%</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <p className={`text-[10px] font-bold ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                         {formatForensicTime(scan.timestamp).split(' | ')[0] || 'LEGACY_LOG'}
                       </p>
                       <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase tracking-widest opacity-60">
                         {formatForensicTime(scan.timestamp).split(' | ')[1] || '00:00:00 UTC'}
                       </p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedCase(scan)}
                          className={`p-3 rounded-xl transition-all active:scale-90 hover:bg-blue-600 hover:text-white ${
                            darkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleReScan(scan.url)}
                          className={`p-3 rounded-xl transition-all active:scale-90 hover:bg-blue-600 hover:text-white ${
                            darkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-10 py-40 text-center">
                    <Activity className={`w-16 h-16 mx-auto mb-6 opacity-10 ${darkMode ? 'text-white' : 'text-black'}`} />
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">No Forensic Logs Found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Intelligence Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white/10 dark:bg-black/80 backdrop-blur-2xl animate-in fade-in duration-500">
           <div className={`w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border relative transform transition-all animate-in zoom-in-95 ${
             darkMode ? 'bg-black border-white/10' : 'bg-white border-slate-200'
           }`}>
              <div className="absolute top-10 right-10 flex gap-3 z-50">
                <button 
                  onClick={() => deleteRecord(selectedCase.id)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className={`p-3 rounded-xl transition-all ${
                    darkMode ? 'bg-slate-900 text-slate-500 hover:bg-red-500 hover:text-white' : 'bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-16 relative">
                 <div className="absolute inset-0 mesh-gradient opacity-[0.03] pointer-events-none"></div>
                 
                 <div className="relative z-10 flex flex-col lg:flex-row gap-16">
                    {/* Left: Identity Card */}
                    <div className="lg:w-1/3 space-y-10">
                       <div className="flex flex-col items-center text-center space-y-6">
                          <div className={`p-10 rounded-[3rem] shadow-2xl ${selectedCase.result === 'Phishing' ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-emerald-500 text-white shadow-emerald-500/30'}`}>
                             {selectedCase.result === 'Phishing' ? <ShieldAlert className="w-16 h-16" /> : <ShieldCheck className="w-16 h-16" />}
                          </div>
                          <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Verdict Status</h3>
                            <h2 className={`text-4xl font-black mt-2 uppercase tracking-tighter ${selectedCase.result === 'Phishing' ? 'text-red-500' : 'text-emerald-500'}`}>{selectedCase.result}</h2>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Neural Risk Index</p>
                             <p className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCase.risk_score}%</p>
                          </div>
                          <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">Neural Timestamp</p>
                             <p className={`text-[10px] font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{formatForensicTime(selectedCase.timestamp)}</p>
                          </div>
                       </div>
                    </div>

                    {/* Right: Forensic Details */}
                    <div className="lg:w-2/3 space-y-10">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Forensic Investigation</p>
                          <h2 className={`text-2xl font-black mt-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Evidence Log #{selectedCase.id?.toString().slice(-8).toUpperCase()}</h2>
                       </div>

                       <div className={`p-8 rounded-[2rem] border ${darkMode ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-3 mb-4">
                             <Activity className="w-4 h-4 text-blue-500" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Asset Analysis</span>
                          </div>
                          <p className={`text-sm font-mono break-all font-bold leading-relaxed ${darkMode ? 'text-blue-400' : 'text-slate-600'}`}>{selectedCase.url}</p>
                       </div>

                       <div className="pt-6 flex gap-4">
                          <button 
                             onClick={exportToCSV}
                             className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 shadow-2xl shadow-blue-500/40 transition-all flex items-center justify-center gap-3"
                          >
                             <Download className="w-5 h-5" /> Download Evidence File
                          </button>
                          <button 
                             onClick={() => handleReScan(selectedCase.url)}
                             className={`px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 ${
                               darkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                             }`}
                          >
                             <Zap className="w-5 h-5" /> Re-Scan
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default History;
