
import React from 'react';
import { ProcessedDocument } from '../types';

interface DetailModalProps {
  document: ProcessedDocument | null;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{document.fileName}</h2>
            <p className="text-sm text-gray-500">Processed on {document.timestamp}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
            {/* Left: PDF Viewer (Iframe) */}
            <div className="lg:col-span-7 space-y-4 flex flex-col h-[600px] lg:h-auto">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">PDF Document Source</h3>
              <div className="flex-1 border border-gray-200 rounded-xl overflow-hidden bg-gray-800 shadow-inner">
                <iframe 
                  src={document.imageUrl} 
                  className="w-full h-full border-none"
                  title="PDF Source"
                />
              </div>
            </div>

            {/* Right: Extracted Data */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">AI Summary</h4>
                <p className="text-sm text-blue-700 leading-relaxed italic">
                  "{document.summary}"
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Classification</h3>
                <div className="flex items-center gap-2">
                   <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">
                    {document.theme}
                   </span>
                   <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                     <i className="fas fa-check-circle"></i>
                     Routing Active
                   </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Extracted Data Fields</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {document.fields.map((field, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:border-blue-200 transition-all">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{field.label}</p>
                        <p className="text-gray-800 font-medium text-sm">{field.value}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold ${field.confidence > 0.9 ? 'text-green-600' : 'text-orange-500'}`}>
                          {Math.round(field.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="p-4 bg-gray-900 rounded-xl text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Target Redistribution Status</span>
                    <i className="fas fa-route text-blue-500"></i>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <i className="fas fa-check text-[10px] text-blue-400"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold">Theme Identified</p>
                        <p className="text-[10px] text-gray-500">{document.theme}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <i className="fas fa-clock text-[10px] text-gray-400"></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold">Queue for Distribution</p>
                        <p className="text-[10px] text-gray-500">Waiting for account config</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
