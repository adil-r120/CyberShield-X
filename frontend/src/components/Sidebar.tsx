import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  History,
  BarChart3,
  FileText,
  ShieldAlert,
  MessageSquare,
  Search,
  Settings,
  User,
  Activity
} from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ darkMode }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'SMS Guard', path: '/smishing' },
    { icon: Search, label: 'URL Guard', path: '/scanner' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: History, label: 'Audit Logs', path: '/history' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className={`w-72 h-full flex flex-col transition-all duration-200 border-r ${darkMode ? 'bg-[#050505] border-white/5' : 'bg-white border-slate-100'}`}>

      {/* Premium Logo Section */}
      <div className="p-8 pb-12">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-500">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-30 animate-pulse"></div>
            <img src="/logo.png" alt="CyberShield X" className="relative z-10 w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`text-xl font-black tracking-tighter uppercase leading-none ${darkMode ? 'text-white' : 'text-slate-900'}`}>CyberShield</span>
              <span className="text-xl font-black tracking-tighter uppercase leading-none text-blue-600">X</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500 mt-1">Intelligence Division</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive
                ? (darkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20')
                : (darkMode ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
              }
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-xs font-black uppercase tracking-[0.1em]">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
