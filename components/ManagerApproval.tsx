
import React, { useState } from 'react';
import { User, Evidence, AuditStatus, DMAXReport, Role, ActivityType } from '../types';
import { DEPARTMENT_CHECKLISTS, STATUS_COLORS } from '../constants';
import { Check, X, Eye, FileText, ClipboardList, Download, Calendar, User as UserIcon } from 'lucide-react';

interface ManagerApprovalProps {
  user: User;
  evidence: Evidence[];
  setEvidence: React.Dispatch<React.SetStateAction<Evidence[]>>;
  dmax: DMAXReport[];
  setDmax: React.Dispatch<React.SetStateAction<DMAXReport[]>>;
  logActivity: (user: User, action: ActivityType, description: string) => void;
}

const ManagerApproval: React.FC<ManagerApprovalProps> = ({ user, evidence, setEvidence, dmax, setDmax, logActivity }) => {
  const [activeView, setActiveView] = useState<'evidence' | 'dmax'>('evidence');
  const [feedback, setFeedback] = useState('');

  const pendingEvidence = evidence.filter(e => e.department === user.department && e.status === AuditStatus.SUBMITTED);
  const pendingDmax = dmax.filter(d => d.department === user.department && d.status === AuditStatus.SUBMITTED);

  const handleEvidenceAction = (id: string, approve: boolean) => {
    const target = evidence.find(e => e.id === id);
    const task = DEPARTMENT_CHECKLISTS.find(t => t.id === target?.checklistItemId)?.task;
    
    setEvidence(prev => prev.map(e => 
      e.id === id 
        ? { ...e, status: approve ? AuditStatus.MANAGER_APPROVED : AuditStatus.REJECTED, managerComment: feedback } 
        : e
    ));

    logActivity(user, approve ? ActivityType.APPROVAL : ActivityType.REJECTION, 
      `${approve ? 'Approved' : 'Rejected'} evidence for task: ${task}. Feedback: ${feedback || 'No feedback provided'}`);
    
    setFeedback('');
  };

  const handleDmaxAction = (id: string, approve: boolean) => {
    const target = dmax.find(d => d.id === id);
    setDmax(prev => prev.map(d => 
      d.id === id 
        ? { ...d, status: approve ? AuditStatus.MANAGER_APPROVED : AuditStatus.REJECTED } 
        : d
    ));

    logActivity(user, approve ? ActivityType.APPROVAL : ActivityType.REJECTION, 
      `${approve ? 'Approved' : 'Rejected'} DMAX report for ${target?.userName} (${target?.month} ${target?.year}).`);
    
    setFeedback('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Review Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">Manager approval workflow for {user.department} Department</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveView('evidence')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'evidence' ? 'bg-white shadow-md text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ClipboardList size={18} />
            Evidence ({pendingEvidence.length})
          </button>
          <button 
            onClick={() => setActiveView('dmax')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'dmax' ? 'bg-white shadow-md text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <FileText size={18} />
            DMAX ({pendingDmax.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {activeView === 'evidence' ? (
          <div className="divide-y divide-slate-100">
            {pendingEvidence.length === 0 ? (
              <div className="p-20 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-emerald-500" size={32} />
                </div>
                <p className="text-slate-400 font-medium">Clear! No pending evidence to review.</p>
              </div>
            ) : (
              pendingEvidence.map(e => {
                const task = DEPARTMENT_CHECKLISTS.find(t => t.id === e.checklistItemId)?.task;
                return (
                  <div key={e.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2.5 rounded-xl">
                           <ClipboardList className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{task}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tight">
                              <Calendar size={12} /> {e.submissionDate}
                            </span>
                            <span className="text-xs text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tight">
                              <UserIcon size={12} /> ID: {e.userId.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {e.fileUrl && (
                          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                            <Download size={14} /> View File
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                          <Eye size={20}/>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 p-4 rounded-xl text-sm text-slate-700 leading-relaxed mb-6 shadow-sm">
                      "{e.comment}"
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                      <div className="relative flex-1 w-full">
                        <input 
                          placeholder="Add feedback for the contributor..."
                          className="w-full text-sm rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 py-2.5 pl-4"
                          value={feedback}
                          onChange={(ev) => setFeedback(ev.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button 
                          onClick={() => handleEvidenceAction(e.id, true)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10"
                        >
                          <Check size={18} /> Approve
                        </button>
                        <button 
                          onClick={() => handleEvidenceAction(e.id, false)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/10"
                        >
                          <X size={18} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingDmax.length === 0 ? (
              <div className="p-20 text-center text-slate-400">
                <FileText className="mx-auto mb-4 opacity-20" size={48} />
                No DMAX reports pending review.
              </div>
            ) : (
              pendingDmax.map(d => (
                <div key={d.id} className="p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-50 p-3 rounded-2xl">
                        <FileText className="text-purple-600" size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">DMAX Report: {d.month} 2024</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <UserIcon size={12} className="text-blue-500" /> {d.userName}
                          </span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            Dept: {d.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    {d.fileUrl && (
                       <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                          <Download size={14} /> Download DMAX Doc
                       </button>
                    )}
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-2xl text-slate-600 text-sm leading-relaxed mb-8 shadow-sm relative">
                    <div className="absolute top-0 left-6 -translate-y-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 border border-slate-100 rounded">
                      EXECUTIVE SUMMARY
                    </div>
                    {d.content}
                  </div>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => handleDmaxAction(d.id, false)}
                      className="px-8 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleDmaxAction(d.id, true)}
                      className="bg-emerald-600 text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                      <Check size={18} /> Approve Monthly Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerApproval;
