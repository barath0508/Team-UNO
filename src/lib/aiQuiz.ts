import { getApiKeyForTask, markKeyAsRateLimited } from './apiKeyManager';

export const generateQuiz = async (age: number) => {
  let attempts = 0;
  const maxAttempts = 4;
  
  while (attempts < maxAttempts) {
    try {
      const apiKey = getApiKeyForTask('quiz');
      const prompt = `Generate an environmental quiz for a ${age}-year-old. Format as JSON:
{
  "title": "Quiz title",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Create 5 age-appropriate questions about:
- Climate change
- Recycling
- Water conservation
- Energy saving
- Wildlife protection

Age guidelines:
- 8-12: Simple concepts, fun facts
- 13-17: Deeper understanding, solutions
- 18+: Complex issues, policy, science`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        })
      });

      if (response.status === 429) {
        markKeyAsRateLimited(apiKey);
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
        throw new Error('Rate limited');
      }

      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      break;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        console.log('Using fallback quiz');
        break;
      }
    }
  }
  
  // Fallback quiz
  return {
    title: "Environmental Basics",
    questions: [
      {
        question: "What is the main cause of climate change?",
        options: ["Solar flares", "Greenhouse gases", "Ocean currents", "Volcanic activity"],
        correct: 1,
        explanation: "Greenhouse gases trap heat in Earth's atmosphere, causing global warming."
      },
      {
        question: "Which material takes the longest to decompose?",
        options: ["Paper", "Plastic", "Glass", "Food waste"],
        correct: 2,
        explanation: "Glass can take over 1 million years to decompose naturally."
      }
    ]
  };
};

export const generateLearningContent = async (age: number, topic: string) => {
  let attempts = 0;
  const maxAttempts = 4;
  
  while (attempts < maxAttempts) {
    try {
      const apiKey = getApiKeyForTask('quiz');
      const prompt = `Create educational content about ${topic} for a ${age}-year-old. Format as JSON:
{
  "title": "Content title",
  "content": "Educational content (200-300 words)",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "funFact": "Interesting fact",
  "actionTip": "What they can do"
}

Make it age-appropriate and engaging.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 600 }
        })
      });

      if (response.status === 429) {
        markKeyAsRateLimited(apiKey);
        attempts++;
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
        throw new Error('Rate limited');
      }

      if (!response.ok) throw new Error('API failed');
      
      const data = await response.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const text = data.candidates[0].content.parts[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
      break;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        console.log('Using fallback content');
        break;
      }
    }
  }
  
  return {
    title: "Climate Change Basics",
    content: "Climate change refers to long-term changes in global temperatures and weather patterns. While some climate change is natural, human activities have been the main driver since the 1800s.",
    keyPoints: ["Caused by greenhouse gases", "Affects weather patterns", "Can be reduced by clean energy"],
    funFact: "The last decade was the warmest on record!",
    actionTip: "Use renewable energy and reduce waste to help fight climate change."
  };
};