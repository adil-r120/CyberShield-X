import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 p-6 rounded-3xl flex flex-col gap-4 shadow-sm hover:border-blue-500/50 transition-all group overflow-hidden relative">
      <div className="flex items-center justify-between relative z-10">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{title}</span>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${color}`}></div>
    </div>
  );
};

export default StatCard;
