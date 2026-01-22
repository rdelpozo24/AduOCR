
import { GoogleGenAI, Type } from "@google/genai";
import { DocTheme } from "../types";

export const processDocumentWithAI = async (base64Data: string, fileName: string) => {
  // Inicialización dentro de la función para asegurar el uso de la clave más reciente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `Eres un experto en gestión documental y OCR avanzado para administración española. 
  Tu objetivo es analizar el PDF proporcionado y clasificarlo con precisión quirúrgica.

  CATEGORÍAS DISPONIBLES (Clasifica SOLO en una):
  1. "RRHH - Modelo Tipo A": Nóminas, recibos de salarios, justificantes de alta/baja en la Seguridad Social (IDC), o certificados de retenciones.
  2. "RRHH - Modelo Tipo B": Contratos de trabajo, anexos contractuales, acuerdos de teletrabajo o variaciones de jornada.
  3. "Requerimiento Oficial": Notificaciones de la AEAT, TGSS o Inspección de Trabajo que solicitan documentación. Palabras clave: "REQUERIMIENTO", "PLAZO DE", "HECHOS", "SOLICITA".
  4. "Acuerdo de Sanción": Resoluciones de multas, actas de infracción o expedientes disciplinarios. Palabras clave: "SANCIÓN", "INFRACCIÓN", "CUANTÍA", "MULTA", "RESOLUCIÓN".
  5. "Citación / Notificación": Convocatorias para comparecer ante juzgados, el SMAC o inspecciones. Palabras clave: "CITA", "COMPAREZCA", "VISTA", "AUDIENCIA", "FECHA Y HORA".
  6. "Otros Documentos": Cualquier documento que no encaje en las categorías anteriores.

  INSTRUCCIONES DE EXTRACCIÓN:
  - Extrae siempre: Emisor (Organismo o Empresa), ID/Expediente y Fecha del documento.
  - Para Sanciones: Extrae "Cuantía Económica" y "Motivo de la infracción".
  - Para Citaciones: Extrae "Fecha de Cita", "Hora" y "Lugar/Sede".
  - Para Requerimientos: Extrae "Plazo de contestación" (ej: 10 días).
  - Para RRHH: Extrae "Nombre del Empleado" y "DNI/NIE".

  Analiza el texto completo antes de decidir. Responde estrictamente en JSON.`;

  const pdfPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: base64Data.split(',')[1] || base64Data,
    },
  };

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [pdfPart, { text: systemInstruction }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: {
            type: Type.STRING,
            description: "Categoría temática exacta según las opciones dadas.",
            enum: Object.values(DocTheme)
          },
          summary: {
            type: Type.STRING,
            description: "Resumen técnico de 2 líneas."
          },
          fields: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Etiqueta del campo extraído" },
                value: { type: Type.STRING, description: "Valor extraído del texto" },
                confidence: { type: Type.NUMBER, description: "Confianza de 0 a 1" }
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
