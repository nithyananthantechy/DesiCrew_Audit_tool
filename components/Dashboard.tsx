
import React from 'react';
import { User, Evidence, DMAXReport, AuditStatus, Role } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';
import { STATUS_COLORS } from '../constants';
import { AlertTriangle, ChevronRight, FileText } from 'lucide-react';

interface DashboardProps {
  user: User;
  evidence: Evidence[];
  dmax: DMAXReport[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, evidence, dmax }) => {
  const currentMonth = "January"; // Keeping consistent with the app's current context
  const hasSubmittedDmax = dmax.some(r => r.userId === user.id && r.month === currentMonth);
  
  const myEvidence = user.role === Role.MANAGER 
    ? evidence.filter(e => e.department === user.department)
    : evidence.filter(e => e.userId === user.id);

  const stats = [
    { label: 'Total Audits', value: myEvidence.length, color: 'bg-blue-600' },
    { label: 'Approved', value: myEvidence.filter(e => e.status === AuditStatus.MANAGER_APPROVED || e.status === AuditStatus.FINAL_AUDIT_COMPLETED).length, color: 'bg-emerald-600' },
    { label: 'Pending Review', value: myEvidence.filter(e => e.status === AuditStatus.SUBMITTED).length, color: 'bg-amber-500' },
    { label: 'Rejected', value: myEvidence.filter(e => e.status === AuditStatus.REJECTED).length, color: 'bg-red-500' },
  ];

  const pieData = [
    { name: 'Approved', value: stats[1].value },
    { name: 'Pending', value: stats[2].value },
    { name: 'Rejected', value: stats[3].value },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name}</h1>
          <p className="text-slate-500">Department: {user.department} • Role: {user.role}</p>
        </div>
        {user.role !== Role.CEO_CGO && user.role !== Role.SUPER_ADMIN && !hasSubmittedDmax && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-bounce-subtle">
            <div className="bg-amber-500 text-white p-2 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-amber-900">Pending Action: {currentMonth} DMAX Report</p>
              <p className="text-xs text-amber-700">Your monthly progress report is due. Please submit it to avoid compliance flags.</p>
            </div>
            <button className="bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-amber-600 transition-all">
              Submit Now <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-300 transition-all">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-slate-900">{stat.value}</span>
              <div className={`${stat.color} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm`}>
                Live
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Recent Evidence Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-3 font-bold text-slate-400 text-[10px] uppercase tracking-widest">Audit Task</th>
                  <th className="pb-3 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-center">Date</th>
                  <th className="pb-3 font-bold text-slate-400 text-[10px] uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myEvidence.slice(-5).reverse().map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <p className="text-sm font-bold text-slate-900">Task #{e.checklistItemId.toUpperCase()}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[200px] mt-0.5 italic">"{e.comment}"</p>
                    </td>
                    <td className="py-4 text-xs font-medium text-slate-500 text-center">{e.submissionDate}</td>
                    <td className="py-4 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myEvidence.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-slate-400">
                      <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="text-slate-300" size={24} />
                      </div>
                      <p className="text-sm font-medium">No activity found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest self-start mb-6">Compliance Mix</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 w-full text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">System Refreshed: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
