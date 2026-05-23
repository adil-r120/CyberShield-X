import React from 'react';

interface Scan {
  url: string;
  result: string;
  risk_score: number;
  timestamp: string;
}

interface RecentActivityProps {
  scans: Scan[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ scans }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Security Logs</h3>
        <button className="text-blue-500 text-sm font-bold hover:underline">View All History</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <th className="pb-4 font-bold text-xs uppercase tracking-widest">URL</th>
              <th className="pb-4 font-bold text-xs uppercase tracking-widest">Result</th>
              <th className="pb-4 font-bold text-xs uppercase tracking-widest">Risk Score</th>
              <th className="pb-4 font-bold text-xs uppercase tracking-widest text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {scans.length > 0 ? (
              scans.map((scan, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 font-medium max-w-md truncate pr-4 text-slate-700 dark:text-slate-200 text-sm font-mono">{scan.url}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${
                      scan.result === 'Phishing' 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                      {scan.result}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            scan.risk_score > 70 ? 'bg-red-500' : scan.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${scan.risk_score}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{scan.risk_score}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-400 dark:text-slate-500 text-xs text-right font-medium">
                    {new Date(scan.timestamp).toLocaleString(undefined, { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No scan activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivity;
