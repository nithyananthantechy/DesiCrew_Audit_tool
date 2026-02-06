
import React, { useState, useEffect } from 'react';
import { User, Evidence, AuditStatus, Department, ActivityType } from '../types';
import { DEPARTMENT_CHECKLISTS, STATUS_COLORS } from '../constants';
import { Upload, Plus, AlertCircle, CheckCircle2, X, FileText, Loader2, ClipboardList, Calendar } from 'lucide-react';

interface ChecklistProps {
  user: User;
  evidence: Evidence[];
  setEvidence: React.Dispatch<React.SetStateAction<Evidence[]>>;
  logActivity: (user: User, action: ActivityType, description: string) => void;
}

const MAX_COMMENT_LENGTH = 1000;

const ChecklistSubmission: React.FC<ChecklistProps> = ({ user, evidence, setEvidence, logActivity }) => {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [comment, setComment] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const departmentTasks = DEPARTMENT_CHECKLISTS.filter(t => t.department === user.department);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileUrl(`file://${file.name}`);
      setError('');
    }
  };

  const removeFile = () => {
    setFileName('');
    setFileUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTaskId) {
      setError('Please select a checklist item.');
      return;
    }
    if (!comment.trim()) {
      setError('Comments are required.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const taskObj = departmentTasks.find(t => t.id === selectedTaskId);
      const newEvidence: Evidence = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        checklistItemId: selectedTaskId,
        department: user.department,
        submissionDate: new Date().toISOString().split('T')[0],
        fileUrl: fileUrl,
        comment: comment,
        status: AuditStatus.SUBMITTED
      };

      setEvidence(prev => [...prev, newEvidence]);
      logActivity(user, ActivityType.SUBMISSION, `Submitted evidence for task: ${taskObj?.task || selectedTaskId}`);
      
      setSelectedTaskId('');
      setComment('');
      setFileName('');
      setFileUrl('');
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1200);
  };

  const mySubmissions = evidence.filter(e => e.userId === user.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Plus className="text-blue-600" size={20} />
            </div>
            New Evidence Submission
          </h2>
          {showSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium animate-in slide-in-from-right-4">
              <CheckCircle2 size={16} />
              Submission Successful
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="checklist-item" className="block text-sm font-semibold text-slate-700">
                Checklist Item <span className="text-red-500">*</span>
              </label>
              <select 
                id="checklist-item"
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full h-12 px-4 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="" className="text-slate-400">Select audit task...</option>
                {departmentTasks.map(task => (
                  <option key={task.id} value={task.id} className="text-slate-900">{task.task}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Evidence File (Optional)
              </label>
              {!fileName ? (
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    id="file-upload"
                  />
                  <div className="flex items-center gap-3 w-full h-12 border-2 border-dashed border-slate-200 rounded-xl px-4 text-sm text-slate-500 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                    <Upload size={18} className="text-slate-400 group-hover:text-blue-500" />
                    <span>Upload PDF, Doc, or Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText size={18} className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 truncate">{fileName}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="comments" className="block text-sm font-semibold text-slate-700">
                Submission Comments <span className="text-red-500">*</span>
              </label>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${comment.length > MAX_COMMENT_LENGTH * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>
                {comment.length} / {MAX_COMMENT_LENGTH} characters
              </span>
            </div>
            <textarea 
              id="comments"
              value={comment}
              maxLength={MAX_COMMENT_LENGTH}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-h-[140px] leading-relaxed shadow-sm"
              placeholder="Provide a detailed description of the evidence being submitted. Mention any specific context that the Internal Auditor should be aware of..."
            ></textarea>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting || !selectedTaskId || !comment.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing Submission...
                </>
              ) : (
                <>
                  Submit to Internal Auditor
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Recent Submission History</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
            Current Session
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {mySubmissions.length === 0 ? (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium">No evidence submitted yet.</p>
              <p className="text-slate-300 text-xs mt-1">Your department checklist items will appear here after submission.</p>
            </div>
          ) : (
            [...mySubmissions].reverse().map(e => {
              const taskLabel = DEPARTMENT_CHECKLISTS.find(t => t.id === e.checklistItemId)?.task;
              return (
                <div key={e.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className={`mt-1 p-2.5 rounded-xl shadow-sm ${
                      e.status === AuditStatus.REJECTED ? 'bg-red-50 text-red-500' : 
                      e.status === AuditStatus.MANAGER_APPROVED ? 'bg-emerald-50 text-emerald-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {e.status === AuditStatus.REJECTED ? <AlertCircle size={22} /> : 
                       e.status === AuditStatus.MANAGER_APPROVED ? <CheckCircle2 size={22} /> : 
                       <FileText size={22} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 truncate pr-4">{taskLabel}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[e.status]}`}>
                          {e.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {e.comment}
                      </p>
                      {e.managerComment && (
                        <div className="mb-3 bg-slate-50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100 relative">
                          <div className="absolute top-0 left-4 -translate-y-1/2 bg-white px-2 font-bold text-[10px] text-slate-400 border border-slate-100 rounded">
                            AUDITOR FEEDBACK
                          </div>
                          {e.managerComment}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {e.submissionDate}</span>
                        {e.fileUrl && (
                          <span className="flex items-center gap-1 text-blue-500 cursor-pointer hover:underline">
                            <FileText size={12}/> View Attachment
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistSubmission;
