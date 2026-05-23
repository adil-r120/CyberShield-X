import React from 'react';
import { Cpu, Database, Activity, CheckCircle2 } from 'lucide-react';

const SystemDiagnostics = () => {
  const diagnostics = [
    { name: 'Neural Core v2.4', status: 'Optimal', icon: <Cpu className="w-4 h-4 text-blue-500" />, value: '99.2% Acc' },
    { name: 'Vector Database', status: 'Connected', icon: <Database className="w-4 h-4 text-indigo-500" />, value: '14ms Latency' },
    { name: 'Heuristic Engine', status: 'Active', icon: <Activity className="w-4 h-4 text-emerald-500" />, value: '4.2M S/sec' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">System Diagnostics</h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded text-[10px] font-black text-emerald-500 uppercase tracking-widest">
          <CheckCircle2 className="w-3 h-3" />
          Verified
        </span>
      </div>

      <div className="space-y-4">
        {diagnostics.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-white/5 group hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-[10px] text-slate-500 font-medium">{item.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900 dark:text-white">{item.value}</p>
              <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>System Uptime</span>
          <span className="text-slate-900 dark:text-white">14d 02h 44m</span>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostics;
