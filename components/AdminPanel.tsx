
import React, { useState } from 'react';
import { User, DMAXReport, Role, Department, ActivityLog, ActivityType } from '../types';
import { 
  UserCog, UserPlus, ShieldAlert, Activity, BellRing, Mail, CheckCircle2, 
  Search, Filter, X, Save, Power, PowerOff, ListRestart, History, 
  ArrowRightCircle, Clock, Info, AlertTriangle, CheckCircle 
} from 'lucide-react';

interface AdminPanelProps {
  dmax: DMAXReport[];
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  activities: ActivityLog[];
  user: User;
  logActivity: (user: User, action: ActivityType, description: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ dmax, users, setUsers, activities, user, logActivity }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');
  const [reminderSent, setReminderSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.CONTRIBUTOR,
    department: Department.OPERATIONS,
    isActive: true
  });

  const currentMonth = "January";

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      logActivity(user, ActivityType.STATUS_CHANGE, `Updated profile/role for: ${formData.name}`);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setUsers(prev => [...prev, newUser]);
      logActivity(user, ActivityType.SYSTEM, `Provisioned new user: ${formData.name} as ${formData.role}`);
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Governance Console</h1>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold border ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>User Directory</button>
          <button onClick={() => setActiveTab('activity')} className={`px-4 py-2 rounded-xl text-xs font-bold border ${activeTab === 'activity' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500'}`}>Audit Trail</button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Access Control & Provisioning</h2>
            <button onClick={() => { setEditingUser(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-2">
              <UserPlus size={14} /> Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${u.role.includes('Auditor') ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{u.department}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => { setEditingUser(u); setFormData({...u}); setIsModalOpen(true); }} className="text-blue-600 hover:underline font-bold text-xs">Edit Access</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 italic">Audit Log functionality is retained for system records.</div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold">{editingUser ? 'Modify Permissions' : 'New User Setup'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">System Role</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none font-bold text-slate-900"
                >
                  {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 italic">Selecting Auditor roles enables specialized review dashboards.</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as Department})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm">
                  {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 shadow-lg">Commit User Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
