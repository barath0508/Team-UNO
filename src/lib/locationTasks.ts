import { supabase } from './supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getCurrentLocation = (): Promise<{lat: number, lng: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

export const generateLocationTasks = async (location: string, age: number, coordinates?: {lat: number, lng: number}) => {
  // Check rate limiting - only allow one request per minute
  const lastRequestTime = localStorage.getItem('lastGeminiRequest');
  const now = Date.now();
  if (lastRequestTime && (now - parseInt(lastRequestTime)) < 60000) {
    console.log('Rate limited - using fallback tasks');
    return getFallbackTasks();
  }

  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key') {
      console.log('No valid Gemini API key - using fallback tasks');
      return getFallbackTasks();
    }

    const prompt = `Generate 3 eco-friendly tasks for a ${age}-year-old student in ${location}. ${coordinates ? `GPS: ${coordinates.lat}, ${coordinates.lng}` : ''}

Format as JSON array:
[
  {
    "title": "Task title",
    "description": "Brief description",
    "points": 25-75,
    "difficulty": "Easy|Medium|Hard",
    "category": "water|energy|waste|nature|transport",
    "localContext": "Why this task is relevant to this location"
  }
]

Consider:
- Local climate and environment
- Age-appropriate activities
- Regional environmental challenges
- Seasonal relevance`;

    localStorage.setItem('lastGeminiRequest', now.toString());

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 800 }
      })
    });

    if (response.status === 429) {
      console.log('Rate limited by Gemini API - using fallback tasks');
      return getFallbackTasks();
    }

    if (!response.ok) {
      console.log(`API error ${response.status}: ${response.statusText}`);
      throw new Error(`API failed with status ${response.status}`);
    }
    
    const data = await response.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.log('Error generating tasks:', error.message);
    console.log('Using fallback tasks');
  }
  
  return getFallbackTasks();
};

const getFallbackTasks = () => {
  return [
    {
      title: "Plant a Tree in Your Area",
      description: "Find a suitable spot and plant a sapling",
      points: 50,
      difficulty: "Medium",
      category: "nature",
      localContext: "Help green your local community"
    },
    {
      title: "Organize Neighborhood Cleanup",
      description: "Clean up a local park or street with friends",
      points: 75,
      difficulty: "Hard",
      category: "waste",
      localContext: "Keep your area clean and beautiful"
    },
    {
      title: "Start Home Composting",
      description: "Set up composting for kitchen waste",
      points: 30,
      difficulty: "Easy",
      category: "waste",
      localContext: "Reduce household waste effectively"
    }
  ];
};