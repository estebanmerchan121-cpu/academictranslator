
import { GoogleGenAI, Type } from "@google/genai";
// Cambiamos "../types" por "./types" porque el archivo está en la misma carpeta
import { AcademicCategory, SubContext, Language, TranslationResult } from "./types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Obtenemos la llave de las variables de entorno de Vite
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // Verificación de seguridad para que no se rompa la app si no hay llave
    if (!apiKey) {
      console.error("Error: VITE_GEMINI_API_KEY no está configurada en Netlify");
      this.ai = new GoogleGenAI("NO_KEY"); 
    } else {
      this.ai = new GoogleGenAI(apiKey);
    }
  }

  async translateAcademic(
    text: string, 
    category: AcademicCategory, 
    subContext: SubContext, 
    targetLanguage: Language
  ): Promise<TranslationResult> {
    const isLongText = text.trim().length > 60 || text.trim().split(/\s+/).length > 8;

    const systemInstruction = `Eres un traductor académico de élite especializado en el área de ${category.label}, con enfoque en ${subContext.label} (${subContext.group}). 
    Tu objetivo es traducir al idioma: ${targetLanguage.name}.

    MODO DE RESPUESTA:
    ${isLongText 
      ? `El texto es largo. Debes:
          1. Traducir el texto completo con precisión académica.
          2. Identificar hasta 5 "términos clave" (keyTerms) técnicos dentro del texto.
          3. Proporcionar una definición técnica de máximo 2 líneas para cada término clave en ${targetLanguage.name}.`
      : `El texto es corto (palabra/frase). Debes:
          1. Proporcionar la traducción exacta.
          2. Proporcionar una definición técnica (definition) de máximo 2 líneas en ${targetLanguage.name}.`
    }

    REGLAS CRÍTICAS:
    - Usa terminología profesional de ${subContext.label}.
    - La respuesta DEBE ser un objeto JSON válido que cumpla estrictamente el esquema.
    - No incluyas texto fuera del JSON.`;

    const response = await this.ai.getGenerativeModel({
      model: 'gemini-1.5-flash', // He actualizado el nombre del modelo a uno estable
    }).generateContent({
      contents: [{ role: 'user', parts: [{ text: `Texto a procesar para un profesional de ${subContext.label} en ${targetLanguage.name}: "${text}"` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        // @ts-ignore
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translation: { type: Type.STRING },
            definition: { type: Type.STRING },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                },
                required: ["term", "definition"],
              },
            },
          },
          required: ["translation"],
        },
      },
    });

    try {
      const result = JSON.parse(response.response.text() || '{}') as TranslationResult;
      return result;
    } catch (error) {
      console.error("Failed to parse Gemini response", error);
      return {
        translation: "Error de traducción",
        definition: "No se pudo generar una respuesta contextualizada."
      };
    }
  }
}

export const geminiService = new GeminiService();
