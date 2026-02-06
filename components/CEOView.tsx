
import React, { useState } from 'react';
import { Evidence, DMAXReport, AuditStatus, Department } from '../types';
import { STATUS_COLORS } from '../constants';
import { Download, Filter, ShieldCheck, CheckCircle, Clock, FileText, ChevronDown, ListChecks } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface CEOViewProps {
  evidence: Evidence[];
  dmax: DMAXReport[];
  setEvidence: React.Dispatch<React.SetStateAction<Evidence[]>>;
  setDmax: React.Dispatch<React.SetStateAction<DMAXReport[]>>;
}

const CEOView: React.FC<CEOViewProps> = ({ evidence, dmax, setEvidence, setDmax }) => {
  const [filterDept, setFilterDept] = useState<Department | 'All'>('All');
  const [activeReportTab, setActiveReportTab] = useState<'evidence' | 'dmax'>('evidence');

  const filteredEvidence = filterDept === 'All' ? evidence : evidence.filter(e => e.department === filterDept);
  const filteredDmax = filterDept === 'All' ? dmax : dmax.filter(d => d.department === filterDept);
  
  const completionByDept = Object.values(Department).map(dept => {
    const deptEvid = evidence.filter(e => e.department === dept);
    const completed = deptEvid.filter(e => e.status === AuditStatus.FINAL_AUDIT_COMPLETED).length;
    return {
      name: dept,
      completed: completed,
      pending: deptEvid.length - completed
    };
  });

  const handleFinalAuditEvidence = (id: string) => {
    setEvidence(prev => prev.map(e => 
      e.id === id ? { ...e, status: AuditStatus.FINAL_AUDIT_COMPLETED } : e
    ));
  };

  const handleFinalAuditDmax = (id: string) => {
    setDmax(prev => prev.map(d => 
      d.id === id ? { ...d, status: AuditStatus.FINAL_AUDIT_COMPLETED } : d
    ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> Executive Compliance View
          </h1>
          <p className="text-sm text-slate-500 mt-1">Global compliance tracking and final corporate audit approval.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all">
          <Download size={18} /> Full Compliance Audit PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Departmental Checklist Stats</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionByDept}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Audit Status Distribution</h2>
          <div className="flex-1 flex items-center justify-center">
             <div className="grid grid-cols-2 gap-8 w-full px-8">
                <div className="text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Evidence Completion</p>
                   <p className="text-3xl font-bold text-slate-900 mt-1">
                      {Math.round((evidence.filter(e => e.status === AuditStatus.FINAL_AUDIT_COMPLETED).length / (evidence.length || 1)) * 100)}%
                   </p>
                </div>
                <div className="text-center border-l border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">DMAX Submission Rate</p>
                   <p className="text-3xl font-bold text-slate-900 mt-1">
                      {Math.round((dmax.length / 42) * 100)}%
                   </p>
                </div>
             </div>
          </div>
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
             <span className="text-xs font-bold text-slate-500">Active Audit Cycle: Q1 2024</span>
             <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase tracking-tight">On Track</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
                onClick={() => setActiveReportTab('evidence')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReportTab === 'evidence' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
             >
                <ListChecks size={14} /> Checklist Audits
             </button>
             <button 
                onClick={() => setActiveReportTab('dmax')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeReportTab === 'dmax' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
             >
                <FileText size={14} /> DMAX Reports
             </button>
          </div>
          <div className="flex gap-2">
            {['All', ...Object.values(Department)].map(d => (
              <button 
                key={d}
                onClick={() => setFilterDept(d as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${filterDept === d ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {activeReportTab === 'evidence' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Task</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditor Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvidence.filter(e => e.status !== AuditStatus.REJECTED && e.status !== AuditStatus.DRAFT).map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/30 group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">Task #{e.checklistItemId.toUpperCase()}</p>
                      <p className="text-[11px] text-slate-500 mt-1 truncate max-w-[240px] italic">"{e.comment}"</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">{e.department}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {e.status === AuditStatus.FINAL_AUDIT_COMPLETED ? (
                        <span className="text-emerald-500 flex items-center justify-center gap-1 font-bold text-xs">
                          <CheckCircle size={14} /> Certified
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleFinalAuditEvidence(e.id)}
                          disabled={e.status !== AuditStatus.MANAGER_APPROVED}
                          className="bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:bg-blue-700 disabled:opacity-20 flex items-center gap-2 mx-auto transition-all shadow-md shadow-blue-500/10"
                        >
                          <ShieldCheck size={14} /> Corporate Sign-off
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredEvidence.length === 0 && (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-medium">No audit evidence found matching selection.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee / Period</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Attachment</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Executive Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {filteredDmax.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50/30">
                         <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900">{d.userName}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{d.month} {d.year} • {d.department}</p>
                         </td>
                         <td className="px-6 py-4">
                            {d.fileName ? (
                               <div className="flex items-center gap-2 text-blue-600 font-bold text-xs cursor-pointer hover:underline">
                                  <Download size={14} /> {d.fileName}
                               </div>
                            ) : (
                               <span className="text-[10px] text-slate-400 font-bold italic">No document attached</span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[d.status]}`}>
                              {d.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            {d.status === AuditStatus.FINAL_AUDIT_COMPLETED ? (
                               <span className="text-emerald-500 font-bold text-xs pr-4">Approved</span>
                            ) : (
                               <button 
                                  onClick={() => handleFinalAuditDmax(d.id)}
                                  disabled={d.status !== AuditStatus.MANAGER_APPROVED}
                                  className="bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase hover:bg-black disabled:opacity-20 transition-all shadow-md"
                               >
                                  Final Review
                               </button>
                            )}
                         </td>
                      </tr>
                   ))}
                   {filteredDmax.length === 0 && (
                      <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-medium">No DMAX reports found.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CEOView;
