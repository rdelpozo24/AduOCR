
import { GoogleGenAI, Type } from "@google/genai";
import { DocTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const processDocumentWithAI = async (base64Data: string, fileName: string) => {
  const model = "gemini-3-flash-preview";

  // Prompt especializado para documentos administrativos españoles
  const prompt = `Analiza este documento PDF administrativo y clasifícalo estrictamente en una de estas categorías:
  
  1. "RRHH - Modelo Tipo A": Documentos internos de personal, nóminas o altas de un formato específico.
  2. "RRHH - Modelo Tipo B": Contratos de trabajo o variaciones de jornada.
  3. "Requerimiento Oficial": Peticiones formales de información de administraciones públicas o entidades externas (busca palabras como "Solicita", "Requerimiento", "Plazo").
  4. "Acuerdo de Sanción": Notificaciones de faltas, multas o expedientes disciplinarios (busca "Sanción", "Infracción", "Resolución").
  5. "Citación / Notificación": Convocatorias para comparecer o avisos judiciales/administrativos (busca "Citación", "Comparezca", "Fecha y hora").
  6. "Otros Documentos": Si no encaja en lo anterior.

  INSTRUCCIONES DE EXTRACCIÓN:
  - Extrae Nombres Completos, DNI/NIE, Números de Expediente, Fechas Límite y el Órgano Emisor.
  - Para Citaciones: Extrae obligatoriamente Fecha y Lugar de la cita.
  - Para Sanciones: Extrae el motivo de la infracción y la cuantía si existe.
  - Para RRHH: Extrae el ID de empleado y el periodo.

  Responde siempre en español y con alta precisión.`;

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
            description: "Categoría temática detectada.",
            enum: Object.values(DocTheme)
          },
          summary: {
            type: Type.STRING,
            description: "Resumen ejecutivo de 2 líneas."
          },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Nombre del campo (ej: DNI, Fecha de Cita)" },
                value: { type: Type.STRING, description: "Valor extraído" },
                confidence: { type: Type.NUMBER, description: "Nivel de confianza 0-1" }
              },
              required: ["label", "value", "confidence"]
            }
          }
        },
        required: ["theme", "summary", "fields"]
      }
    }
  });

  return JSON.parse(response.text);
};
