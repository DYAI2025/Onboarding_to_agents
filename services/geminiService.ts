import { GoogleGenAI } from "@google/genai";

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export interface SymbolConfig {
  influence: 'western' | 'balanced' | 'eastern';
  transparentBackground?: boolean;
}

export const buildSymbolPrompt = (basePrompt: string, config?: SymbolConfig): string => {
  if (!config) {
    return basePrompt;
  }

  const influenceText = config.influence === 'western' 
    ? "WEIGHTING: Prioritize Western Zodiac geometry and Solar signatures. Let the Sun sign's elemental nature dominate the visual form." 
    : config.influence === 'eastern'
    ? "WEIGHTING: Prioritize Ba Zi symbols and the Year Animal's essence. Let the eastern animalistic traits and five-element flow dominate the visual form."
    : "WEIGHTING: Achieve a perfect 50/50 equilibrium between Western geometric abstraction and Eastern organic animal symbolism.";

  return `${basePrompt}
      
      CORE DIRECTIVE:
      - System Influence: ${influenceText}
      - Background: ${config.transparentBackground ? 'PURE WHITE or TRANSPARENT background. Isolated subject.' : 'Clean, high-end editorial background.'}
      
      The result must be a singular, balanced emblem. Destiny has chosen the specific details, but the user has requested this specific weight of heritage.
      `;
};

export const generateSymbol = async (basePrompt: string, config?: SymbolConfig): Promise<string> => {
  try {
    const finalPrompt = buildSymbolPrompt(basePrompt, config);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          text: finalPrompt,
        },
      ],
    });

    const candidates = response.candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
       for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
       }
    }
    
    throw new Error("No image data generated");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return `https://picsum.photos/800/800?grayscale&blur=2`; 
  }
};
