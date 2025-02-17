export async function searchLocation(query: string): Promise<[number, number] | null> {
  try {
    // Add country context based on selected city
    const searchQuery = encodeURIComponent(query);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1`,
      {
        headers: {
          'User-Agent': 'TouristRoutePlanner/1.0'
        }
      }
    );
    
    if (!response.ok) {
      console.error('Nominatim API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data && data.length > 0 && data[0].lat && data[0].lon) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    
    return null;
  } catch (error) {
    console.error('Error searching location:', error);
    return null;
  }
}