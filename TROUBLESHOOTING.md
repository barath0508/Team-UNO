# Troubleshooting Guide

## Issues Fixed

### 1. 406 Not Acceptable Error (Supabase)
**Problem**: Malformed queries to the profiles table
**Solution**: 
- Added proper error handling in database queries
- Updated schema with proper constraints and defaults
- Added connection retry logic

### 2. 429 Too Many Requests (Gemini API)
**Problem**: Rate limiting on Gemini API calls
**Solution**:
- Added rate limiting (1 request per minute)
- Implemented fallback tasks when API fails
- Better error handling for API responses

### 3. ERR_INTERNET_DISCONNECTED
**Problem**: Network connectivity issues
**Solution**:
- Added offline detection
- Implemented cached/offline tasks
- Graceful degradation when services are unavailable

## Quick Fixes

### Step 1: Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-schema.sql`
4. Verify tables are created properly

### Step 2: Environment Variables
Ensure your `.env` file has valid credentials:
```
VITE_SUPABASE_URL=https://ywbnkqazberytnfixlls.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
```

### Step 3: Test Connection
Run the database test script:
```bash
node fix-database.js
```

### Step 4: Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

## Error Prevention

### Rate Limiting
- Gemini API calls are now limited to 1 per minute
- Fallback tasks are used when API is unavailable

### Offline Support
- App detects when offline
- Uses cached tasks and localStorage data
- Graceful degradation of features

### Database Resilience
- Added retry logic for failed requests
- Better error messages and logging
- Fallback to localStorage when database unavailable

## Monitoring

Check browser console for these messages:
- ✅ "Connection successful" - Database working
- ⚠️ "Using fallback tasks" - API rate limited
- 🔄 "Offline - using cached tasks" - No internet
- ❌ "Database query error" - Check Supabase setup

## Common Solutions

1. **No tasks loading**: Check internet connection and Supabase credentials
2. **API errors**: Wait 1 minute between requests or use fallback tasks
3. **Profile not found**: Complete first-time setup or check database schema
4. **Points not saving**: Verify database tables exist and RLS policies are correct