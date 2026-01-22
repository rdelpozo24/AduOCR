
import React, { useState } from 'react';
import MfaLogin from './components/MfaLogin';
import DocumentProcessor from './components/DocumentProcessor';
import HistoryTable from './components/HistoryTable';
import DetailModal from './components/DetailModal';
import RedistributionPanel from './components/RedistributionPanel';
import { AuthState, ProcessedDocument, AppTab } from './types';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: true, // Por defecto true para desarrollo
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

  const exportCSV = () => {
    if (processedDocs.length === 0) return;
    
    const headers = ["ID", "Fecha Procesamiento", "Archivo", "Categoría", "Resumen", "Campos Extraídos"];
    const rows = processedDocs.map(doc => {
      const fields = doc.fields.map(f => `${f.label}:${f.value}`).join(' | ');
      return [
        doc.id,
        doc.timestamp,
        `"${doc.fileName}"`,
        `"${doc.theme}"`,
        `"${doc.summary.replace(/"/g, '""')}"`,
        `"${fields.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `documind_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Análisis de Precisión IA</h2>
                  <p className="text-indigo-100 text-sm opacity-90 leading-relaxed max-w-md">
                    DocuMind Pro está configurado para detectar automáticamente Sanciones, Requerimientos y Citaciones con un enfoque en plazos legales.
                  </p>
                  <div className="mt-6 flex gap-4">
                    <button 
                      onClick={() => setActiveTab('redistribution')}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-500 transition-all flex items-center gap-2"
                    >
                      <i className="fas fa-route"></i> Reglas de Enrutado
                    </button>
                    {processedDocs.length > 0 && (
                      <button 
                        onClick={exportCSV}
                        className="px-6 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <i className="fas fa-file-export text-emerald-600"></i> Exportar Datos
                      </button>
                    )}
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-400 text-[10px] font-bold uppercase mb-2">Documentos Procesados</div>
                  <div className="text-3xl font-black text-slate-900">{processedDocs.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-gray-400 text-[10px] font-bold uppercase mb-2">Precisión Media</div>
                  <div className="text-3xl font-black text-emerald-600">98.4%</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <div className="text-gray-400 text-[10px] font-bold uppercase">Seguridad</div>
                  <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <i className="fas fa-shield-alt"></i> MFA Corporativo Activo
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
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <i className="fas fa-brain text-white"></i>
          </div>
          {sidebarOpen && <span className="font-bold text-lg tracking-tight">DocuMind Pro</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {[
            { id: 'dashboard', icon: 'fa-th-large', label: 'Panel Control' },
            { id: 'history', icon: 'fa-history', label: 'Historial' },
            { id: 'redistribution', icon: 'fa-route', label: 'Redistribución' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'bg-slate-800/50 p-3' : 'justify-center'} rounded-xl`}>
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
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
            {sidebarOpen && <span className="text-sm font-medium">Cerrar Sesión</span>}
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
            <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-wider">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Conexión Segura
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
          {renderContent()}
          
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
