import React from 'react';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileText, 
  CheckSquare, 
  ShieldCheck, 
  Users, 
  LogOut,
  Building2
} from 'lucide-react';
import { DESICREW_LOGO, COMPANY_NAME, APP_NAME } from '../constants';

interface SidebarProps {
  role: Role;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.CONTRIBUTOR, Role.TEAM_LEAD, Role.MANAGER, Role.CEO_CGO, Role.SUPER_ADMIN] },
    { id: 'checklists', label: 'My Checklists', icon: ClipboardCheck, roles: [Role.CONTRIBUTOR, Role.TEAM_LEAD, Role.MANAGER] },
    { id: 'dmax', label: 'DMAX Reports', icon: FileText, roles: [Role.CONTRIBUTOR, Role.TEAM_LEAD, Role.MANAGER, Role.CEO_CGO] },
    { id: 'approvals', label: 'Audit Inbox', icon: CheckSquare, roles: [Role.MANAGER] },
    { id: 'executive', label: 'Global Compliance', icon: ShieldCheck, roles: [Role.CEO_CGO, Role.SUPER_ADMIN] },
    { id: 'admin', label: 'Admin Panel', icon: Users, roles: [Role.SUPER_ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen shadow-xl z-50">
      <div className="p-6 flex flex-col gap-4 border-b border-slate-800 bg-black/10">
        <div className="bg-white p-2 rounded-xl shadow-inner flex items-center justify-center">
          <img 
            src={DESICREW_LOGO} 
            alt={`${COMPANY_NAME} Logo`} 
            className="h-10 w-auto object-contain" 
          />
        </div>
        <div>
           <span className="font-bold text-sm tracking-tight block text-blue-400">DesiCrew Solutions</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Compliance & Audit</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-500'} />
            <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-black/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-xs uppercase tracking-wider"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;