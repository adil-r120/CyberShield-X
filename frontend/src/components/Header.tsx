import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  UserCircle, 
  ChevronDown,
  ShieldCheck,
  LogOut,
  Shield,
  Fingerprint,
  Settings,
  AlertTriangle,
  Loader2,
  Check,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

interface ThreatNotification {
  id: number;
  url: string;
  result: string;
  risk_score: number;
  created_at: string;
}

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const READ_NOTIFICATIONS_KEY = 'cybershield_read_notifications';

const loadReadIds = (): Set<number> => {
  try {
    const raw = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return new Set(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    return new Set();
  }
};

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ThreatNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(loadReadIds);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const persistReadIds = (ids: Set<number>) => {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([...ids]));
    setReadIds(new Set(ids));
  };

  const markAsRead = (id: number) => {
    const next = new Set(readIds);
    next.add(id);
    persistReadIds(next);
  };

  const markAllAsRead = () => {
    const next = new Set(readIds);
    notifications.forEach((n) => next.add(n.id));
    persistReadIds(next);
  };

  const isUnread = (id: number) => !readIds.has(id);
  const unreadCount = notifications.filter((n) => isUnread(n.id)).length;
  const unreadThreatCount = notifications.filter(
    (n) => isUnread(n.id) && n.result !== 'Safe'
  ).length;

  const fetchNotifications = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      const res = await API.get('/api/recent-audits', { params: { limit: 8 } });
      const items: ThreatNotification[] = (res.data ?? []).map((audit: ThreatNotification) => ({
        id: audit.id,
        url: audit.url,
        result: audit.result,
        risk_score: audit.risk_score,
        created_at: audit.created_at,
      }));
      setNotifications(items);
    } catch {
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const toggleNotifications = () => {
    setIsNotificationsOpen((open) => {
      const next = !open;
      if (next) {
        setIsDropdownOpen(false);
        fetchNotifications();
      }
      return next;
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`px-8 py-4 flex items-center justify-between border-b transition-all duration-200 relative z-50 ${
      darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'
    }`}>
      {/* Search / Context Bar */}
      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all ${
          darkMode ? 'bg-slate-950 border-white/5 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-blue-600/50'
        }`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Global Search..." 
            className="bg-transparent border-none outline-none text-xs font-bold w-64 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Action Center */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
            darkMode ? 'bg-slate-900 border-white/10 text-amber-400' : 'bg-slate-50 border-slate-200 text-blue-600'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={toggleNotifications}
            aria-label="Threat notifications"
            aria-expanded={isNotificationsOpen}
            className={`relative p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
              isNotificationsOpen
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-500'
                : darkMode
                  ? 'bg-slate-900 border-white/10 text-slate-400 hover:bg-blue-600/10'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-50'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadThreatCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white dark:border-black">
                {unreadThreatCount > 9 ? '9+' : unreadThreatCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div
              className={`absolute right-0 mt-4 w-80 rounded-[2rem] border shadow-2xl z-[60] animate-in fade-in slide-in-from-top-4 duration-200 ${
                darkMode ? 'bg-black border-white/10 shadow-black' : 'bg-white border-slate-100 shadow-slate-200'
              }`}
            >
              <div className="p-5 border-b border-white/5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Threat Alerts
                  </h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black uppercase">
                        {unreadCount} unread
                      </span>
                    )}
                    {notifications.length > 0 && unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                          darkMode
                            ? 'text-blue-400 hover:bg-white/10'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto p-3 space-y-2">
                {notificationsLoading ? (
                  <div className="flex items-center justify-center py-10 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="py-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    No scan activity yet
                  </p>
                ) : (
                  notifications.map((item) => {
                    const read = readIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border transition-all ${
                          read ? 'opacity-50' : ''
                        } ${
                          item.result === 'Safe'
                            ? darkMode
                              ? 'bg-white/5 border-white/5'
                              : 'bg-slate-50 border-slate-100'
                            : darkMode
                              ? 'bg-red-500/5 border-red-500/20'
                              : 'bg-red-50 border-red-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              item.result === 'Safe'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : item.result === 'Suspicious'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {item.result === 'Safe' ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <AlertTriangle className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <Link
                            to="/scanner"
                            onClick={() => setIsNotificationsOpen(false)}
                            className="min-w-0 flex-1"
                          >
                            <p className={`text-[10px] font-black uppercase tracking-wider truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {item.url}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span
                                className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                                  item.result === 'Safe'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : item.result === 'Suspicious'
                                      ? 'bg-amber-500/10 text-amber-600'
                                      : 'bg-red-500/10 text-red-500'
                                }`}
                              >
                                {item.result}
                              </span>
                              <span className="text-[8px] font-bold text-slate-500">
                                {new Date(item.created_at).toLocaleTimeString(undefined, {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </Link>
                          {!read && (
                            <button
                              type="button"
                              onClick={() => markAsRead(item.id)}
                              title="Mark as read"
                              className={`shrink-0 p-1.5 rounded-lg transition-all ${
                                darkMode
                                  ? 'text-slate-500 hover:text-blue-400 hover:bg-white/10'
                                  : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-3 border-t border-white/5">
                <Link
                  to="/history"
                  onClick={() => setIsNotificationsOpen(false)}
                  className={`block text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    darkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  View all audit logs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(false);
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`flex items-center gap-3 pl-6 border-l group transition-all hover:opacity-80 ${darkMode ? 'border-white/10' : 'border-slate-100'}`}
          >
            <div className="text-right hidden sm:block">
              <p className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'User'}</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{user?.role || 'ADMIN'}</p>
            </div>
            <div className="relative">
               <div className={`p-1 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-lg shadow-blue-500/20 transition-transform ${isDropdownOpen ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-black flex items-center justify-center overflow-hidden">
                     <UserCircle className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-slate-900'}`} />
                  </div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-black rounded-full shadow-sm"></div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className={`
              absolute right-0 mt-4 w-72 rounded-[2rem] border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4
              ${darkMode ? 'bg-black border-white/10 shadow-black' : 'bg-white border-slate-100 shadow-slate-200'}
            `}>
              <div className="p-6 space-y-6">
                {/* User Identity Section */}
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                      <Fingerprint className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest">{user?.name || 'Identity Verified'}</h4>
                      <p className="text-[10px] font-bold text-slate-500 truncate w-32 uppercase">{user?.email || 'officer@cybershield.x'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Security Tier</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-600/10 border border-blue-600/20">
                      <Shield className="w-2.5 h-2.5 text-blue-500" />
                      <span className="text-[8px] font-black text-blue-500 uppercase">{user?.role || 'L5 ADMIN'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${darkMode ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
                  >
                    <UserCircle className="w-4 h-4" />
                    Personnel Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest ${darkMode ? 'hover:bg-white/5 text-slate-400 hover:text-white' : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'}`}
                  >
                    <Settings className="w-4 h-4" />
                    System Settings
                  </Link>
                </div>

                {/* Sign Out Action */}
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
