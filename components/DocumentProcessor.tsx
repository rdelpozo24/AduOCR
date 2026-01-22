
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
        setError("Por favor, sube un documento PDF.");
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
        fileName: result.suggestedFileName || fileData.name,
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
      setError("Error al procesar el PDF. Asegúrate de que no tenga contraseña.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Análisis Inteligente</h2>
          <p className="text-xs text-gray-400 mt-1">Sube archivos PDF. La IA extraerá el ID y los campos clave.</p>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
           <i className="fas fa-magic"></i>
        </div>
      </div>

      <div className="space-y-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
            fileData ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          {fileData ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-red-600 shadow-sm">
                <i className="fas fa-file-pdf text-3xl"></i>
              </div>
              <div className="text-center">
                <p className="text-gray-900 text-sm font-semibold truncate max-w-[200px]">{fileData.name}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFileData(null); }}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Quitar archivo
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <i className="fas fa-cloud-upload-alt text-2xl"></i>
              </div>
              <p className="text-gray-700 font-medium text-sm">Arrastra o haz clic para subir</p>
              <p className="text-gray-400 text-[10px] mt-1 italic">La IA renombrará el archivo automáticamente</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="application/pdf"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button
          onClick={processDocument}
          disabled={!fileData || isProcessing}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Identificando Campos e ID...
            </>
          ) : (
            <>
              <i className="fas fa-microchip"></i>
              Procesar Documento
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentProcessor;
