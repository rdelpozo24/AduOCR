
import React from 'react';
import { ProcessedDocument, DocTheme } from '../types';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Historial de Procesamiento</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{documents.length} Documentos</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Documento</th>
              <th className="px-6 py-4">Tipo / Temática</th>
              <th className="px-6 py-4">Fecha Análisis</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                  No hay documentos procesados. Sube un PDF para comenzar.
                </td>
              </tr>
            ) : (
              documents.map((doc) => {
                const styles = getThemeStyles(doc.theme);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                          <i className={`fas ${styles.icon}`}></i>
                        </div>
                        <span className="font-medium text-gray-700 truncate max-w-[150px]">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles.color}`}>
                        {doc.theme}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doc.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Clasificado
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSelect(doc)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase transition-colors"
                      >
                        Ver Detalle
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
