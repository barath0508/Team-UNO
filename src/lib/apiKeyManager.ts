// Task-specific API key assignment
const TASK_API_KEYS = {
  quiz: import.meta.env.VITE_GEMINI_API_KEY,
  location: import.meta.env.VITE_GEMINI_API_KEY_2, 
  support: import.meta.env.VITE_GEMINI_API_KEY_3
};

type TaskType = 'quiz' | 'location' | 'support';

const keyUsageCount: { [key: string]: number } = {};
const keyLastUsed: { [key: string]: number } = {};

export const getApiKeyForTask = (taskType: TaskType): string => {
  const apiKey = TASK_API_KEYS[taskType];
  const now = Date.now();
  
  // Reset usage count every hour
  if (keyLastUsed[apiKey] && now - keyLastUsed[apiKey] > 3600000) {
    keyUsageCount[apiKey] = 0;
  }
  
  // Update usage tracking
  keyUsageCount[apiKey] = (keyUsageCount[apiKey] || 0) + 1;
  keyLastUsed[apiKey] = now;
  
  return apiKey;
};

export const getNextApiKey = (): string => {
  return getApiKeyForTask('quiz');
};

export const markKeyAsRateLimited = (apiKey: string) => {
  keyUsageCount[apiKey] = (keyUsageCount[apiKey] || 0) + 100;
  keyLastUsed[apiKey] = Date.now();
};

export const getApiKeyWithFallback = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || getApiKeyForTask('quiz');
};

// Environment variables needed:
// VITE_GEMINI_API_KEY - Key 1 for quiz tasks
// VITE_GEMINI_API_KEY_2 - Key 2 for location tasks  
// VITE_GEMINI_API_KEY_3 - Key 3 for support tasks