import { GoogleGenAI, Type } from "@google/genai";
import { GenerationRequest, GenerationResult } from "../types";

// We use two models:
// 1. Flash for text reasoning/summarization/web grounding.
// 2. Nano Banana Pro (Gemini 3 Pro Image) for the final visual.

const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export const generateContent = async (request: GenerationRequest): Promise<GenerationResult> => {

  // 1. Initialize Client
  // Note: We create a new instance here to ensure we pick up the latest selected key if it changed.
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 2. Step 1: Analyze content and generate text explanation + image prompt

  const isUrl = request.sourceType === 'url';

  let basePrompt = "";

  if (isUrl) {
    basePrompt = `
      I have a URL: ${request.content}.
      Please access this URL to understand the content.
    `;
  } else {
    basePrompt = `
      I have the following text document content:
      "${request.content.slice(0, 30000)}" 
      (Truncated if too long).
    `;
  }

  basePrompt += `
    CRITICAL INSTRUCTION:
    You must generate the explanation and the image prompt STRICTLY based ONLY on the information provided in the source content (text or URL). 
    DO NOT use any external knowledge, prior training data about the topic, or assumptions.
    If the source content does not contain enough information to create a full explanation, summarize only what is present.
    The illustration description must ONLY depict concepts explicitly mentioned in the text.

    Task:
    1. Explain the MOST important informations from the source in ${request.language}. 
      a. Extract 5 to 10 important insights from the source.
      a. The explanation must be adapted to the vocabulary and conceptual understanding level of the ${request.ageRange} audience. 
      b. Keep it under 500 words.

    2. Create a detailed image generation prompt. 
      a. This prompt will be used to generate a single illustration that summarizes the key concepts mentioned in the previous insights. 
      b. The prompt should cover a maximum of the insights extracted in the previous step.
      c. The prompt should describe the visual elements, composition, and enforce the '${request.style}' style. 
      d. The text used in the illustration should be ${request.language} only. Do not use the language of the original document or web page.
      e. Ensure the visual elements described are strictly grounded in the insights extracted in the previous step.
      f. Do not simplify too much. Remember that the illustration should be informative, but adapted to the targeted audience.
  `;

  let explanation = "";
  let imagePrompt = "";
  let sources: Array<{ title: string; uri: string }> = [];

  if (isUrl) {
    // When using Google Search tool, responseMimeType: "application/json" is NOT supported.
    // We must ask for JSON in the prompt and parse the text manually.
    const prompt = basePrompt + `
      \nFORMATTING INSTRUCTION:
      Output the result in a valid JSON object. Do not include any markdown formatting or code blocks (like \`\`\`json).
      The JSON object must strictly follow this structure:
      {
        "explanation": "The age-adapted text explanation string",
        "imagePrompt": "The detailed prompt for the image generator string"
      }
    `;

    const analysisResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{ urlContext: {} }],
        // responseMimeType and responseSchema are intentionally omitted here.
      }
    });

    // 1. Parse JSON
    let text = analysisResponse.text || "";
    // Clean potential markdown code blocks if the model outputs them despite instructions
    if (text.includes("```")) {
      text = text.replace(/```(json)?/g, "").replace(/```/g, "").trim();
    }

    try {
      const json = JSON.parse(text);
      explanation = json.explanation;
      imagePrompt = json.imagePrompt;
    } catch (e) {
      console.error("JSON Parse Error on search result:", text);
      throw new Error("Failed to process the search result. The AI response was not in the expected format.");
    }

  } else {
    // For pure text input without tools, we can use responseSchema/MimeType for robust JSON output.
    const analysisResponse = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: basePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING, description: "The age-adapted text explanation." },
            imagePrompt: { type: Type.STRING, description: "The detailed prompt for the image generator." }
          },
          required: ["explanation", "imagePrompt"]
        }
      }
    });

    if (!analysisResponse.text) {
      throw new Error("Failed to generate analysis from the source material.");
    }
    const json = JSON.parse(analysisResponse.text);
    explanation = json.explanation;
    imagePrompt = json.imagePrompt;
  }

  // 2. Step 2: Generate the Image
  // Using Nano Banana Pro (gemini-3-pro-image-preview)

  const imageResponse = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { text: imagePrompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: "1K" // High quality for the Pro model
      }
    }
  });

  let imageUrl = "";

  // Iterate parts to find the image
  if (imageResponse.candidates?.[0]?.content?.parts) {
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate image from the model response.");
  }

  return {
    explanation,
    generatedPrompt: imagePrompt,
    imageUrl,
    sources
  };
};