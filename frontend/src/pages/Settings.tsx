import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Zap,
  Save,
  Database,
  Lock
} from 'lucide-react';

interface SettingsProps {
  darkMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ darkMode }) => {
  const [intensity, setIntensity] = useState('Standard');
  const [autoBlock, setAutoBlock] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [retention, setRetention] = useState('30 Days');
  const [mfa, setMfa] = useState(false);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div>
        <h1 className={`text-4xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          <SettingsIcon className="w-8 h-8 text-blue-500" />
          Platform Configuration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium uppercase text-[10px] tracking-widest">System Hardening & Neural Tuning • v2.4.0-Stable</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Security Preferences */}
        <div className={`relative pt-12 pb-10 px-10 rounded-[2.5rem] ring-1 transition-all ${darkMode ? 'bg-black ring-white/10' : 'bg-white ring-slate-200 shadow-sm'
          }`}>
          <div className={`absolute -top-3 left-10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-all ${darkMode ? 'bg-black border-white/10 text-blue-400' : 'bg-white border-slate-200 text-blue-600'
            }`}>
            Security Preferences
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Neural Scan Intensity</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Adjust depth of heuristic analysis</p>
              </div>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/5">
                {['Low', 'Standard', 'Forensic'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setIntensity(mode)}
                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${intensity === mode
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Autonomous Vector Blocking</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Automatically neutralize high-risk threats</p>
              </div>
              <button
                onClick={() => setAutoBlock(!autoBlock)}
                className={`w-14 h-7 rounded-full transition-all relative ${autoBlock ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${autoBlock ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Intelligence Feed Settings */}
        <div className={`relative pt-12 pb-10 px-10 rounded-[2.5rem] ring-1 transition-all ${darkMode ? 'bg-black ring-white/10' : 'bg-white ring-slate-200 shadow-sm'
          }`}>
          <div className={`absolute -top-3 left-10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-all ${darkMode ? 'bg-black border-white/10 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600'
            }`}>
            Intelligence Alerts
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Critical Threat Notifications</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Real-time alerts for high-risk vectors</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-7 rounded-full transition-all relative ${notifications ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notifications ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Heuristic Feedback Loop</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Contribute anonymous threat patterns</p>
              </div>
              <button className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/5 transition-all">
                Active Protocol
              </button>
            </div>
          </div>
        </div>

        {/* Forensic Data Retention */}
        <div className={`relative pt-12 pb-10 px-10 rounded-[2.5rem] ring-1 transition-all ${darkMode ? 'bg-black ring-white/10' : 'bg-white ring-slate-200 shadow-sm'
          }`}>
          <div className={`absolute -top-3 left-10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-all ${darkMode ? 'bg-black border-white/10 text-orange-400' : 'bg-white border-slate-200 text-orange-600'
            }`}>
            Data Retention HUD
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Log Persistence Cycle</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Retention period for forensic packet data</p>
              </div>
              <select
                value={retention}
                onChange={(e) => setRetention(e.target.value)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${darkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
              >
                <option>7 Days</option>
                <option>30 Days</option>
                <option>90 Days</option>
                <option>Indefinite</option>
              </select>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                <Database className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Storage Optimization</p>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5">Automated purging active for expired forensic nodes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Hardening */}
        <div className={`relative pt-12 pb-10 px-10 rounded-[2.5rem] ring-1 transition-all ${darkMode ? 'bg-black ring-white/10' : 'bg-white ring-slate-200 shadow-sm'
          }`}>
          <div className={`absolute -top-3 left-10 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-all ${darkMode ? 'bg-black border-white/10 text-indigo-400' : 'bg-white border-slate-200 text-indigo-600'
            }`}>
            Session Security
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Multi-Factor Authentication</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Enforce biometric or TOTP secondary layer</p>
              </div>
              <button
                onClick={() => setMfa(!mfa)}
                className={`w-14 h-7 rounded-full transition-all relative ${mfa ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${mfa ? 'left-8' : 'left-1'}`}></div>
              </button>
            </div>

            <div className={`flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5`}>
              <div>
                <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Automatic Session Void</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Force logout after 15 minutes of inactivity</p>
              </div>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-10">
        <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/30 transition-all active:scale-95 group">
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Commit Forensic Profiles
        </button>
      </div>
    </div>
  );
};

export default Settings;
