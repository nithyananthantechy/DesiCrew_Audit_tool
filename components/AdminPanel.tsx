
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
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: Role.CONTRIBUTOR,
    department: Department.PRODUCTION,
    isActive: true
  });

  const currentMonth = "January";

  const submissionDefaulters = users.filter(user => {
    if (user.role === Role.SUPER_ADMIN || user.role === Role.CEO_CGO) return false;
    const hasRecord = dmax.some(r => r.userId === user.id && r.month === currentMonth);
    return !hasRecord && user.isActive;
  });

  const handleSendReminders = () => {
    setReminderSent(true);
    setTimeout(() => {
      setReminderSent(false);
      logActivity(user, ActivityType.SYSTEM, `Triggered bulk reminders for ${submissionDefaulters.length} compliance defaulters.`);
      alert(`${submissionDefaulters.length} auto-reminders have been dispatched via email and portal notification.`);
    }, 2000);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: Role.CONTRIBUTOR,
      department: Department.PRODUCTION,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (targetUser: User) => {
    setEditingUser(targetUser);
    setFormData({
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      department: targetUser.department,
      isActive: targetUser.isActive
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      logActivity(user, ActivityType.STATUS_CHANGE, `Updated details for user: ${formData.name}`);
    } else {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setUsers(prev => [...prev, newUser]);
      logActivity(user, ActivityType.SYSTEM, `Created new system user: ${formData.name} in ${formData.department}`);
    }
    setIsModalOpen(false);
  };

  const toggleUserStatus = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
      logActivity(user, ActivityType.STATUS_CHANGE, `Account for ${target.name} ${target.isActive ? 'disabled' : 'enabled'}.`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivities = activities.filter(a => 
    a.userName.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
    a.description.toLowerCase().includes(activitySearchTerm.toLowerCase()) ||
    a.action.toLowerCase().includes(activitySearchTerm.toLowerCase())
  );

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.LOGIN: return <ArrowRightCircle size={16} className="text-blue-500" />;
      case ActivityType.SUBMISSION: return <History size={16} className="text-purple-500" />;
      case ActivityType.APPROVAL: return <CheckCircle size={16} className="text-emerald-500" />;
      case ActivityType.REJECTION: return <AlertTriangle size={16} className="text-red-500" />;
      case ActivityType.STATUS_CHANGE: return <Activity size={16} className="text-orange-500" />;
      case ActivityType.PROFILE_UPDATE: return <UserCog size={16} className="text-indigo-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Super Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">System configuration and compliance monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeTab === 'users' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            User Directory
          </button>
          <button 
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeTab === 'activity' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><UserCog size={18}/></div>
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Users</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900">{users.filter(u => u.isActive).length}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Global headcount</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><ShieldAlert size={18}/></div>
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Actions</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900">{activities.length}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium text-emerald-600 flex items-center gap-1">
                 <CheckCircle2 size={12} /> Logged actions
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity size={18}/></div>
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Health</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900">99.9%</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Uptime monitoring</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ring-2 ring-amber-100 ring-offset-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><BellRing size={18}/></div>
                <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DMAX Delinquency</h2>
              </div>
              <p className="text-3xl font-bold text-slate-900">{submissionDefaulters.length}</p>
              <p className="text-xs text-slate-500 mt-1 font-bold text-amber-600 uppercase tracking-tight">Pending for {currentMonth}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Compliance Defaulters</h2>
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tight">Jan 2024</span>
              </div>
              
              <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[320px] pr-2 scrollbar-thin">
                {submissionDefaulters.length === 0 ? (
                  <div className="py-12 text-center bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-800">100% DMAX Compliance!</p>
                  </div>
                ) : (
                  submissionDefaulters.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-200">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{u.department}</p>
                        </div>
                      </div>
                      <Mail size={14} className="text-slate-300" />
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={handleSendReminders}
                disabled={submissionDefaulters.length === 0 || reminderSent}
                className="w-full mt-auto bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-20 active:scale-95"
              >
                {reminderSent ? (
                  <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     Sending...
                  </div>
                ) : (
                  <>
                    <BellRing size={16} /> Send Auto-Reminders
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h2 className="text-sm font-bold text-slate-700 uppercase tracking-tight">User Directory & Permissions</h2>
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                          type="text" 
                          placeholder="Search users..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 w-48 text-slate-900"
                       />
                    </div>
                    <button 
                      onClick={openAddModal}
                      className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-md"
                    >
                      <UserPlus size={16} />
                    </button>
                 </div>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-3">Employee Details</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">System Role</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs font-bold text-slate-600">{u.department}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-tight border border-blue-100">{u.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                            <span className="text-[10px] font-bold uppercase text-slate-500">{u.isActive ? 'Active' : 'Disabled'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => openEditModal(u)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-bold"
                            >
                              Manage
                            </button>
                            <button 
                              onClick={() => toggleUserStatus(u.id)}
                              className={`${u.isActive ? 'text-orange-600' : 'text-emerald-600'} text-xs font-bold`}
                            >
                              {u.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
               <History size={18} className="text-blue-600" />
               Corporate Audit Trail (System Logs)
             </h2>
             <div className="flex items-center gap-3">
                <div className="relative">
                   <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="text" 
                      placeholder="Search logs by action or user..." 
                      value={activitySearchTerm}
                      onChange={(e) => setActivitySearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 w-64 text-slate-900"
                   />
                </div>
                <button 
                  onClick={() => setActivitySearchTerm('')}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                >
                  <ListRestart size={18} />
                </button>
             </div>
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">System User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Activity Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 font-medium italic">
                      No system activities found matching search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={12} />
                          <span className="text-[11px] font-medium">{log.timestamp}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                            {log.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{log.userName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{log.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getActivityIcon(log.action)}
                          <span className="text-[11px] font-bold text-slate-700">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-slate-600 leading-relaxed max-w-md italic">
                          "{log.description}"
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              End of System Audit Log - Showing last {filteredActivities.length} entries
            </p>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">{editingUser ? 'Manage Employee' : 'Add New Employee'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900"
                  placeholder="Enter employee full name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Corporate Email</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900"
                  placeholder="name@desicrew.in"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Department</label>
                  <select 
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value as Department})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900"
                  >
                    {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">System Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none text-slate-900"
                  >
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                >
                  {formData.isActive ? <Power size={14} /> : <PowerOff size={14} />}
                  Account {formData.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  <Save size={18} /> {editingUser ? 'Update User' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
