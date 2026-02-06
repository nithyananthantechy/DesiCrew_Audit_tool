
import React, { useState } from 'react';
import { User, DMAXReport, AuditStatus, Department, Role } from '../types';
import { STATUS_COLORS } from '../constants';
import { FilePlus2, Search, Calendar, CheckCircle2, Loader2, FileText, ChevronRight, Upload, X, AlertCircle, Download } from 'lucide-react';

interface DMAXProps {
  user: User;
  reports: DMAXReport[];
  setReports: React.Dispatch<React.SetStateAction<DMAXReport[]>>;
}

const MAX_DMAX_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const DMAXModule: React.FC<DMAXProps> = ({ user, reports, setReports }) => {
  const [month, setMonth] = useState('January');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, Word, or Excel documents.');
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 10MB limit.');
        return;
      }

      setFileName(file.name);
      setFileSize((file.size / 1024 / 1024).toFixed(2) + ' MB');
      setFileUrl(`file://${file.name}`);
    }
  };

  const removeFile = () => {
    setFileName('');
    setFileSize('');
    setFileUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Summary of accomplishments is required.');
      return;
    }

    if (!fileUrl) {
      setError('A DMAX report document is mandatory.');
      return;
    }

    // Check for duplicate submission for the same month/year
    const duplicate = reports.find(r => r.userId === user.id && r.month === month && r.year === 2024);
    if (duplicate && duplicate.status !== AuditStatus.REJECTED) {
       setError(`A DMAX report for ${month} 2024 has already been submitted.`);
       return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newReport: DMAXReport = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        department: user.department,
        month,
        year: 2024,
        content,
        status: AuditStatus.SUBMITTED,
        submissionDate: new Date().toISOString().split('T')[0],
        fileName,
        fileUrl,
        fileSize
      };

      setReports(prev => [...prev, newReport]);
      setContent('');
      setFileName('');
      setFileSize('');
      setFileUrl('');
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  const myReports = reports.filter(r => r.userId === user.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">DMAX Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Monthly Progress Report Submission & History</p>
        </div>
        <div className="flex items-center gap-3">
           {showSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium animate-in slide-in-from-right-4">
              <CheckCircle2 size={16} />
              DMAX Submitted Successfully
            </div>
          )}
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
            DMAX-v2.1
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <FilePlus2 className="text-blue-600" size={18} />
              </div>
              Submit New DMAX
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Reporting Month</label>
                <div className="relative">
                  <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-11 px-4 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    {months.map(m => <option key={m} value={m}>{m} 2024</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-semibold text-slate-700">Summary of Accomplishments</label>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${content.length > MAX_DMAX_LENGTH * 0.9 ? 'text-red-500' : 'text-slate-400'}`}>
                    {content.length} / {MAX_DMAX_LENGTH}
                  </span>
                </div>
                <textarea 
                  value={content}
                  maxLength={MAX_DMAX_LENGTH}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-h-[140px] leading-relaxed shadow-sm"
                  placeholder="Key highlights and major contributions for this month..."
                  required
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  DMAX Report Upload <span className="text-red-500">*</span>
                </label>
                {!fileName ? (
                  <div className="relative group">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      id="dmax-upload"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl px-4 text-center group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                      <Upload size={24} className="text-slate-400 group-hover:text-blue-500 mb-2" />
                      <span className="text-xs font-semibold text-slate-500">Click or drag DMAX report</span>
                      <span className="text-[10px] text-slate-400 mt-1">PDF, DOC, XLS up to 10MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between h-14 bg-blue-50 border border-blue-100 rounded-xl px-4 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <FileText size={18} className="text-blue-600 flex-shrink-0" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-slate-900 truncate">{fileName}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{fileSize}</span>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={removeFile}
                      className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-full text-slate-400 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 text-red-600 text-[11px] font-bold bg-red-50 p-3 rounded-lg border border-red-100 leading-tight">
                  <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting || !content.trim() || !fileUrl}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit Monthly Report'
                )}
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Policy</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                Files are auto-renamed as: DMAX_{user.name.split(' ')[0]}_{month}_2024.pdf
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Submission History</h2>
              <div className="flex gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                Showing all entries for 2024
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reporting Period</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-medium">No DMAX reports found.</p>
                        <p className="text-slate-300 text-xs mt-1">Reports will appear here once submitted.</p>
                      </td>
                    </tr>
                  ) : (
                    [...myReports].reverse().map(report => (
                      <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                              <Calendar size={16} />
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-none">{report.month}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 inline-block">{report.year}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                             <FileText size={14} className="text-slate-400" />
                             <span className="text-xs font-semibold truncate max-w-[120px]">{report.fileName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase border shadow-sm ${STATUS_COLORS[report.status]}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                             <button className="text-slate-400 hover:text-blue-600 p-1 rounded-lg transition-colors">
                                <Download size={16} />
                             </button>
                             <button className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline">
                                Details
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMAXModule;
