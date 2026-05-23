import React, { useEffect, useState } from 'react';

interface Ping {
  id: number;
  x: number;
  y: number;
  type: 'critical' | 'warning' | 'neutral';
  country: string;
  threatType: string;
  ip: string;
}

const ThreatMap = () => {
  const [pings, setPings] = useState<Ping[]>([]);
  const [hoveredPing, setHoveredPing] = useState<number | null>(null);

  const locations = [
    { country: 'RUSSIA', types: ['BOTNET ORIGIN', 'BRUTE FORCE', 'PHISHING HUB'] },
    { country: 'USA', types: ['SPOOFED DOMAIN', 'MALWARE DROPPER', 'SQL INJECTION'] },
    { country: 'CHINA', types: ['DDoS SOURCE', 'DATA EXFILTRATION', 'SCANNER BOT'] },
    { country: 'UK', types: ['SOCIAL ENG.', 'CREDENTIAL THEFT', 'PROXY NODE'] },
    { country: 'INDIA', types: ['SPAM NETWORK', 'API EXPLOIT', 'RELAY NODE'] },
    { country: 'GERMANY', types: ['TOR EXIT NODE', 'MALICIOUS SCRIPT', 'C2 SERVER'] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const typeRoll = Math.random();

      const newPing: Ping = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        type: typeRoll > 0.8 ? 'critical' : (typeRoll > 0.4 ? 'warning' : 'neutral'),
        country: location.country,
        threatType: location.types[Math.floor(Math.random() * location.types.length)],
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      };

      setPings(prev => [...prev.slice(-12), newPing]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[450px] bg-white dark:bg-[#050505] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm transition-all duration-700">
      {/* Map Header */}
      <div className="absolute top-8 left-8 z-30">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">Intelligence Command</h3>
        </div>
        <p className="text-[9px] text-slate-500 font-black mt-2 uppercase tracking-[0.2em] opacity-60">Global Threat Origins Detected</p>
      </div>

      {/* Grid Overlay - High Fidelity */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 opacity-10 dark:opacity-[0.03] pointer-events-none z-10">
        {[...Array(96)].map((_, i) => (
          <div key={i} className="border-[0.5px] border-slate-400 dark:border-white"></div>
        ))}
      </div>

      {/* World Map SVG Wrapper - Abstract Stylized */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 dark:opacity-[0.05] pointer-events-none z-0">
        <svg viewBox="0 0 800 400" className="w-full h-full max-w-5xl scale-125">
          <path
            fill="currentColor"
            className="text-blue-600"
            d="M150,150 L160,140 L180,145 L200,130 L220,135 L240,120 L260,125 L280,110 L300,115 L320,100 L340,105 L360,90 L380,95 L400,80 L420,85 L440,70 L460,75 L480,60 L500,65 L520,50 L540,55 L560,40 L580,45 L600,30 L620,35 L640,20 L660,25 L680,10 L700,15 L720,0 L740,5 L760,-10 L780,-5 L800,-20 V400 H0 V150 Z"
          />
        </svg>
      </div>

      {/* Trajectory Lines (Simulated to center) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {pings.map(ping => (
          <line
            key={`line-${ping.id}`}
            x1={`${ping.x}%`}
            y1={`${ping.y}%`}
            x2="50%"
            y2="50%"
            stroke={ping.type === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.1)'}
            strokeWidth="1"
            strokeDasharray="4 4"
            className="animate-in fade-in duration-1000"
          />
        ))}
      </svg>

      {/* Pulsing Pings with Intelligence Labels */}
      <div className="relative w-full h-full z-20">
        {pings.map(ping => (
          <div
            key={ping.id}
            className="absolute transition-all duration-1000 animate-in zoom-in-50 fade-in"
            style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
            onMouseEnter={() => setHoveredPing(ping.id)}
            onMouseLeave={() => setHoveredPing(null)}
          >
            {/* Ping Core */}
            <div className="relative flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-crosshair">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-40 ${ping.type === 'critical' ? 'bg-red-500' : (ping.type === 'warning' ? 'bg-amber-400' : 'bg-blue-400')
                }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 m-auto shadow-lg shadow-black/50 ${ping.type === 'critical' ? 'bg-red-500' : (ping.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500')
                }`}></span>
            </div>

            {/* Intelligence Auto-Label */}
            <div className={`absolute left-4 top-0 -translate-y-1/2 flex flex-col gap-0.5 transition-all duration-300 ${hoveredPing === ping.id ? 'scale-110' : 'scale-100'
              }`}>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-black tracking-tighter uppercase px-1.5 py-0.5 rounded-sm shadow-sm ${ping.type === 'critical'
                    ? 'bg-red-500 text-white'
                    : (ping.type === 'warning' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white')
                  }`}>
                  {ping.country}
                </span>
                <span className={`text-[8px] font-bold uppercase tracking-widest whitespace-nowrap opacity-70 ${darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                  {ping.threatType}
                </span>
              </div>

              {/* Detailed HUD on Hover */}
              <div className={`overflow-hidden transition-all duration-500 ${hoveredPing === ping.id ? 'max-h-10 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col">
                  <span className="text-[7px] font-mono text-blue-500 font-bold uppercase tracking-widest">Source IP: {ping.ip}</span>
                  <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest">Status: Intercepting...</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-8 flex items-center gap-6 z-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Critical Threat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Neutralized</span>
        </div>
      </div>
    </div>
  );
};

// Simple darkMode check for internal text styles
const darkMode = true;

export default ThreatMap;
