
import React from 'react';
import { ProcessedDocument } from '../types.ts';

interface DetailModalProps {
  document: ProcessedDocument | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-800">{document.fileName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">{document.theme}</span>
              <span className="text-[10px] text-slate-400 font-bold">{document.timestamp}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-all hover:text-slate-800"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Previsualización de Origen</h3>
              <div className="aspect-[3/4] lg:aspect-auto lg:h-[600px] border border-slate-100 rounded-2xl overflow-hidden bg-slate-800 shadow-inner">
                <iframe src={document.imageUrl} className="w-full h-full border-none" title="PDF Source" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Resumen de IA</h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium italic opacity-90">
                    "{document.summary}"
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Campos Estructurados</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {document.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all">
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">{field.label}</p>
                        <p className="text-slate-800 font-bold text-xs">{field.value}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black ${field.confidence > 0.9 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {Math.round(field.confidence * 100)}%
                        </div>
                        <div className="text-[8px] text-slate-300 uppercase font-bold tracking-tighter mt-0.5">Confianza</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                  <i className="fas fa-print"></i>
                  Imprimir Certificado OCR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
