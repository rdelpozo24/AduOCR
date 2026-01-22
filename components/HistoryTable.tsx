
import React from 'react';
import { ProcessedDocument, DocTheme } from '../types.ts';

interface HistoryTableProps {
  documents: ProcessedDocument[];
  onSelect: (doc: ProcessedDocument) => void;
}

const getThemeStyles = (theme: DocTheme) => {
  switch (theme) {
    case DocTheme.RRHH_MODEL_1: return { color: 'bg-emerald-100 text-emerald-700', icon: 'fa-user-tie' };
    case DocTheme.RRHH_MODEL_2: return { color: 'bg-teal-100 text-teal-700', icon: 'fa-id-badge' };
    case DocTheme.REQUIREMENT: return { color: 'bg-amber-100 text-amber-700', icon: 'fa-exclamation-triangle' };
    case DocTheme.SANCTION: return { color: 'bg-red-100 text-red-700', icon: 'fa-gavel' };
    case DocTheme.CITATION: return { color: 'bg-blue-100 text-blue-700', icon: 'fa-calendar-check' };
    default: return { color: 'bg-gray-100 text-gray-700', icon: 'fa-file-alt' };
  }
};

const HistoryTable: React.FC<HistoryTableProps> = ({ documents, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-list text-indigo-500"></i>
          Historial de Análisis
        </h3>
        <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">{documents.length} Items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-50">
            <tr>
              <th className="px-6 py-4">Fichero</th>
              <th className="px-6 py-4">Tipo Identificado</th>
              <th className="px-6 py-4">Procesado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <i className="fas fa-folder-open text-4xl mb-4"></i>
                    <p className="text-sm italic">No hay documentos procesados</p>
                  </div>
                </td>
              </tr>
            ) : (
              documents.map((doc) => {
                const styles = getThemeStyles(doc.theme);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
                          <i className={`fas ${styles.icon} text-sm`}></i>
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[140px]">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${styles.color}`}>
                        {doc.theme}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[10px] text-slate-400 font-medium">{doc.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSelect(doc)}
                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <i className="fas fa-external-link-alt text-xs"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
