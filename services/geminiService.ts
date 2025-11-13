import { GoogleGenAI, Type } from '@google/genai';
import { ProcessedTask } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { ProcessedTask } from '../types'; // Asumo que este tipo existe

// La clave de API DEBE leerse de import.meta.env en proyectos de Vite.
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    console.error("ERROR: La clave de API (VITE_API_KEY) no está configurada.");
    throw new Error("An API Key must be set when running in a browser");
}

const ai = new GoogleGenAI({ apiKey });

// Schema ajustado para extraer los campos necesarios para la lógica JS.
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
      // Campos de materia prima que el código JS usará para la asignación
      raw_numero: {
        type: Type.STRING,
        description: "El valor original extraído de la columna 'Número'."
      },
      raw_descripcion: {
        type: Type.STRING,
        description: "El valor original extraído de la columna 'Descripción'."
      },
      raw_expediente: {
        type: Type.STRING,
        description: "El valor original extraído de la columna 'Expediente'."
      }
    },
    required: ["taskIdentifier", "warningMessage", "raw_numero", "raw_descripcion", "raw_expediente"],
  },
};

// ----------------------------------------------
// Función para Cargar la Configuración (JSON)
// ----------------------------------------------

export async function loadConfiguration(): Promise<any> {
    // Usa import.meta.env.BASE_URL para obtener la ruta base del GitHub Pages
    const configPath = import.meta.env.BASE_URL + 'config.json'; 
    try {
        const response = await fetch(configPath);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo de configuración: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error al cargar la configuración:", error);
        throw new Error("No se pudo cargar la configuración de asignación. Verifique el archivo config.json.");
    }
}

// ----------------------------------------------
// Función para Procesar el PDF (Gemini)
// ----------------------------------------------

export const processPdfText = async (text: string, config: any): Promise<any[]> => {
    
    // Extrayendo palabras clave dinámicas del JSON para el prompt de Gemini
    const descKeywords = config.palabrasClaveAdvertencia.columna_descripcion.join(', ');
    const expKeywords = config.palabrasClaveAdvertencia.columna_expediente.join(', ');

    const prompt = `
Eres un asistente experto en procesar texto extraído de documentos PDF. El texto contiene datos tabulares con 6 columnas: "fecha Entrada", "Descripción", "Fojas", "Número", "Año" y "Expediente". Tu tarea es procesar cada fila de datos siguiendo estas reglas de manera estricta:

**REGLAS DE PROCESAMIENTO GENERALES:**
1.  **Ignora completamente** las columnas "fecha Entrada" y "Fojas".
2.  Extrae los valores originales de las columnas **"Número"**, **"Año"**, **"Descripción"** y **"Expediente"**.
3.  Crea un string unificado combinando "Número/Año" para el campo 'taskIdentifier'.

**REGLAS DE ADVERTENCIAS (DINÁMICAS):**
4.  Busca una **coincidencia exacta y de palabra completa** con las siguientes frases clave (no distingue mayúsculas de minúsculas):
    * En la columna "Descripción": ${descKeywords}.
    * En la columna "Expediente": ${expKeywords}.
Es crucial que la coincidencia sea exacta
5.  Si encuentras una coincidencia, el campo 'warningMessage' debe tener el formato exacto: "- ADVERTENCIA: PALABRA CLAVE [PALABRA ENCONTRADA] ENCONTRADA". Si no hay coincidencia, debe ser un string vacío ("").

**IMPORTANTE:** No intentes asignar responsables ni crear advertencias; la aplicación lo hará con una regla numérica separada. Solo devuelve la estructura JSON solicitada.

Aquí está el texto extraído del PDF para procesar:
`;

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
    return JSON.parse(jsonString) as any[];

  } catch (error) {
    console.error("Error processing text with Gemini:", error);
    throw new Error("No se pudo procesar el texto con la IA. Verifique el formato del PDF.");
  }
};