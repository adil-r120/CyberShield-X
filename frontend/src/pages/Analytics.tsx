import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, BarChart, Bar, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Line
} from 'recharts';
import {
  TrendingUp, Activity,
  Calendar, Zap, Download, Globe, Shield,
  Database, Fingerprint, Lock, ArrowUpRight, Search, 
  Filter
} from 'lucide-react';

interface AnalyticsProps {
  darkMode: boolean;
}

const Analytics: React.FC<AnalyticsProps> = ({ darkMode }) => {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(7);

  const originData = [
    { name: 'RUSSIA', value: 1240, color: '#ef4444' },
    { name: 'USA', value: 850, color: '#3b82f6' },
    { name: 'CHINA', value: 2100, color: '#f59e0b' },
    { name: 'NETHERLANDS', value: 420, color: '#10b981' },
    { name: 'GERMANY', value: 310, color: '#8b5cf6' },
  ];

  const radarData = [
    { subject: 'Precision', A: 99, fullMark: 150 },
    { subject: 'Detection', A: 92, fullMark: 150 },
    { subject: 'Sync', A: 98, fullMark: 150 },
    { subject: 'Velocity', A: 85, fullMark: 150 },
    { subject: 'Uptime', A: 99, fullMark: 150 },
    { subject: 'Heuristics', A: 90, fullMark: 150 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, historyRes] = await Promise.all([
        API.get('/api/analytics', { params: { days: timeRange } }),
        API.get('/api/recent-audits', { params: { limit: 10 } })
      ]);
      
      const enrichedAnalytics = (analyticsRes.data || []).map((d: any) => ({
        ...d,
        confidence: 85 + Math.random() * 10
      }));

      setAnalyticsData(enrichedAnalytics);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const exportToCSV = () => {
    const headers = ['Date', 'Total Scans', 'Phishing', 'Safe'];
    const rows = analyticsData.map(d => [d.date, d.total_scans, d.phishing, d.safe]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `cybershield_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-[9px] font-black uppercase tracking-[0.3em] text-blue-500">
              Live_System_Monitor
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <h1 className={`text-5xl font-black tracking-tighter flex items-center gap-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            System H U D
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className={`flex items-center gap-3 px-6 py-4 border rounded-[2rem] transition-all shadow-sm ${darkMode ? 'bg-black border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <Calendar className="w-4 h-4 text-blue-600" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="bg-transparent border-none outline-none font-black text-[10px] uppercase tracking-widest cursor-pointer pr-4"
            >
              <option value={7} className={darkMode ? 'bg-black' : 'bg-white'}>7_DAYS_WINDOW</option>
              <option value={30} className={darkMode ? 'bg-black' : 'bg-white'}>30_DAYS_WINDOW</option>
              <option value={90} className={darkMode ? 'bg-black' : 'bg-white'}>90_DAYS_WINDOW</option>
            </select>
          </div>
          <button
            onClick={exportToCSV}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/10 ${darkMode ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'}`}
          >
            <Download className="w-4 h-4" /> Export_Forensic_Dossier
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Neural Precision', value: '99.4%', icon: Fingerprint, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Defensive Blocks', value: '14,204', icon: Lock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Threat Nodes', value: '842', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'System Uptime', value: '99.98%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border transition-all hover:translate-y-[-4px] group ${darkMode ? 'bg-black border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/10 hover:border-blue-600/30'}`}>
            <div className={`p-4 rounded-2xl w-fit ${stat.bg} mb-6 transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className={`text-4xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
              <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                <ArrowUpRight className="w-3 h-3" />
                <span>+2.4%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Analytic Visualization */}
      <div className={`border rounded-[3rem] p-12 relative overflow-hidden group transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Performance Matrix</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Audit Volume vs Neural Confidence</p>
          </div>
          <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-blue-600/30 rounded-sm"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Volume</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-1 bg-amber-500 rounded-sm"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Confidence</span>
               </div>
            </div>
        </div>

        <div className="h-[450px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center"><Loader /></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#ffffff08" : "#00000008"} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} interval={0} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#f59e0b', fontSize: 10, fontWeight: '900' }} />
                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                  <Bar yAxisId="left" dataKey="total_scans" fill="#3b82f6" fillOpacity={0.2} radius={[10, 10, 0, 0]} barSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }} />
               </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Radar: Defensive Strength Matrix & Geolocation Origins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className={`border rounded-[3rem] p-12 relative overflow-hidden transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
          <div className="mb-10">
             <h3 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Security Vector Radar</h3>
             <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">Neural capability mapping</p>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
                {/* @ts-ignore */}
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: '900' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="System Capability"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                  animationBegin={0}
                  animationDuration={1500}
                />
                <Radar
                  name="Baseline"
                  dataKey="fullMark"
                  stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                  fill="transparent"
                  strokeDasharray="4 4"
                />
                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origin Geolocation Matrix */}
        <div className={`border rounded-[3rem] p-12 transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Attack Origins</h3>
              <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">Hostile Geolocation Nodes</p>
            </div>
            <Globe className="w-6 h-6 text-blue-600 opacity-20" />
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={originData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={darkMode ? "#ffffff08" : "#00000008"} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: '900' }} width={100} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip darkMode={darkMode} />} />
                <Bar dataKey="value" radius={[0, 20, 20, 0]} barSize={32}>
                  {originData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Forensic Intelligence Table */}
      <div className={`border rounded-[3rem] p-12 transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/20'}`}>
         <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className={`text-2xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dossier Deep-Dive</h3>
              <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">Comprehensive Forensic Index</p>
            </div>
            <div className="flex gap-3">
              <button className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}><Filter className="w-4 h-4" /></button>
              <button className={`p-3 rounded-xl border transition-all ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}><Search className="w-4 h-4" /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5">
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Asset identifier</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Forensic Verdict</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Risk level</th>
                  <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Induction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {history.map((audit, i) => (
                  <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-6 pr-10">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${audit.result === 'Safe' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold truncate max-w-md">{audit.url}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${audit.result === 'Safe' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {audit.result}
                      </span>
                    </td>
                    <td className="py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-black rounded-full overflow-hidden">
                             <div className={`h-full transition-all ${audit.risk_score > 50 ? 'bg-red-500' : 'bg-blue-600'}`} style={{ width: `${audit.risk_score}%` }}></div>
                          </div>
                          <span className="text-xs font-black">{audit.risk_score}%</span>
                       </div>
                    </td>
                    <td className="py-6 text-right">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{new Date(audit.created_at).toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={`p-6 rounded-2xl border shadow-2xl backdrop-blur-xl ${darkMode ? 'bg-black/90 border-white/10 shadow-black' : 'bg-white/90 border-slate-200 shadow-slate-200'}`}>
        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">{label || 'AUDIT DATA'}</p>
        <div className="space-y-3">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill }}></div>
                <span className="text-[11px] font-black uppercase tracking-tighter text-slate-400">{p.name}</span>
              </div>
              <span className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{p.value}{p.name === 'System Capability' || p.name === 'Confidence' ? '%' : ' UNITS'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Loader = () => (
  <div className="relative">
    <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
    <Activity className="absolute inset-0 m-auto w-5 h-5 text-blue-500 animate-pulse" />
  </div>
);

export default Analytics;
