
import React, { useState } from 'react';
import { User, Evidence, AuditStatus, DMAXReport, Role, ActivityType } from '../types';
import { DEPARTMENT_CHECKLISTS, STATUS_COLORS } from '../constants';
import { Check, X, Eye, FileText, ClipboardList, Download, Calendar, User as UserIcon, ShieldAlert } from 'lucide-react';

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

  // Internal Auditor reviews ALL departments
  const pendingEvidence = evidence.filter(e => e.status === AuditStatus.SUBMITTED);
  const pendingDmax = dmax.filter(d => d.status === AuditStatus.SUBMITTED);

  if (user.role !== Role.INTERNAL_AUDITOR) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-slate-500 max-w-sm mt-2">Only Internal Auditors have permission to review and approve compliance evidence.</p>
      </div>
    );
  }

  const handleEvidenceAction = (id: string, approve: boolean) => {
    const target = evidence.find(e => e.id === id);
    const task = DEPARTMENT_CHECKLISTS.find(t => t.id === target?.checklistItemId)?.task;
    
    setEvidence(prev => prev.map(e => 
      e.id === id 
        ? { ...e, status: approve ? AuditStatus.MANAGER_APPROVED : AuditStatus.REJECTED, managerComment: feedback } 
        : e
    ));

    logActivity(user, approve ? ActivityType.APPROVAL : ActivityType.REJECTION, 
      `${approve ? 'Internal Audit Approved' : 'Internal Audit Rejected'} for task: ${task}. Feedback: ${feedback || 'No feedback'}`);
    
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
      `Internal Auditor ${approve ? 'Approved' : 'Rejected'} DMAX report for ${target?.userName}.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internal Audit Inbox</h1>
          <p className="text-sm text-slate-500 mt-1">Centralized review queue for all departmental submissions</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveView('evidence')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeView === 'evidence' ? 'bg-white shadow-md text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <ClipboardList size={18} />
            Checklists ({pendingEvidence.length})
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
                <Check className="text-emerald-500 mx-auto mb-4" size={32} />
                <p className="text-slate-400 font-medium">All submissions have been reviewed.</p>
              </div>
            ) : (
              pendingEvidence.map(e => {
                const task = DEPARTMENT_CHECKLISTS.find(t => t.id === e.checklistItemId)?.task;
                return (
                  <div key={e.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 font-bold text-xs">
                           {e.department}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{task}</h3>
                          <div className="flex items-center gap-3 mt-1 text-slate-400 text-xs font-bold uppercase">
                            <Calendar size={12} /> {e.submissionDate}
                            <span className="mx-1">•</span>
                            <UserIcon size={12} /> Contributor ID: {e.userId.slice(-4)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {e.fileUrl && (
                          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                            <Download size={14} /> File
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-blue-600"><Eye size={20}/></button>
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-sm text-slate-700 leading-relaxed mb-6">
                      "{e.comment}"
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <input 
                        placeholder="Auditor comments or rejection reason..."
                        className="flex-1 w-full text-sm rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 py-2.5 pl-4"
                        value={feedback}
                        onChange={(ev) => setFeedback(ev.target.value)}
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEvidenceAction(e.id, true)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/10 flex items-center gap-2">
                          <Check size={18} /> Approve
                        </button>
                        <button onClick={() => handleEvidenceAction(e.id, false)} className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/10 flex items-center gap-2">
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
              <div className="p-20 text-center text-slate-400">No DMAX reports pending audit.</div>
            ) : (
              pendingDmax.map(d => (
                <div key={d.id} className="p-8 hover:bg-slate-50/50">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><FileText size={28} /></div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{d.month} DMAX - {d.userName}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Dept: {d.department}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDmaxAction(d.id, true)} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/10 flex items-center gap-2">
                      <Check size={18} /> Approve Report
                    </button>
                  </div>
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl text-slate-600 text-sm italic">
                    {d.content}
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
