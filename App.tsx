
import React, { useState } from 'react';
import MfaLogin from './components/MfaLogin';
import DocumentProcessor from './components/DocumentProcessor';
import HistoryTable from './components/HistoryTable';
import DetailModal from './components/DetailModal';
import RedistributionPanel from './components/RedistributionPanel';
import { AuthState, ProcessedDocument, AppTab } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: true, // Default to true for development flow
    user: { name: 'DEVELOPER USER', email: 'dev@documind.pro' },
    mfaVerified: true,
  });

  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const handleLoginSuccess = (user: { name: string; email: string }) => {
    setAuth({
      isAuthenticated: true,
      user,
      mfaVerified: true,
    });
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
      mfaVerified: false,
    });
  };

  const addDocument = (doc: ProcessedDocument) => {
    setProcessedDocs(prev => [doc, ...prev]);
  };

  if (!auth.isAuthenticated) {
    return <MfaLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <DocumentProcessor onDocumentAdded={addDocument} />
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Automated Redistribution</h2>
                  <p className="text-blue-100 text-sm opacity-90 leading-relaxed max-w-md">
                    DocuMind uses AI to classify documents into themes. These are currently being tracked for future automated redistribution to your external accounts.
                  </p>
                  <button 
                    onClick={() => setActiveTab('redistribution')}
                    className="mt-6 px-6 py-2 bg-white text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all flex items-center gap-2"
                  >
                    <i className="fas fa-route"></i> Manage Routing Rules
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-2">Processed</div>
                  <div className="text-3xl font-bold text-gray-800">{processedDocs.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-400 text-xs font-bold uppercase mb-2">Active Targets</div>
                  <div className="text-3xl font-bold text-gray-800">4</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="text-gray-400 text-xs font-bold uppercase">Security Status</div>
                  <div className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <i className="fas fa-shield-alt"></i> MFA Active
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'redistribution':
        return <RedistributionPanel />;
      case 'history':
        return <HistoryTable documents={processedDocs} onSelect={setSelectedDoc} />;
      default:
        return <div>Tab not implemented yet.</div>;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shrink-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-brain text-white"></i>
          </div>
          {sidebarOpen && <span className="font-bold text-lg tracking-tight">DocuMind Pro</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
            { id: 'history', icon: 'fa-history', label: 'History' },
            { id: 'redistribution', icon: 'fa-route', label: 'Redistribution' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'bg-slate-800/50 p-3' : 'justify-center'} rounded-xl`}>
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">
                {auth.user?.name.charAt(0)}
             </div>
             {sidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-bold truncate uppercase">{auth.user?.name}</p>
                 <p className="text-[10px] text-slate-500 truncate">{auth.user?.email}</p>
               </div>
             )}
          </div>
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${!sidebarOpen && 'justify-center'}`}
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            {sidebarOpen && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Session Secure (MFA)
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {renderContent()}
          
          {/* Always show history table at the bottom of dashboard */}
          {activeTab === 'dashboard' && <HistoryTable documents={processedDocs} onSelect={setSelectedDoc} />}
        </div>
      </main>

      <DetailModal 
        document={selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
      />
    </div>
  );
};

export default App;
