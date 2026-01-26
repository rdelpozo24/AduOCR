
import React, { useState } from 'react';
import { DocTheme, RedistributionRule } from '../types';

const INITIAL_RULES: RedistributionRule[] = [
  { 
    id: '1',
    name: 'Nóminas y Seguros Sociales', 
    theme: DocTheme.RRHH_MODEL_1, 
    targetEmail: 'nominas@empresa.com',
    keywords: ['TC1', 'Seguridad Social', 'Recibo de Salarios'],
    enabled: true 
  },
  { 
    id: '2', 
    name: 'Sanciones de Tráfico', 
    theme: DocTheme.SANCTION, 
    targetEmail: 'legal@empresa.com',
    keywords: ['DGT', 'Multa', 'Exceso Velocidad', 'Matrícula'],
    enabled: true 
  },
];

const RedistributionPanel: React.FC = () => {
  const [rules, setRules] = useState<RedistributionRule[]>(INITIAL_RULES);
  const [keywordInputs, setKeywordInputs] = useState<{[key: string]: string}>({});

  // Gestión de Reglas
  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const addNewRule = () => {
    const newRule: RedistributionRule = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nueva Regla de Enrutamiento',
      theme: DocTheme.OTHER,
      targetEmail: '',
      keywords: [],
      enabled: false
    };
    setRules([newRule, ...rules]);
  };

  const updateRuleField = (id: string, field: keyof RedistributionRule, value: any) => {
    setRules(rules.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Gestión de Keywords
  const handleKeywordInputChange = (ruleId: string, value: string) => {
    setKeywordInputs({ ...keywordInputs, [ruleId]: value });
  };

  const addKeyword = (ruleId: string) => {
    const value = keywordInputs[ruleId]?.trim();
    if (!value) return;

    setRules(rules.map(r => {
      if (r.id === ruleId && !r.keywords.includes(value)) {
        return { ...r, keywords: [...r.keywords, value] };
      }
      return r;
    }));
    
    setKeywordInputs({ ...keywordInputs, [ruleId]: '' });
  };

  const removeKeyword = (ruleId: string, keywordToRemove: string) => {
    setRules(rules.map(r => {
      if (r.id === ruleId) {
        return { ...r, keywords: r.keywords.filter(k => k !== keywordToRemove) };
      }
      return r;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, ruleId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(ruleId);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Reglas de Correo Inteligente</h2>
          <p className="text-slate-500 mt-1">Configura palabras clave para reenviar documentos automáticamente a los departamentos correspondientes.</p>
        </div>
        <button 
          onClick={addNewRule}
          className="bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i> Nueva Regla
        </button>
      </div>

      <div className="grid gap-6">
        {rules.map((rule) => (
          <div 
            key={rule.id} 
            className={`group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
              rule.enabled ? 'border-slate-200 shadow-sm hover:shadow-md' : 'border-slate-100 bg-slate-50 opacity-75'
            }`}
          >
            {/* Header de la Regla */}
            <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm ${rule.enabled ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                  <i className="fas fa-robot"></i>
                </div>
                <input 
                  type="text" 
                  value={rule.name}
                  onChange={(e) => updateRuleField(rule.id, 'name', e.target.value)}
                  className="bg-transparent font-bold text-slate-700 focus:outline-none focus:border-b-2 focus:border-indigo-500 w-full max-w-md px-2 py-1"
                  placeholder="Nombre de la regla..."
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400">{rule.enabled ? 'Activo' : 'Pausado'}</span>
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rule.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${rule.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <button 
                  onClick={() => deleteRule(rule.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2"
                  title="Eliminar regla"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            {/* Contenido de Configuración */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Destino y Tipo */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Destinatario (Email del Departamento)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-slate-400"></i>
                    </div>
                    <input 
                      type="email"
                      value={rule.targetEmail}
                      onChange={(e) => updateRuleField(rule.id, 'targetEmail', e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-slate-300"
                      placeholder="ejemplo@empresa.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2">Tipo de Documento Base</label>
                  <div className="relative">
                    <select 
                      value={rule.theme}
                      onChange={(e) => updateRuleField(rule.id, 'theme', e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      {Object.values(DocTheme).map(theme => (
                        <option key={theme} value={theme}>{theme}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-slate-400 text-xs mr-2"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Keywords */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 flex justify-between">
                  <span>Palabras Clave (Triggers)</span>
                  <span className="text-indigo-500">{rule.keywords.length} activas</span>
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text"
                    value={keywordInputs[rule.id] || ''}
                    onChange={(e) => handleKeywordInputChange(rule.id, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rule.id)}
                    className="flex-1 min-w-0 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Escribe y pulsa Enter..."
                  />
                  <button 
                    onClick={() => addKeyword(rule.id)}
                    className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 font-bold text-sm transition-colors"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                  {rule.keywords.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">Sin palabras clave definidas.</p>
                  ) : (
                    rule.keywords.map((keyword, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm">
                        {keyword}
                        <button 
                          onClick={() => removeKeyword(rule.id, keyword)}
                          className="ml-2 text-slate-400 hover:text-red-500 focus:outline-none"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>
            
            {/* Footer de Regla */}
            {rule.enabled && rule.targetEmail && (
               <div className="bg-emerald-50/50 px-6 py-2 border-t border-emerald-100 flex items-center gap-2">
                 <i className="fas fa-check-circle text-emerald-500 text-xs"></i>
                 <p className="text-xs text-emerald-700 font-medium">
                   Configuración válida: Se enviará correo a <b>{rule.targetEmail}</b> si se detectan coincidencias.
                 </p>
               </div>
            )}
          </div>
        ))}

        {rules.length === 0 && (
          <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <i className="fas fa-wind text-4xl text-slate-300 mb-4"></i>
            <p className="text-slate-500 font-medium">No hay reglas definidas.</p>
            <button onClick={addNewRule} className="mt-4 text-indigo-600 font-bold text-sm hover:underline">Crear la primera regla</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RedistributionPanel;
