
import { GoogleGenAI, Type } from "@google/genai";
import { DocTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processDocumentWithAI = async (base64Data: string, fileName: string) => {
  const model = "gemini-3-flash-preview";

  const prompt = `Analiza este documento PDF administrativo y clasifícalo en una de estas categorías:
  
  Categorías: ${Object.values(DocTheme).join(', ')}.

  TAREA CRÍTICA DE RENOMBRADO:
  1. Busca dentro del texto el "Número de Expediente", "Referencia", "ID de Documento" o "Número de Identificación".
  2. Genera un nombre de archivo sugerido (suggestedFileName) siguiendo este formato: [TIPO_SIMPLIFICADO]_[REFERENCIA].pdf
     - Ejemplo: SAN_2023_445.pdf, CIT_99822.pdf, RRHH_MODELOA_01.pdf
  3. Si no encuentras una referencia clara, usa el nombre original pero límpialo de caracteres extraños.

  INSTRUCCIONES DE EXTRACCIÓN:
  - Extrae Nombres, DNI, Fechas Límite y Órgano Emisor.
  - Para Citaciones: Fecha y Lugar obligatorios.
  - Para Sanciones: Motivo e importe.

  Responde estrictamente en JSON en español.`;

  const pdfPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: base64Data.split(',')[1] || base64Data,
    },
  };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [pdfPart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: {
            type: Type.STRING,
            enum: Object.values(DocTheme)
          },
          suggestedFileName: {
            type: Type.STRING,
            description: "Nombre de archivo legible basado en el ID encontrado en el documento."
          },
          summary: {
            type: Type.STRING
          },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                confidence: { type: Type.NUMBER }
              },
              required: ["label", "value", "confidence"]
            }
          }
        },
        required: ["theme", "suggestedFileName", "summary", "fields"]
      }
    }
  });

  return JSON.parse(response.text);
};
