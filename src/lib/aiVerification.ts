import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBvmO5pZvVOy_5KjZ8X2qH8nF9rL3mK4pQ');

export const verifyMissionWithAI = async (
  imageBase64: string,
  missionTitle: string,
  missionDescription: string
): Promise<{ verified: boolean; confidence: number; feedback: string }> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Analyze this image to verify if it shows completion of the environmental mission: "${missionTitle}"

Mission Description: ${missionDescription}

Please evaluate:
1. Does the image show evidence of completing this specific environmental task?
2. Is the evidence clear and convincing?
3. Rate confidence level (0-100%)

Respond in JSON format:
{
  "verified": boolean,
  "confidence": number (0-100),
  "feedback": "Brief explanation of what you see and why it does/doesn't verify the mission"
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = result.response.text();
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanResponse);
    } catch {
      return {
        verified: false,
        confidence: 0,
        feedback: 'Unable to analyze image properly. Please try again with a clearer photo.'
      };
    }
  } catch (error) {
    console.error('AI verification error:', error);
    return {
      verified: false,
      confidence: 0,
      feedback: 'Verification service temporarily unavailable. Your submission will be manually reviewed.'
    };
  }
};