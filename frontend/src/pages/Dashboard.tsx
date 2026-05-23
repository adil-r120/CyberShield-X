import React, { useState, useEffect } from 'react';
import API from '../services/api';
import StatCard from '../components/StatCard';
import { AttackDistribution, RiskTrend, DailyComparison } from '../components/Charts';
import QuickScan from '../components/QuickScan';
import ThreatMap from '../components/ThreatMap';
import { ThreatTicker } from '../components/ThreatTicker';
import { Search, ShieldCheck, ShieldAlert, Activity, Globe } from 'lucide-react';

interface DashboardProps {
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ darkMode }) => {
  const [stats, setStats] = useState<any>({
    total_scans: 0,
    phishing_count: 0,
    safe_count: 0,
    average_risk_score: 0,
    trends: { volume: '0%', phishing: '0%', safe: '0%', risk: '0%' }
  });
  const [system, setSystem] = useState<any>({
    load: 2,
    nodes: 0,
    uptime: '99.9%',
    neural_status: 'Synchronized'
  });
  const [distribution, setDistribution] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, systemRes, distRes, analyticsRes] = await Promise.all([
          API.get('/api/dashboard-stats').catch(() => ({ data: null })),
          API.get('/api/system-status').catch(() => ({ data: null })),
          API.get('/api/attack-distribution').catch(() => ({ data: [] })),
          API.get('/api/analytics').catch(() => ({ data: [] }))
        ]);

        if (statsRes?.data) setStats(statsRes.data);
        if (systemRes?.data) setSystem(systemRes.data);
        if (distRes?.data) setDistribution(distRes.data);
        if (analyticsRes?.data) setAnalytics(analyticsRes.data);

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin"></div>
          <Activity className="absolute inset-0 m-auto w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Synchronizing System Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 relative">
      <div className={`fixed inset-0 mesh-gradient opacity-30 -z-10 ${darkMode ? 'opacity-20' : 'opacity-10'}`}></div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className={`text-4xl font-black tracking-tighter ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dashboard Overview</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg shadow-sm shadow-emerald-500/10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleTimeString()} UTC</span>
          </div>
        </div>
        <div className={`flex items-center gap-4 text-[10px] font-bold px-4 py-2 rounded-2xl border transition-all ${darkMode
          ? 'bg-slate-900/50 border-white/5 text-slate-400'
          : 'bg-white border-slate-100 text-slate-500 shadow-sm'
          }`}>
          <div className="flex items-center gap-2">
            <Activity className={`w-3.5 h-3.5 ${system.load > 70 ? 'text-red-500' : 'text-blue-500'}`} />
            <span>Load: {system.load}%</span>
          </div>
          <div className="w-px h-3 bg-slate-500/20"></div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <span>Active Nodes: {system.nodes}</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Scans"
          value={stats?.total_scans ?? 0}
          icon={Search}
          color="bg-blue-600"
          trend={stats?.trends?.volume || '0%'}
        />
        <StatCard
          title="Threats Blocked"
          value={stats?.phishing_count ?? 0}
          icon={ShieldAlert}
          color="bg-red-500"
          trend={stats?.trends?.phishing || '0%'}
        />
        <StatCard
          title="Verified Assets"
          value={stats?.safe_count ?? 0}
          icon={ShieldCheck}
          color="bg-emerald-500"
          trend={stats?.trends?.safe || '0%'}
        />
        <StatCard
          title="Neural Risk Index"
          value={`${stats?.average_risk_score ?? 0}%`}
          icon={Activity}
          color="bg-amber-500"
          trend={stats?.trends?.risk || '0%'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className={`border rounded-[2.5rem] p-1 shadow-sm transition-all hover:shadow-xl ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
              <DailyComparison
                data={analytics}
                title="Diagnostic Audit"
                subtitle="Phishing vs Safe correlation."
              />
            </div>
          </div>
          <ThreatMap />
        </div>

        <div className="space-y-8 flex flex-col">
          <QuickScan darkMode={darkMode} />
          <div className={`border rounded-[3rem] p-8 shadow-sm flex-1 transition-all hover:shadow-xl ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
            <AttackDistribution
              data={distribution}
              title="Threat Vectors"
              subtitle="Heuristic distribution map."
            />
          </div>
        </div>
      </div>

      <div className="-mx-8 -mb-8 mt-12">
        <ThreatTicker darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Dashboard;
