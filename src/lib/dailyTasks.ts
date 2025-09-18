import { supabase } from './supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateDailyTask = async () => {
  try {
    const prompt = `Generate a single eco-friendly daily task for students. Format as JSON:
    {
      "title": "Short task title",
      "description": "Brief description (max 100 chars)",
      "points": 15,
      "category": "water"
    }`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 200
        }
      })
    });

    if (!response.ok) throw new Error('API failed');
    
    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.log('Using fallback task');
  }
  
  // Fallback task
  return {
    title: "Save Water Today",
    description: "Take shorter showers and turn off taps while brushing teeth",
    points: 15,
    category: "water"
  };
};

export const getTodayTask = async () => {
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `daily_task_${today}`;
  
  // Check localStorage first
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored);
  }

  // Generate new task for today
  const task = await generateDailyTask();
  const taskWithId = { ...task, id: `task_${today}`, date: today };
  
  // Store in localStorage
  localStorage.setItem(storageKey, JSON.stringify(taskWithId));
  
  return taskWithId;
};