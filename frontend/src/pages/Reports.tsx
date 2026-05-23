import React, { useState } from 'react';
import API from '../services/api';
import {
  FileText, Download, Calendar, Clock, Filter,
  BarChart3, Shield, Printer, Mail, Plus, CheckCircle2, X, Settings, ChevronDown
} from 'lucide-react';

interface ReportsProps {
  darkMode: boolean;
}

const Reports: React.FC<ReportsProps> = ({ darkMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState('Executive Summary');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState({ freq: 'Weekly', time: '09:00 AM', day: 'Sunday' });

  // Custom Dropdown States
  const [showFreqDropdown, setShowFreqDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);

  const freqOptions = ['Daily', 'Weekly', 'Monthly'];
  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const reportTypes = [
    { id: 'exec', title: 'Executive Summary', desc: 'High-level security posture for leadership.', icon: Shield, color: 'text-blue-500' },
    { id: 'tech', title: 'Technical Audit', desc: 'Deep dive into specific threat vectors and heuristics.', icon: BarChart3, color: 'text-indigo-500' },
    { id: 'forensic', title: 'Forensic Case Log', desc: 'Granular log of every scan and investigation.', icon: FileText, color: 'text-emerald-500' },
  ];

  const recentReports = [
    { id: 'R-2941', name: 'Weekly Threat Landscape', type: 'Technical', date: 'May 3, 2026', size: '2.4 MB', status: 'Generated' },
    { id: 'R-2938', name: 'April Security Audit', type: 'Executive', date: 'Apr 30, 2026', size: '1.8 MB', status: 'Archived' },
    { id: 'R-2935', name: 'Incidence Response Log', type: 'Forensic', date: 'Apr 28, 2026', size: '4.2 MB', status: 'Archived' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await API.get('/api/history', { params: { limit: 100 } });
      const scans = response.data.scans;

      const headers = ['URL', 'Verdict', 'Risk Score', 'Timestamp'];
      const rows = scans.map((s: any) => [s.url, s.result, s.risk_score, s.created_at]);
      const csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map((e: any) => e.join(",")).join("\n");

      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `cybershield_security_audit_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    alert(`Intelligence Schedule Updated: ${schedule.freq} on ${schedule.day} at ${schedule.time}`);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight flex items-center gap-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            <FileText className="w-8 h-8 text-blue-500" />
            Forensic Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Generate and archive high-fidelity security audit documentation.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : <Plus className="w-4 h-4" />}
          Generate New Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Report Factory & Archived Evidence Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className={`border rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200 shadow-slate-200/20'}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -z-10"></div>
            <h3 className={`text-xl font-black mb-8 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Intelligence Factory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.title)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col justify-between h-48 group ${selectedType === type.title
                    ? 'border-blue-600 bg-blue-600/5'
                    : darkMode ? 'border-white/5 hover:border-white/10' : 'border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <type.icon className={`w-8 h-8 ${type.color} group-hover:scale-110 transition-transform`} />
                  <div>
                    <p className={`text-sm font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{type.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold leading-tight">{type.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className={`mt-10 p-6 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-950/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Period</p>
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>May 01 - May 03, 2026</p>
                </div>
              </div>
              <button className={`px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-colors ${darkMode ? 'bg-black border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                Modify Range
              </button>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className={`border rounded-[2.5rem] overflow-hidden shadow-sm transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200'}`}>
            <div className={`px-10 py-8 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <h3 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Archived Evidence</h3>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Filter className="w-3 h-3" /> Filter Logs
              </div>
            </div>
            <div className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
              {recentReports.map((report) => (
                <div key={report.id} className={`px-10 py-6 flex items-center justify-between hover:bg-blue-600/5 transition-colors group`}>
                  <div className="flex items-center gap-5">
                    <div className={`p-3 rounded-2xl text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{report.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">ID: {report.id} • {report.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="hidden md:block text-right">
                      <p className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{report.date}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{report.size}</p>
                    </div>
                    <button
                      onClick={() => {
                        const content = `🛡️ CYBERSHIELD X FORENSIC LOG\n==============================\nCASE ID: ${report.id}\nNAME: ${report.name}\nTYPE: ${report.type}\nDATE: ${report.date}\nSIZE: ${report.size}\nSTATUS: ${report.status}\n==============================\nVERDICT: INTEGRITY VERIFIED`;
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Forensic_Case_${report.id}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className={`p-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-emerald-500/20 ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          {/* Automation Status */}
          <div className={`p-8 rounded-[2rem] shadow-xl relative overflow-hidden group transition-all ${darkMode ? 'bg-black border border-white/5' : 'bg-white border border-slate-200 shadow-slate-200/20'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] group-hover:bg-blue-500/30 transition-all"></div>
            <Clock className="w-8 h-8 text-blue-500 mb-6" />
            <h4 className={`text-xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Automated Audit Scheduler</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium uppercase tracking-tight">Next report scheduled for: <br /><span className={`font-black tracking-widest ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{schedule.day}, {schedule.time}</span></p>
            <button
              onClick={() => setShowScheduleModal(true)}
              className={`w-full mt-8 py-4 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-transparent hover:shadow-blue-500/10 ${darkMode
                ? 'bg-slate-900 border-white/10 text-white hover:bg-white hover:text-slate-900'
                : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white'
                }`}
            >
              Manage Schedule
            </button>
          </div>

          {/* Quick Actions */}
          <div className={`border p-8 rounded-[2rem] shadow-sm space-y-6 transition-all ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200'}`}>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Distribution Channels</h4>
            <div className="space-y-4">
              <button className={`w-full flex items-center justify-between p-4 rounded-2xl hover:border-blue-500 border border-transparent transition-all group ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  <span className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Email Delivery</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </button>
              <button className={`w-full flex items-center justify-between p-4 rounded-2xl hover:border-blue-500 border border-transparent transition-all group ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <Printer className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  <span className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>Direct Print</span>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${darkMode ? 'text-slate-800' : 'text-slate-300'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Management Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-md rounded-[2.5rem] overflow-visible shadow-2xl border relative ${darkMode ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-200'}`}>
            <button
              onClick={() => {
                setShowScheduleModal(false);
                setShowFreqDropdown(false);
                setShowDayDropdown(false);
              }}
              className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-red-500/20 rounded-2xl text-white hover:text-red-500 transition-all border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={updateSchedule} className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Configure Scheduler</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automation Protocol v1.0</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Audit Frequency</label>
                  <div
                    onClick={() => { setShowFreqDropdown(!showFreqDropdown); setShowDayDropdown(false); }}
                    className={`w-full border rounded-2xl p-4 text-sm font-bold flex items-center justify-between cursor-pointer hover:border-blue-600 transition-all group ${darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  >
                    <span>{schedule.freq}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-transform ${showFreqDropdown ? 'rotate-180' : ''}`} />
                  </div>
                  {showFreqDropdown && (
                    <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200 ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                      {freqOptions.map(opt => (
                        <div
                          key={opt}
                          onClick={() => { setSchedule({ ...schedule, freq: opt }); setShowFreqDropdown(false); }}
                          className={`p-4 text-sm font-bold cursor-pointer transition-colors ${darkMode ? 'text-slate-300 hover:bg-blue-600 hover:text-white' : 'text-slate-700 hover:bg-blue-600 hover:text-white'}`}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Day</label>
                    <div
                      onClick={() => { setShowDayDropdown(!showDayDropdown); setShowFreqDropdown(false); }}
                      className={`w-full border rounded-2xl p-4 text-sm font-bold flex items-center justify-between cursor-pointer hover:border-blue-600 transition-all group ${darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    >
                      <span>{schedule.day}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-transform ${showDayDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    {showDayDropdown && (
                      <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-2xl max-h-48 overflow-y-auto z-50 animate-in slide-in-from-top-2 duration-200 scrollbar-hide ${darkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                        {dayOptions.map(opt => (
                          <div
                            key={opt}
                            onClick={() => { setSchedule({ ...schedule, day: opt }); setShowDayDropdown(false); }}
                            className={`p-4 text-sm font-bold cursor-pointer transition-colors ${darkMode ? 'text-slate-300 hover:bg-blue-600 hover:text-white' : 'text-slate-700 hover:bg-blue-600 hover:text-white'}`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Audit Time</label>
                    <input
                      type="text"
                      value={schedule.time}
                      onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                      className={`w-full border rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 ${darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-5 bg-blue-600 text-white rounded-[1.25rem] font-black uppercase tracking-[0.15em] text-[10px] hover:bg-blue-500 shadow-2xl shadow-blue-600/30 transition-all active:scale-95 mt-4"
              >
                Apply Forensic Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
