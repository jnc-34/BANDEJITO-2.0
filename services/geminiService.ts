import { GoogleGenAI, Type } from '@google/genai';
import { ProcessedTask } from '../types';

// Fix: Initialize GoogleGenAI with API_KEY from process.env as per guidelines.
// This resolves the TypeScript error for `import.meta.env` and aligns with the coding standards.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prompt = `
Eres un asistente experto en procesar texto extraído de documentos PDF. El texto contiene datos tabulares con 6 columnas, aunque el formato del texto puede no ser perfecto. Las columnas son: "fecha Entrada", "Descripción", "Fojas", "Número", "Año" y "Expediente". Tu tarea es procesar cada fila de datos siguiendo estas reglas de manera estricta:

1.  **Ignora completamente** las columnas "fecha Entrada" y "Fojas".
2.  Para cada fila, extrae el valor de la columna "Número" y el valor de la columna "Año".
3.  Crea un string unificado combinando estos dos valores con el formato "Número/Año".
4.  En la columna "Descripción" de la misma fila, busca una **coincidencia exacta y de palabra completa** con una de las siguientes frases clave (no distingue mayúsculas de minúsculas): "urgente", "pronto despacho", "cautelar", "confronte". Es crucial que la coincidencia sea exacta; por ejemplo, la palabra "Comprobante" NO debe coincidir con "confronte".
5.  En la columna "Expediente" de la misma fila, busca una **coincidencia exacta y de palabra completa** con la palabra clave "beneficio" (no distingue mayúsculas de minúsculas).
6.  Si encuentras una coincidencia exacta de **cualquiera** de las palabras clave mencionadas en los pasos 4 o 5, crea un mensaje de advertencia con el formato exacto: "- ADVERTENCIA: PALABRA CLAVE [PALABRA ENCONTRADA] ENCONTRADA". Debes usar la palabra clave encontrada, en mayúsculas.
7.  Si no encuentras ninguna coincidencia exacta de las palabras clave en una fila, el campo de advertencia debe ser un string vacío (""). No inventes advertencias.

Devuelve el resultado como un array de objetos JSON, sin ninguna otra explicación o texto adicional.

Aquí está el texto extraído del PDF para procesar:
`;

const schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      taskIdentifier: {
        type: Type.STRING,
        description: "El string combinado con el formato 'Número/Año'.",
      },
      warningMessage: {
        type: Type.STRING,
        description: "El mensaje de advertencia si se encuentra una palabra clave, o un string vacío si no se encuentra.",
      },
    },
    required: ["taskIdentifier", "warningMessage"],
  },
};

export const processPdfText = async (text: string): Promise<ProcessedTask[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}\n\n${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (!Array.isArray(result)) {
        throw new Error("La respuesta de Gemini no es un array válido.");
    }

    return result as ProcessedTask[];
  } catch (error) {
    console.error("Error processing text with Gemini:", error);
    throw new Error("No se pudo procesar el texto con la IA. Verifique el formato del PDF.");
  }
};
