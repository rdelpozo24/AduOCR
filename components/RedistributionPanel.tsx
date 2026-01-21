
import React, { useState } from 'react';
import { DocTheme, RedistributionRule } from '../types';

const INITIAL_RULES: RedistributionRule[] = [
  { theme: DocTheme.RRHH_MODEL_1, targetAccount: 'RRHH - Gestión Interna', enabled: true },
  { theme: DocTheme.RRHH_MODEL_2, targetAccount: 'RRHH - Contratación Digital', enabled: true },
  { theme: DocTheme.REQUIREMENT, targetAccount: 'Buzón Jurídico / Plazos', enabled: true },
  { theme: DocTheme.SANCTION, targetAccount: 'Compliance / Disciplinario', enabled: true },
  { theme: DocTheme.CITATION, targetAccount: 'Agenda de Comparecencias', enabled: true },
  { theme: DocTheme.OTHER, targetAccount: 'Archivo General', enabled: false },
];

const RedistributionPanel: React.FC = () => {
  const [rules, setRules] = useState<RedistributionRule[]>(INITIAL_RULES);

  const toggleRule = (index: number) => {
    const newRules = [...rules];
    newRules[index].enabled = !newRules[index].enabled;
    setRules(newRules);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Redistribución Temática Inteligente</h2>
            <p className="text-sm text-gray-500 mt-1">Configura el destino de cada documento según su clasificación por IA.</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
            <i className="fas fa-plus mr-2"></i> Nueva Integración
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule, idx) => (
            <div key={idx} className={`flex items-center justify-between p-5 rounded-xl border transition-all ${rule.enabled ? 'border-blue-200 bg-white shadow-sm' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
                  rule.theme === DocTheme.SANCTION ? 'bg-red-100 text-red-600' : 
                  rule.theme === DocTheme.REQUIREMENT ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <i className={`fas ${
                    rule.theme === DocTheme.RRHH_MODEL_1 ? 'fa-user-tie' : 
                    rule.theme === DocTheme.CITATION ? 'fa-calendar-alt' :
                    rule.theme === DocTheme.SANCTION ? 'fa-gavel' : 'fa-file-signature'
                  }`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">{rule.theme}</h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <i className="fas fa-arrow-right text-[8px]"></i>
                    {rule.targetAccount}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleRule(idx)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-terminal text-blue-400"></i>
            Estado de Integraciones
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">SharePoint</div>
                <div className="text-xs text-amber-400 font-bold">Pendiente</div>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Azure Blob</div>
                <div className="text-xs text-amber-400 font-bold">Pendiente</div>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">ERP Connector</div>
                <div className="text-xs text-red-400 font-bold">Desconectado</div>
             </div>
             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Webhooks</div>
                <div className="text-xs text-green-400 font-bold">Activo</div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default RedistributionPanel;
