import React, { useState } from 'react';
import { DESICREW_LOGO, COMPANY_NAME, COMPANY_TAGLINE, APP_NAME } from '../constants';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@desicrew.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-[440px] w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="p-10 text-center border-b border-slate-50 bg-slate-900 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-transparent"></div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-xl inline-block mb-6 relative z-10">
              <img 
                src={DESICREW_LOGO} 
                alt={`${COMPANY_NAME} Corporate Logo`} 
                className="h-12 w-auto object-contain block mx-auto"
                onError={(e) => {
                   (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x60?text=DesiCrew';
                }}
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight relative z-10">{APP_NAME}</h1>
            <p className="text-blue-400 text-xs mt-1 font-bold uppercase tracking-widest relative z-10">{COMPANY_TAGLINE}</p>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-bold text-slate-900">Portal Login</h2>
              <p className="text-slate-500 text-sm">Secure access for internal audit & compliance management</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Corporate Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@desicrew.in"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center pl-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">Access Password</label>
                  <button type="button" className="text-[10px] text-blue-600 hover:underline font-bold uppercase tracking-tight">Forgot Key?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium outline-none"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Validating Identity...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} className="text-blue-400" />
                    Secure Login
                  </>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                   Restricted Access System
                </p>
                <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                  DesiCrew Solutions Private Limited &copy; {new Date().getFullYear()}<br/>
                  Authorized Personnel Only &bull; All sessions are logged
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
