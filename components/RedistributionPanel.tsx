
import React, { useState } from 'react';
import { DocTheme, RedistributionRule } from '../types.ts';

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
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Enrutado Inteligente</h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Define el destino automático según la clasificación por IA.</p>
          </div>
          <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <i className="fas fa-plus mr-2"></i> Nuevo Destino
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, idx) => (
            <div key={idx} className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${rule.enabled ? 'border-slate-900 bg-white shadow-md' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
              <div className="flex items-center gap-4 overflow-hidden">
                <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg ${
                  rule.theme === DocTheme.SANCTION ? 'bg-red-50 text-red-500' : 
                  rule.theme === DocTheme.REQUIREMENT ? 'bg-amber-50 text-amber-500' :
                  'bg-indigo-50 text-indigo-500'
                }`}>
                  <i className={`fas ${
                    rule.theme === DocTheme.RRHH_MODEL_1 ? 'fa-user-tie' : 
                    rule.theme === DocTheme.CITATION ? 'fa-calendar-alt' :
                    rule.theme === DocTheme.SANCTION ? 'fa-gavel' : 'fa-file-signature'
                  }`}></i>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest truncate">{rule.theme}</h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <i className="fas fa-share-alt text-[8px] text-indigo-400"></i>
                    {rule.targetAccount}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => toggleRule(idx)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled ? 'bg-slate-900' : 'bg-slate-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedistributionPanel;
