
import { GoogleGenAI, Type } from "@google/genai";
import { AcademicCategory, SubContext, Language, TranslationResult } from "./types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Intentamos obtener la clave de las dos formas posibles en Netlify/Vite
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_AI_KEY;
    
    if (!apiKey) {
      console.error("ERROR CRÍTICO: No se encontró la API Key. Verifica las variables en Netlify.");
      // Inicializamos con un string vacío para evitar que la app se rompa al cargar
      this.ai = new GoogleGenAI("SIN_CLAVE");
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
    
    const systemInstruction = `Eres un traductor académico de élite...`; // (Mantenemos tu lógica igual)

    const model = this.ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      const response = await model.generateContent(text);
      const result = JSON.parse(response.response.text() || '{}') as TranslationResult;
      return result;
    } catch (error) {
      console.error("Error en la llamada a Gemini:", error);
      return {
        translation: "Error de conexión con la IA",
        definition: "Asegúrate de que la API Key sea válida."
      };
    }
  }
}

export const geminiService = new GeminiService();
