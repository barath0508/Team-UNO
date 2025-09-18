export const getAutoLocation = async (): Promise<{location: string, state: string, district: string}> => {
  try {
    // Try GPS first
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    
    // Reverse geocoding with GPS coordinates
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
    const data = await response.json();
    
    return {
      location: data.city || data.locality || 'Unknown',
      state: data.principalSubdivision || 'Unknown',
      district: data.localityInfo?.administrative?.[2]?.name || data.city || 'Unknown'
    };
  } catch (error) {
    // Fallback to IP geolocation
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        location: data.city || 'Unknown',
        state: data.region || 'Unknown', 
        district: data.city || 'Unknown'
      };
    } catch (ipError) {
      // Final fallback
      return {
        location: 'Delhi',
        state: 'Delhi',
        district: 'New Delhi'
      };
    }
  }
};