
import React, { useState } from 'react';
/* Fix: Added User and ActivityType to the imports */
import { Evidence, DMAXReport, AuditStatus, Department, Role, User, ActivityType } from '../types';
import { STATUS_COLORS } from '../constants';
import { Download, Filter, ShieldCheck, CheckCircle, Clock, FileText, ChevronDown, ListChecks, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CEOViewProps {
  evidence: Evidence[];
  dmax: DMAXReport[];
  setEvidence: React.Dispatch<React.SetStateAction<Evidence[]>>;
  setDmax: React.Dispatch<React.SetStateAction<DMAXReport[]>>;
  user: User;
  logActivity: (user: User, action: ActivityType, description: string) => void;
}

const CEOView: React.FC<CEOViewProps> = ({ evidence, dmax, setEvidence, setDmax, user, logActivity }) => {
  const [filterDept, setFilterDept] = useState<Department | 'All'>('All');
  const [activeReportTab, setActiveReportTab] = useState<'evidence' | 'dmax'>('evidence');

  if (user.role !== Role.EXTERNAL_AUDITOR && user.role !== Role.SUPER_ADMIN) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Permission Denied</h2>
        <p className="text-slate-500 max-w-sm mt-2">Only External Auditors (CGO/CEO) have authority for final corporate compliance certification.</p>
      </div>
    );
  }

  const filteredEvidence = filterDept === 'All' ? evidence : evidence.filter(e => e.department === filterDept);
  const filteredDmax = filterDept === 'All' ? dmax : dmax.filter(d => d.department === filterDept);
  
  const handleFinalAuditEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => e.id === id ? { ...e, status: AuditStatus.FINAL_AUDIT_COMPLETED } : e));
    logActivity(user, ActivityType.APPROVAL, `External Auditor performed final sign-off for checklist item ID: ${id}`);
  };

  const handleFinalAuditDmax = (id: string) => {
    setDmax(prev => prev.map(d => d.id === id ? { ...d, status: AuditStatus.FINAL_AUDIT_COMPLETED } : d));
    logActivity(user, ActivityType.APPROVAL, `External Auditor certified DMAX report ID: ${id}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Compliance Sign-off
          </h1>
          <p className="text-sm text-slate-500 mt-1">External Auditor review and corporate certification dashboard.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all">
          <Download size={18} /> Export Compliance Ledger
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button onClick={() => setActiveReportTab('evidence')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReportTab === 'evidence' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <ListChecks size={14} /> Checklist Audits
             </button>
             <button onClick={() => setActiveReportTab('dmax')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReportTab === 'dmax' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
                <FileText size={14} /> DMAX Reports
             </button>
          </div>
          <div className="flex gap-2">
            {['All', ...Object.values(Department)].map(d => (
              <button key={d} onClick={() => setFilterDept(d as any)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${filterDept === d ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Internal Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Final Certification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeReportTab === 'evidence' ? (
                filteredEvidence.filter(e => e.status !== AuditStatus.REJECTED && e.status !== AuditStatus.DRAFT).map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{e.department} Audit #{e.checklistItemId}</p>
                      <p className="text-xs text-slate-500 mt-1">{e.comment}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {e.status === AuditStatus.FINAL_AUDIT_COMPLETED ? (
                        <span className="text-emerald-500 flex items-center justify-center gap-1 font-bold text-xs"><CheckCircle size={14} /> Certified</span>
                      ) : (
                        <button 
                          onClick={() => handleFinalAuditEvidence(e.id)}
                          disabled={e.status !== AuditStatus.MANAGER_APPROVED}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:bg-blue-700 disabled:opacity-20 transition-all shadow-md"
                        >
                          Sign-off
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                filteredDmax.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/30">
                     <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{d.userName} - {d.month}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{d.department}</p>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[d.status]}`}>
                          {d.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-center">
                        {d.status === AuditStatus.FINAL_AUDIT_COMPLETED ? (
                           <span className="text-emerald-500 font-bold text-xs">Certified</span>
                        ) : (
                           <button onClick={() => handleFinalAuditDmax(d.id)} disabled={d.status !== AuditStatus.MANAGER_APPROVED} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:bg-black disabled:opacity-20 transition-all">
                              Certify Report
                           </button>
                        )}
                     </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CEOView;
