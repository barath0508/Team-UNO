import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'placeholder-key');

export const generateLocationBasedTask = async (location: string, userLevel: number) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Create an environmental challenge for a Level ${userLevel} user in ${location}, India. 
    The task should be:
    - Specific to local environmental issues in ${location}
    - Age-appropriate for students
    - Actionable within 1-7 days
    - Award 25-100 points based on difficulty
    
    Return JSON format:
    {
      "title": "Task title",
      "description": "Detailed description",
      "points": number,
      "difficulty": "Easy|Medium|Hard",
      "category": "water|waste|energy|air|biodiversity",
      "localContext": "Why this matters in ${location}"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API error:', error);
    return getDefaultTask(location);
  }
};

const getDefaultTask = (location: string) => ({
  title: `Clean Water Initiative - ${location}`,
  description: `Organize a water conservation drive in your locality. Document water wastage sources and create awareness posters.`,
  points: 50,
  difficulty: 'Medium',
  category: 'water',
  localContext: `Water conservation is crucial for sustainable development in ${location}.`
});