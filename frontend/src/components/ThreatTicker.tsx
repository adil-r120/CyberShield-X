import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';

export const ThreatTicker = ({ darkMode }: { darkMode: boolean }) => {
  const threats = [
    { id: 1, url: 'http://auth-paypal-secure.com', risk: '98%', type: 'Credential Theft' },
    { id: 2, url: 'https://bit.ly/secure-login-302', risk: '85%', type: 'Malicious Redirect' },
    { id: 3, url: 'http://192.168.1.105/admin.php', risk: '92%', type: 'Unauthorized Access' },
    { id: 4, url: 'http://invoice-update.zip', risk: '89%', type: 'Trojan Payload' },
    { id: 5, url: 'https://verification-center.xyz', risk: '95%', type: 'Phishing' },
  ];

  return (
    <div className={`relative border-y overflow-hidden whitespace-nowrap transition-colors duration-500 py-3 ${
      darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200'
    }`}>
      {/* Label */}
      <div className={`absolute left-0 top-0 bottom-0 z-20 px-8 flex items-center gap-3 border-r transition-all ${
        darkMode 
        ? 'bg-black border-white/10 shadow-[20px_0_30px_rgba(0,0,0,0.8)]' 
        : 'bg-white border-slate-200 shadow-[20px_0_30px_rgba(255,255,255,1)]'
      }`}>
        <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Live Intelligence Feed</span>
      </div>

      {/* Scrolling Content */}
      <div className="flex animate-marquee gap-12 items-center pl-72">
        {[...threats, ...threats].map((threat, index) => (
          <div key={`${threat.id}-${index}`} className="flex items-center gap-4 group cursor-default">
            <span className="text-[10px] font-mono text-slate-400">{new Date().toLocaleTimeString()}</span>
            <span className={`text-xs font-black transition-colors ${
              darkMode ? 'text-slate-300 group-hover:text-blue-500' : 'text-slate-700 group-hover:text-blue-600'
            }`}>{threat.url}</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 rounded border border-red-500/20 text-[9px] font-black text-red-500 uppercase">
              <Zap className="w-3 h-3" />
              Risk: {threat.risk}
            </span>
            <span className={`text-[10px] uppercase font-black tracking-widest ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>{threat.type}</span>
            <span className={darkMode ? 'text-slate-800' : 'text-slate-200'}>|</span>
          </div>
        ))}
      </div>

      {/* DEFCON Level (Right Side) */}
      <div className={`absolute right-0 top-0 bottom-0 z-20 px-8 flex items-center gap-6 border-l transition-all ${
        darkMode ? 'bg-black border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Threat Level</span>
          <span className={`text-xs font-black uppercase ${darkMode ? 'text-amber-500' : 'text-amber-600'}`}>DEFCON 3 (Elevated)</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`w-1.5 h-3 rounded-sm ${lvl >= 3
                ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                : darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
