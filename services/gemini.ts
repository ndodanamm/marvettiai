
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStageSummary = async (stageName: string, data: any) => {
  const ai = getAI();
  const prompt = `
    You are MARVETTI.AI Operational Assistant.
    Generate a professional HTML status report for a South African business client.
    Stage: ${stageName}
    Submission Data: ${JSON.stringify(data)}
    
    Format Rules:
    - Use Tailwind CSS classes.
    - Style: High-tech, clean, minimalist.
    - Section 1: Overview of submitted data.
    - Section 2: Compliance Checklist (UIF, Banking, CIPC).
    - Section 3: Next Actions (Pointing to Stage 2: Logo Design).
    - Tone: Reassuring and professional.
    - Use ZAR (R) currency symbols.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Summary generated. Refreshing dashboard...";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "<p>Summary sync delayed. Data saved locally.</p>";
  }
};

export const generateWhatsAppDraft = async (stageName: string, clientName: string) => {
  const ai = getAI();
  const prompt = `
    Draft a concise WhatsApp message from MARVETTI.AI to ${clientName}.
    They just completed ${stageName}.
    Inform them:
    1. Data received and being processed by the team.
    2. They can now proceed to Stage 2 (Logo Creation) in their dashboard.
    3. Include a support number link.
    Keep it friendly, South African vibe, but professional.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || `Hi ${clientName}, we've received your ${stageName} details! Your dashboard is updated. Next step: Stage 2 - Logo Creation. Chat soon!`;
  } catch {
    return `Hi ${clientName}, we've received your ${stageName} details! Next step: Stage 2.`;
  }
};

export const generateLogoPreview = async (businessName: string, niche: string, customInstructions?: string) => {
  const ai = getAI();
  try {
    const prompt = `A professional, high-end, minimalist business logo for a company named '${businessName}' in the ${niche} industry. 
    Colors: South African Red (#EC1B23) and Deep Navy (#020617). 
    Style: Modern vector graphic, clean, no shadows, professional typography.
    ${customInstructions ? `Specific Client Refinement Request: ${customInstructions}` : 'Iconic mark + wordmark balance.'}
    Place on a solid minimalist background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Logo generation error:", error);
    return null;
  }
};
