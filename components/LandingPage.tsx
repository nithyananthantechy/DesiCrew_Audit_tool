import React from 'react';
import { DESICREW_LOGO, COMPANY_NAME, COMPANY_TAGLINE, APP_NAME } from '../constants';
import { 
  ShieldCheck, 
  Search, 
  ChevronRight, 
  ArrowRight, 
  BarChart3, 
  Lock, 
  Zap, 
  CheckCircle2, 
  Globe, 
  Menu 
} from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100] px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={DESICREW_LOGO} 
              alt={`${COMPANY_NAME} Logo`} 
              className="h-10 w-auto object-contain"
              style={{ maxHeight: '44px' }}
            />
          </div>
          <div className="hidden lg:block h-6 w-px bg-slate-200 mx-2"></div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-bold text-slate-900 leading-tight">DesiCrew Solutions</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{APP_NAME}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button className="hover:text-blue-600 transition-colors flex items-center gap-1">
            Products <ChevronRight size={14} className="rotate-90" />
          </button>
          <button className="hover:text-blue-600 transition-colors">Resources</button>
          <button className="hover:text-blue-600 transition-colors">Company</button>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={onLoginClick}
            className="hidden sm:block px-6 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
          >
            Portal Login
          </button>
          <button className="md:hidden p-2 text-slate-900">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
            <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Compliance</span>
            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">v2.5 Release</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            Your Path to <span className="text-blue-600">Intelligent</span> <br /> Compliance & Audit
          </h2>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-xl leading-relaxed">
            Transform manual audits into a centralized, automated compliance system. Purpose-built for <span className="text-slate-900 font-semibold">{COMPANY_NAME}</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onLoginClick}
              className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Request Demo
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {String.fromCharCode(64+i)}
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-slate-400">
              Trusted by <span className="text-slate-900 font-bold">500+</span> internal contributors
            </p>
          </div>
        </div>

        {/* Feature Cards Grid (Quantarra Style) */}
        <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" />}
            title="Centralized Hub"
            desc="One source of truth for all department compliance files."
            color="bg-emerald-50 border-emerald-100"
          />
          <FeatureCard 
            icon={<Zap className="text-blue-500" />}
            title="Auto Workflows"
            desc="Seamless approval chains from Contributor to CGO."
            color="bg-blue-50 border-blue-100"
          />
          <FeatureCard 
            icon={<BarChart3 className="text-purple-500" />}
            title="Audit Analytics"
            desc="Real-time tracking of DMAX delinquency and health."
            color="bg-purple-50 border-purple-100"
          />
          <FeatureCard 
            icon={<Lock className="text-orange-500" />}
            title="Role-Based Security"
            desc="Encrypted access ensuring strict data sovereignty."
            color="bg-orange-50 border-orange-100"
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Enterprise Standards</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 opacity-40 grayscale">
               <span className="text-lg font-bold">ISO 27001</span>
               <span className="text-lg font-bold">SOC 2 Type II</span>
               <span className="text-lg font-bold">GDPR Ready</span>
               <span className="text-lg font-bold">ISMS Audit</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">99.9% Uptime SLA</p>
              <p className="text-xs text-slate-500">Continuous monitoring & audit trails</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-12 border-t border-slate-100 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src={DESICREW_LOGO} alt="DesiCrew" className="h-6 w-auto opacity-50" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{APP_NAME}</span>
          </div>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} DesiCrew Solutions Private Limited. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <button className="hover:text-blue-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-blue-600 transition-colors">Terms of Access</button>
            <button className="hover:text-blue-600 transition-colors">Contact Compliance</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
  <div className={`p-8 rounded-[32px] border ${color} hover:shadow-2xl hover:-translate-y-1 transition-all group`}>
    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;