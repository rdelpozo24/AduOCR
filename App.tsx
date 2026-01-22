
import React, { useState } from 'react';
import DocumentProcessor from './components/DocumentProcessor.tsx';
import HistoryTable from './components/HistoryTable.tsx';
import DetailModal from './components/DetailModal.tsx';
import RedistributionPanel from './components/RedistributionPanel.tsx';
import { ProcessedDocument, AppTab, UserProfile } from './types.ts';

const App: React.FC = () => {
  // Perfil de acceso directo
  const [user] = useState<UserProfile>({
    name: 'GESTOR IA',
    email: 'sistema@documind.pro',
    role: 'Administrador'
  });

  const [processedDocs, setProcessedDocs] = useState<ProcessedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');

  const addDocument = (doc: ProcessedDocument) => {
    setProcessedDocs(prev => [doc, ...prev]);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar Profesional */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col shrink-0 h-screen sticky top-0 z-50 shadow-2xl`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <i className="fas fa-brain text-white text-sm"></i>
          </div>
          {sidebarOpen && <span className="font-extrabold text-lg tracking-tight truncate">DOCUMIND PRO</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: 'dashboard', icon: 'fa-layer-group', label: 'Panel General' },
            { id: 'history', icon: 'fa-folder-open', label: 'Repositorio' },
            { id: 'redistribution', icon: 'fa-project-diagram', label: 'Reglas IA' },
          ].map(item => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id as AppTab)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <i className={`fas ${item.icon} w-5 text-center`}></i>
              {sidebarOpen && <span className="text-sm font-semibold tracking-wide">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'bg-slate-800/40 p-3' : 'justify-center'} rounded-2xl overflow-hidden`}>
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-white/10">
                {user.name.charAt(0)}
             </div>
             {sidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-[10px] font-black truncate uppercase text-indigo-300 tracking-wider leading-none mb-1">{user.name}</p>
                 <p className="text-[9px] text-slate-500 truncate leading-none">{user.email}</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Area Principal */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 shrink-0 z-40">
          <div className="flex items-center gap-5">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors border border-transparent hover:border-slate-100">
              <i className={`fas ${sidebarOpen ? 'fa-indent' : 'fa-outdent'}`}></i>
            </button>
            <div>
              <h1 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none">{activeTab}</h1>
              <p className="text-[10px] text-slate-400 font-bold mt-1">SISTEMA DE PROCESAMIENTO ACTIVO</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">MODO DIRECTO ACTIVO</span>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-2"></div>
            <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
              <i className="fas fa-bell text-sm"></i>
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto space-y-8 animate-slide">
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5">
                    <DocumentProcessor onDocumentAdded={addDocument} />
                  </div>
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-700 via-indigo-900 to-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">OCR Inteligente</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 leading-tight">Análisis Documental sin Restricciones</h2>
                        <p className="text-indigo-100 text-sm leading-relaxed max-w-md opacity-80 font-medium">
                          Sube cualquier archivo administrativo. Gemini detectará automáticamente el tipo de documento y extraerá los campos clave.
                        </p>
                        <div className="mt-8 flex gap-4">
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                             <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Estado</p>
                             <p className="text-lg font-bold">Acceso Libre</p>
                          </div>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                             <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Precisión</p>
                             <p className="text-lg font-bold">Máxima</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   {[
                     { label: 'Documentos', value: processedDocs.length, icon: 'fa-file-invoice', color: 'text-indigo-600' },
                     { label: 'IA Ready', value: '100%', icon: 'fa-check-circle', color: 'text-emerald-600' },
                     { label: 'Modo', value: 'Abierto', icon: 'fa-unlock', color: 'text-amber-500' },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                           <i className={`fas ${stat.icon} ${stat.color} opacity-20`}></i>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                     </div>
                   ))}
                </div>

                {processedDocs.length > 0 && (
                  <div className="pt-4">
                    <HistoryTable documents={processedDocs} onSelect={setSelectedDoc} />
                  </div>
                )}
              </>
            )}

            {activeTab === 'history' && (
              <HistoryTable documents={processedDocs} onSelect={setSelectedDoc} />
            )}
            
            {activeTab === 'redistribution' && <RedistributionPanel />}
          </div>
        </div>
      </main>

      <DetailModal document={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
};

export default App;
