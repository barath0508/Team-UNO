import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKeyForTask, markKeyAsRateLimited } from './apiKeyManager';

const createGenAI = () => new GoogleGenerativeAI(getApiKeyForTask('location'));

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  locality?: string;
}

export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Get location details using reverse geocoding
          const locationDetails = await reverseGeocode(latitude, longitude);
          resolve({
            latitude,
            longitude,
            ...locationDetails
          });
        } catch (error) {
          // Return basic coordinates if geocoding fails
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        reject(new Error(`Location access denied: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    // Using a free geocoding service
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    return {
      city: data.city || data.locality,
      state: data.principalSubdivision,
      country: data.countryName,
      locality: data.locality
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {};
  }
};

export const generateLocalityTasks = async (location: LocationData, userAge: number = 18) => {
  let attempts = 0;
  const maxAttempts = 4;
  
  while (attempts < maxAttempts) {
    try {
      const genAI = createGenAI();
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const locationContext = location.city || location.locality || 'your area';
    const stateContext = location.state || '';
    const countryContext = location.country || '';
    
    const prompt = `Generate 3 environmental tasks specifically for someone in ${locationContext}${stateContext ? `, ${stateContext}` : ''}${countryContext ? `, ${countryContext}` : ''}. 

User age: ${userAge} years old

Consider local environmental challenges, climate, geography, and cultural context. Tasks should be:
- Actionable and realistic for the local area
- Age-appropriate for ${userAge} year old
- Focused on real environmental issues in this region
- Include local landmarks, ecosystems, or environmental concerns if relevant

Return exactly 3 tasks in this JSON format:
[
  {
    "title": "Task title",
    "description": "Detailed description with local context",
    "points": 75,
    "difficulty": "Medium",
    "category": "waste|water|energy|nature|transport",
    "localContext": "Specific local environmental context or challenge"
  }
]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback tasks if parsing fails
      return getDefaultLocalTasks(locationContext, userAge);
    } catch (error: any) {
      attempts++;
      if (error.status === 429) {
        markKeyAsRateLimited(getApiKeyForTask('location'));
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          continue;
        }
      }
      console.error('Error generating locality tasks:', error);
      return getDefaultLocalTasks(location.city || 'your area', userAge);
    }
  }
};

const getDefaultLocalTasks = (location: string, age: number) => {
  const tasks = [
    {
      title: `Clean Up ${location} Parks`,
      description: `Organize a cleanup drive in local parks and green spaces in ${location}. Focus on removing litter and sorting recyclables.`,
      points: 75,
      difficulty: 'Easy',
      category: 'waste',
      localContext: `Help maintain the natural beauty of ${location}'s public spaces`
    },
    {
      title: 'Water Conservation Survey',
      description: `Conduct a water usage survey in your neighborhood in ${location}. Identify areas where water can be conserved.`,
      points: 100,
      difficulty: 'Medium',
      category: 'water',
      localContext: `Address local water conservation needs in ${location}`
    },
    {
      title: 'Plant Native Species',
      description: `Research and plant native species suitable for ${location}'s climate. Create a small garden or help with community planting.`,
      points: 125,
      difficulty: 'Medium',
      category: 'nature',
      localContext: `Support local biodiversity and ecosystem health in ${location}`
    }
  ];
  
  // Adjust difficulty based on age
  if (age < 16) {
    tasks.forEach(task => {
      task.difficulty = 'Easy';
      task.points = Math.max(50, task.points - 25);
    });
  }
  
  return tasks;
};