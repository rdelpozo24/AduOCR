
import React, { useState, useRef } from 'react';
import { processDocumentWithAI } from '../services/geminiService.ts';
import { ProcessedDocument, DocTheme } from '../types.ts';

interface DocumentProcessorProps {
  onDocumentAdded: (doc: ProcessedDocument) => void;
}

const DocumentProcessor: React.FC<DocumentProcessorProps> = ({ onDocumentAdded }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileData, setFileData] = useState<{ base64: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError("Solo se permiten archivos PDF.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFileData({
          base64: reader.result as string,
          name: file.name
        });
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processDocument = async () => {
    if (!fileData) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processDocumentWithAI(fileData.base64, fileData.name);
      
      const newDoc: ProcessedDocument = {
        id: Math.random().toString(36).substr(2, 9),
        fileName: fileData.name,
        timestamp: new Date().toLocaleString(),
        theme: result.theme as DocTheme,
        fields: result.fields,
        summary: result.summary,
        imageUrl: fileData.base64,
      };

      onDocumentAdded(newDoc);
      setFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setError("Error de procesamiento. Verifique su API Key o conexión.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Carga de Documentos</h2>
        <p className="text-xs text-slate-400 mt-1">Sube PDFs para clasificación inmediata</p>
      </div>

      <div className="space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
            fileData ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
          }`}
        >
          {fileData ? (
            <div className="text-center">
              <i className="fas fa-file-pdf text-4xl text-red-500 mb-3"></i>
              <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{fileData.name}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setFileData(null); }}
                className="mt-3 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <i className="fas fa-cloud-upload-alt text-xl"></i>
              </div>
              <p className="text-sm font-bold text-slate-600 text-center px-4">Arrastra o haz clic para subir</p>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">Soporta: Nóminas, Sanciones, Citaciones</p>
            </>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf" />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2 animate-pulse">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <button
          onClick={processDocument}
          disabled={!fileData || isProcessing}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 transition-all flex items-center justify-center gap-3 shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>IA Leyendo Archivo...</span>
            </>
          ) : (
            <>
              <i className="fas fa-bolt text-amber-400"></i>
              <span>Analizar Documento</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentProcessor;
