
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const REMOTE_ENGINE_URL = 'https://baziengine-v2.fly.dev';

export interface SymbolConfig {
  influence: 'western' | 'balanced' | 'eastern';
  transparentBackground?: boolean;
}

export const generateSymbol = async (basePrompt: string, config?: SymbolConfig): Promise<string> => {
  // 1. Attempt Instant Remote Generation (BaziEngine v2)
  try {
    console.log(`[SymbolService] Requesting instant symbol from ${REMOTE_ENGINE_URL}...`);
    
    // Construct simplified payload for the remote engine
    const payload = {
      prompt: basePrompt,
      style: config?.influence || 'balanced',
      mode: config?.transparentBackground ? 'transparent' : 'cinematic'
    };

    const response = await fetch(`${REMOTE_ENGINE_URL}/api/symbol`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify(payload),
      // Set a timeout to fallback quickly if the specialized engine is sleeping
      signal: AbortSignal.timeout(8000) 
    });

    if (response.ok) {
      const data = await response.json();
      if (data.imageUrl) {
        console.log("✅ Instant symbol received from remote engine.");
        return data.imageUrl;
      }
    } else {
      console.warn(`⚠️ Remote engine returned ${response.status}. Switching to local GenAI.`);
    }
  } catch (error) {
    console.warn("❌ Remote engine unreachable or timed out. Falling back to direct Gemini connection.", error);
  }

  // 2. Fallback: Local Client-Side GenAI (Google Gemini)
  try {
    let finalPrompt = basePrompt;
    
    if (config) {
      const influenceText = config.influence === 'western' 
        ? "WEIGHTING: Prioritize Western Zodiac geometry and Solar signatures. Let the Sun sign's elemental nature dominate the visual form." 
        : config.influence === 'eastern'
        ? "WEIGHTING: Prioritize Ba Zi symbols and the Year Animal's essence. Let the eastern animalistic traits and five-element flow dominate the visual form."
        : "WEIGHTING: Achieve a perfect 50/50 equilibrium between Western geometric abstraction and Eastern organic animal symbolism.";

      finalPrompt += `
      
      CORE DIRECTIVE:
      - System Influence: ${influenceText}
      - Background: ${config.transparentBackground ? 'PURE WHITE or TRANSPARENT background. Isolated subject.' : 'Clean, high-end editorial background.'}
      
      The result must be a singular, balanced emblem. Destiny has chosen the specific details, but the user has requested this specific weight of heritage.
      `;
    }

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
