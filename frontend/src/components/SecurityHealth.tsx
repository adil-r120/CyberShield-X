import React from 'react';
import { ShieldCheck, Activity, Globe, Zap } from 'lucide-react';

interface SecurityHealthProps {
  score: number;
}

const SecurityHealth: React.FC<SecurityHealthProps> = ({ score }) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/5 glow-border group">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 mesh-gradient opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="space-y-6 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Neural Core v2.4 Live
          </div>
          
          <h2 className="text-5xl font-black tracking-tight leading-tight">
            Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Command</span> Center
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed">
            Real-time heuristic engines are processing global threat vectors. 
            All systems are currently <span className="text-emerald-400 font-bold">Optimal</span> with 0.00% packet loss.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="group/item cursor-default">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Active Nodes</p>
              <div className="flex items-center gap-2 text-xl font-black text-slate-200">
                <Globe className="w-5 h-5 text-blue-500" /> 1,284
              </div>
            </div>
            <div className="group/item cursor-default">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Sync Latency</p>
              <div className="flex items-center gap-2 text-xl font-black text-slate-200">
                <Zap className="w-5 h-5 text-amber-500" /> 14ms
              </div>
            </div>
            <div className="group/item cursor-default">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Threats Blocked</p>
              <div className="flex items-center gap-2 text-xl font-black text-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> 42.8k
              </div>
            </div>
          </div>
        </div>

        <div className="relative animate-float">
          {/* Holographic Ring */}
          <div className="w-56 h-56 flex items-center justify-center relative">
            {/* Background Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-2xl"></div>
            
            <div className="text-center z-10">
              <span className="text-6xl font-black block tracking-tighter">{score}%</span>
              <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-blue-400">Integrity</span>
            </div>
            
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 224 224">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="url(#integrityGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={628.3}
                strokeDashoffset={628.3 - (score / 100) * 628.3}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="integrityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityHealth;
