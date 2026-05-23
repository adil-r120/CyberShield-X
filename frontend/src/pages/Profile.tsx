import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Mail, Briefcase, Building, 
  Save, Edit2, Shield, CheckCircle2, Loader2, Camera
} from 'lucide-react';
import API from '../services/api';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  department: string;
}

const Profile: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@cybershield.x',
    role: 'ADMIN',
    department: 'Cyber Security Operations'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get('/api/profile');
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/api/profile', profile);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header Card */}
      <div className={`relative overflow-hidden border rounded-[3rem] p-12 transition-all duration-500 ${
        darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-blue-600 rotate-12" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-12">
          {/* Avatar Section */}
          <div className="relative group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 p-1 shadow-2xl shadow-blue-500/30">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-16 h-16 text-white opacity-80" />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 p-3 bg-white text-blue-600 rounded-2xl shadow-xl hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter uppercase">{profile.name}</h1>
              <span className="px-4 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-600/30 w-fit self-center md:self-auto">
                {profile.role}
              </span>
            </div>
            <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.3em]">{profile.department}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Neural Identity Verified</span>
            </div>
          </div>

          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={saving}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl ${
              isEditing 
                ? 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-500' 
                : (darkMode ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800')
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />)}
            {isEditing ? 'Save Identity' : 'Modify Profile'}
          </button>
        </div>
      </div>

      {/* Identity Forge (Editable Fields) */}
      <div className={`border rounded-[3rem] p-12 space-y-10 ${
        darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Professional Credentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Name Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2 flex items-center gap-2">
              <UserIcon className="w-3 h-3" /> Full Name
            </label>
            <input 
              type="text"
              disabled={!isEditing}
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className={`w-full p-5 rounded-2xl border transition-all text-sm font-bold ${
                isEditing 
                  ? (darkMode ? 'bg-slate-900 border-blue-500/50 text-white focus:ring-4 ring-blue-500/10' : 'bg-white border-blue-600/30 text-slate-900 focus:ring-4 ring-blue-600/5')
                  : (darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed')
              }`}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2 flex items-center gap-2">
              <Mail className="w-3 h-3" /> Email Link
            </label>
            <input 
              type="email"
              disabled={!isEditing}
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className={`w-full p-5 rounded-2xl border transition-all text-sm font-bold ${
                isEditing 
                  ? (darkMode ? 'bg-slate-900 border-blue-500/50 text-white focus:ring-4 ring-blue-500/10' : 'bg-white border-blue-600/30 text-slate-900 focus:ring-4 ring-blue-600/5')
                  : (darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed')
              }`}
            />
          </div>

          {/* Role Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2 flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Operational Role
            </label>
            <input 
              type="text"
              disabled={!isEditing}
              value={profile.role}
              onChange={(e) => setProfile({...profile, role: e.target.value})}
              className={`w-full p-5 rounded-2xl border transition-all text-sm font-bold ${
                isEditing 
                  ? (darkMode ? 'bg-slate-900 border-blue-500/50 text-white focus:ring-4 ring-blue-500/10' : 'bg-white border-blue-600/30 text-slate-900 focus:ring-4 ring-blue-600/5')
                  : (darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed')
              }`}
            />
          </div>

          {/* Department Field */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2 flex items-center gap-2">
              <Building className="w-3 h-3" /> Strategic Department
            </label>
            <input 
              type="text"
              disabled={!isEditing}
              value={profile.department}
              onChange={(e) => setProfile({...profile, department: e.target.value})}
              className={`w-full p-5 rounded-2xl border transition-all text-sm font-bold ${
                isEditing 
                  ? (darkMode ? 'bg-slate-900 border-blue-500/50 text-white focus:ring-4 ring-blue-500/10' : 'bg-white border-blue-600/30 text-slate-900 focus:ring-4 ring-blue-600/5')
                  : (darkMode ? 'bg-slate-950 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed')
              }`}
            />
          </div>
        </div>
      </div>

      {/* Access Logs / Stats (Decorative/Workable) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Security Level', value: 'Level 4', color: 'text-blue-500' },
          { label: 'Neural Clearance', value: 'RESTRICTED', color: 'text-amber-500' },
          { label: 'Last Login', value: new Date().toLocaleDateString(), color: 'text-slate-500' }
        ].map((stat, i) => (
          <div key={i} className={`p-8 rounded-3xl border ${darkMode ? 'bg-black border-white/5' : 'bg-white border-slate-100'}`}>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
            <p className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
