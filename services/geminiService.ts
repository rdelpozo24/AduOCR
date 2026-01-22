
import { GoogleGenAI, Type } from "@google/genai";
import { DocTheme } from "../types.ts";

export const processDocumentWithAI = async (base64Data: string, fileName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `Eres un analista OCR experto en documentación administrativa y legal española.
  Tu misión es analizar el archivo proporcionado y devolver un JSON estructurado.

  CLASIFICACIÓN (theme):
  - "RRHH - Modelo Tipo A": Nóminas, pagos de salarios o liquidaciones.
  - "RRHH - Modelo Tipo B": Contratos de trabajo, anexos o pactos de confidencialidad.
  - "Requerimiento Oficial": Cartas de AEAT (Hacienda), Seguridad Social o Tráfico.
  - "Acuerdo de Sanción": Multas, infracciones o expedientes disciplinarios.
  - "Citación / Notificación": Avisos de juzgados o comparecencias.
  - "Otros Documentos": Si no encaja en lo anterior.

  EXTRACCIÓN DE CAMPOS (fields):
  Extrae siempre al menos 5 campos clave. Ejemplos según tipo:
  - Nómina: DNI, Empresa, Periodo, Base Cotización, Importe Neto.
  - Sanción: ID Expediente, Importe Multa, Fecha Infracción, Artículo, Órgano.
  - Requerimiento: CSV (Código Seguro Verificación), Plazo, Motivo, Remitente.

  EL JSON DEBE TENER ESTA ESTRUCTURA:
  {
    "theme": "CATEGORIA_DETECTADA",
    "summary": "Resumen ejecutivo de 150 caracteres",
    "fields": [
      { "label": "Nombre del Campo", "value": "Valor Extraído", "confidence": 0.95 }
    ]
  }`;

  const pdfPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: base64Data.includes(',') ? base64Data.split(',')[1] : base64Data,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [pdfPart, { text: systemInstruction }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING },
            summary: { type: Type.STRING },
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
          required: ["theme", "summary", "fields"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
