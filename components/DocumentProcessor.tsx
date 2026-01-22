
import React, { useState, useRef } from 'react';
import { processDocumentWithAI } from '../services/geminiService';
import { ProcessedDocument, DocTheme } from '../types';

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
        setError("Please upload a PDF document.");
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
        imageUrl: fileData.base64, // For PDFs, we store the base64 or a blob URL
      };

      onDocumentAdded(newDoc);
      setFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
      setError("Failed to process PDF. Ensure it's not password protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">New PDF Analysis</h2>
        <div className="text-sm text-gray-500 italic">Enterprise OCR</div>
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
              <div className="w-20 h-20 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <i className="fas fa-file-pdf text-4xl"></i>
              </div>
              <div className="text-center">
                <p className="text-gray-900 font-semibold truncate max-w-[200px]">{fileData.name}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFileData(null); }}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                <i className="fas fa-file-pdf text-2xl"></i>
              </div>
              <p className="text-gray-700 font-medium">Click to upload PDF</p>
              <p className="text-gray-400 text-sm">Classic PDF documents only</p>
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
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <button
          onClick={processDocument}
          disabled={!fileData || isProcessing}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Analyzing PDF Content...
            </>
          ) : (
            <>
              <i className="fas fa-file-contract"></i>
              Analyze PDF Document
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentProcessor;
