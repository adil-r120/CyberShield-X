import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ComposedChart, Line
} from 'recharts';
import { Search } from 'lucide-react';

interface ChartProps {
  data: any[];
  title: string;
  subtitle: string;
}

export const AttackDistribution: React.FC<ChartProps> = ({ data, title, subtitle }) => {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);
  const displayData = hasData ? data : [{ name: 'Neutral', value: 1, percentage: 0 }];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest opacity-60">{subtitle}</p>
      </div>

      <div className="flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={hasData ? 8 : 0}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1200}
            >
              {displayData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    !hasData ? 'rgba(148, 163, 184, 0.05)' :
                      entry.name === 'Phishing' ? '#ef4444' : '#10b981'
                  }
                  className="transition-all duration-700 cursor-pointer"
                />
              ))}
            </Pie>
            {hasData && (
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
                }}
                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {!hasData ? (
            <div className="flex flex-col items-center animate-pulse">
              <Search className="w-6 h-6 text-slate-300 dark:text-slate-800 mb-2" />
              <span className="text-[8px] uppercase font-black text-slate-400 tracking-[0.4em]">Calibrating</span>
            </div>
          ) : (
            <>
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-[0.4em] mb-1">Audit Density</span>
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {data.reduce((acc, curr) => acc + curr.value, 0)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        {hasData ? data.map((d, i) => (
          <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-white/5 transition-all hover:border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${d.name === 'Phishing' ? 'bg-red-500 shadow-lg shadow-red-500/40' : 'bg-emerald-500 shadow-lg shadow-emerald-500/40'}`}></div>
              <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">{d.name}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-xl font-black text-slate-900 dark:text-white">{d.percentage}%</span>
            </div>
          </div>
        )) : (
          <div className="col-span-2 p-6 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50/30 dark:bg-transparent">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed">Intelligence HUD online.<br />Perform a scan to map threat vectors.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const RiskTrend: React.FC<ChartProps> = ({ data, title, subtitle }) => {
  return (
    <div className="p-10 h-full flex flex-col">
      <div className="mb-10">
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">{subtitle}</p>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} interval={0} />
            <YAxis stroke="#94a3b8" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
            />
            <Area
              type="monotone"
              dataKey="total_scans"
              stroke="#3b82f6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorScans)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const DailyComparison: React.FC<ChartProps> = ({ data, title, subtitle }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="p-12 h-full flex flex-col">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{title}</h3>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em] opacity-70 mt-1">{subtitle}</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-sm"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Phishing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Safe</span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={hasData ? data : [{ date: 'NO DATA', phishing: 0, safe: 0, total_scans: 0 }]}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.1)" vertical={true} />
            <XAxis dataKey="date" stroke="#475569" fontSize={8} fontWeight="900" tickLine={false} axisLine={false} padding={{ left: 20, right: 20 }} interval={0} />
            <YAxis stroke="#475569" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
            <RechartsTooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const p_val = payload.find(p => p.dataKey === 'phishing')?.value || 0;
                  const s_val = payload.find(p => p.dataKey === 'safe')?.value || 0;
                  const total = (p_val as number) + (s_val as number);
                  const riskRatio = total > 0 ? Math.round(((p_val as number) / total) * 100) : 0;

                  return (
                    <div className="bg-slate-900/95 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">{label} AUDIT</p>
                      <div className="space-y-2">
                        <div className="flex justify-between gap-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Phishing</span>
                          <span className="text-[10px] font-black text-red-400">{p_val}</span>
                        </div>
                        <div className="flex justify-between gap-8">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Safe</span>
                          <span className="text-[10px] font-black text-emerald-400">{s_val}</span>
                        </div>
                        <div className="pt-2 border-t border-white/5 mt-2">
                          <div className="flex justify-between gap-8">
                            <span className="text-[10px] font-black text-white uppercase">Risk Level</span>
                            <span className={`text-[10px] font-black ${riskRatio > 50 ? 'text-red-500' : 'text-blue-500'}`}>{riskRatio}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="phishing" stackId="a" fill="#ef4444" barSize={32} />
            <Bar dataKey="safe" stackId="a" fill="#10b981" barSize={32} radius={[8, 8, 0, 0]} />
            <Line type="monotone" dataKey="total_scans" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', stroke: '#fff' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
