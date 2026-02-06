
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Department, Evidence, DMAXReport, AuditStatus, ActivityLog, ActivityType } from './types';
import { MOCK_USERS, APP_NAME } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChecklistSubmission from './components/ChecklistSubmission';
import ManagerApproval from './components/ManagerApproval';
import CEOView from './components/CEOView';
import AdminPanel from './components/AdminPanel';
import DMAXModule from './components/DMAXModule';
import LoginPage from './components/LoginPage';
import WelcomeScreen from './components/WelcomeScreen';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginState, setLoginState] = useState<'landing' | 'login' | 'welcome' | 'active'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [evidenceStore, setEvidenceStore] = useState<Evidence[]>([]);
  const [dmaxStore, setDmaxStore] = useState<DMAXReport[]>([]);
  const [userStore, setUserStore] = useState<User[]>([]);
  const [activityStore, setActivityStore] = useState<ActivityLog[]>([]);

  useEffect(() => {
    document.title = currentUser ? `${APP_NAME} | ${currentUser.name}` : APP_NAME;
  }, [currentUser]);

  useEffect(() => {
    const savedEvidence = localStorage.getItem('dc_evidence');
    const savedDmax = localStorage.getItem('dc_dmax');
    const savedUsers = localStorage.getItem('dc_users');
    const savedActivity = localStorage.getItem('dc_activity');
    
    // Migration helper: ensures 'Production' is renamed to 'Operations'
    const migrate = (items: any[]) => {
      if (!Array.isArray(items)) return [];
      return items.map(item => {
        if (item.department === 'Production') {
          return { ...item, department: Department.OPERATIONS };
        }
        return item;
      });
    };

    if (savedEvidence) setEvidenceStore(migrate(JSON.parse(savedEvidence)));
    if (savedDmax) setDmaxStore(migrate(JSON.parse(savedDmax)));
    if (savedActivity) setActivityStore(migrate(JSON.parse(savedActivity)));
    
    if (savedUsers) {
      setUserStore(migrate(JSON.parse(savedUsers)));
    } else {
      setUserStore(MOCK_USERS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dc_evidence', JSON.stringify(evidenceStore));
    localStorage.setItem('dc_dmax', JSON.stringify(dmaxStore));
    localStorage.setItem('dc_users', JSON.stringify(userStore));
    localStorage.setItem('dc_activity', JSON.stringify(activityStore));
  }, [evidenceStore, dmaxStore, userStore, activityStore]);

  const logActivity = useCallback((user: User, action: ActivityType, description: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      department: user.department,
      action,
      description,
      timestamp: new Date().toLocaleString()
    };
    setActivityStore(prev => [newLog, ...prev].slice(0, 1000));
  }, []);

  const handleLogin = (email: string) => {
    const user = userStore.find(u => u.email === email);
    if (user) {
      if (!user.isActive) {
        alert('This account has been disabled. Please contact the Super Admin.');
        return;
      }
      setCurrentUser(user);
      setLoginState('welcome');
      logActivity(user, ActivityType.LOGIN, `User logged into the compliance portal.`);
      
      setTimeout(() => {
        setLoginState('active');
        if (user.role === Role.SUPER_ADMIN) setActiveTab('admin');
        else if (user.role === Role.EXTERNAL_AUDITOR) setActiveTab('executive');
        else if (user.role === Role.INTERNAL_AUDITOR) setActiveTab('approvals');
        else setActiveTab('dashboard');
      }, 2000);

    } else {
      alert('Invalid credentials. For this demo, try admin@desicrew.in');
    }
  };

  const handleLogout = () => {
    if (currentUser) logActivity(currentUser, ActivityType.SYSTEM, `User signed out.`);
    setLoginState('landing');
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUserStore(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    logActivity(updatedUser, ActivityType.PROFILE_UPDATE, `User updated their profile information.`);
  };

  if (loginState === 'landing') return <LandingPage onLoginClick={() => setLoginState('login')} />;
  if (loginState === 'login') return <LoginPage onLogin={handleLogin} />;
  if (loginState === 'welcome' && currentUser) return <WelcomeScreen user={currentUser} />;

  const renderContent = () => {
    if (!currentUser) return null;
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={currentUser} evidence={evidenceStore} dmax={dmaxStore} />;
      case 'checklists':
        return <ChecklistSubmission user={currentUser} evidence={evidenceStore} setEvidence={setEvidenceStore} logActivity={logActivity} />;
      case 'dmax':
        return <DMAXModule user={currentUser} reports={dmaxStore} setReports={setDmaxStore} logActivity={logActivity} />;
      case 'approvals':
        return <ManagerApproval user={currentUser} evidence={evidenceStore} setEvidence={setEvidenceStore} dmax={dmaxStore} setDmax={setDmaxStore} logActivity={logActivity} />;
      case 'executive':
        return <CEOView evidence={evidenceStore} dmax={dmaxStore} setEvidence={setEvidenceStore} setDmax={setDmaxStore} user={currentUser} logActivity={logActivity} />;
      case 'admin':
        return <AdminPanel dmax={dmaxStore} users={userStore} setUsers={setUserStore} activities={activityStore} user={currentUser} logActivity={logActivity} />;
      default:
        return <Dashboard user={currentUser} evidence={evidenceStore} dmax={dmaxStore} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {currentUser && (
        <Sidebar 
          role={currentUser.role} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      )}
      <div className="flex-1 flex flex-col">
        {currentUser && <Header user={currentUser} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
