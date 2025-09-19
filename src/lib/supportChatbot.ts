import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBJmXRtJvn8xjGxV0XUZ8z9QY7mK5nL3pQ');

export const generateSupportResponse = async (userMessage: string, conversationHistory: any[] = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const context = `You are EcoBot, a helpful AI assistant for Green Spark, an environmental education platform. 
    You help students with:
    - Earning eco points and completing missions
    - Understanding environmental challenges and solutions
    - Technical issues with the platform
    - Learning about sustainability and climate action
    - Team collaboration and eco challenges
    
    Keep responses friendly, encouraging, and focused on environmental education. Be concise but helpful.
    If you don't know something specific about the platform, suggest contacting human support.`;
    
    const conversationContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n');
    
    const prompt = `${context}\n\nConversation history:\n${conversationContext}\n\nUser: ${userMessage}\n\nEcoBot:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Support chatbot error:', error);
    return "I'm having trouble connecting right now. Please try again or contact our support team directly for assistance!";
  }
};