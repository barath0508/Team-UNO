# Daily Tasks System with Gemini AI

## Features
- **AI-Generated Tasks**: Gemini creates unique eco-friendly tasks daily
- **Automatic Reset**: Tasks reset at 12:00 AM every day
- **One-Time Completion**: Users can complete each daily task only once
- **Point Rewards**: Earn 10-50 points per completed task
- **Categories**: Tasks span water, energy, waste, transport, and nature

## How It Works
1. **Daily Generation**: System checks for today's task, generates new one if needed
2. **Gemini Integration**: Uses Gemini API to create contextual eco-tasks
3. **User Completion**: Click "Complete Task" to earn points and mark as done
4. **Midnight Reset**: New task available at 12:00 AM automatically

## Database Setup
Run `daily-tasks-schema.sql` in Supabase:
- `daily_tasks` - Stores generated tasks by date
- `user_daily_completions` - Tracks user completions

## Task Format
```json
{
  "title": "Save Water Today",
  "description": "Take shorter showers and turn off taps",
  "points": 15,
  "category": "water"
}
```

## Implementation
- Tasks load automatically on dashboard
- Visual feedback for completed tasks
- Points awarded instantly on completion
- Fallback task if Gemini API fails