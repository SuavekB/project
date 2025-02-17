import { City } from '../types';
import { enhanceAttractionImages } from './wikiMediaImages';

export async function enhanceCity(city: City): Promise<City> {
  try {
    const enhancedPoints = await enhanceAttractionImages(city.points);
    
    return {
      ...city,
      points: enhancedPoints
    };
  } catch (error) {
    console.error(`Error enhancing city ${city.name}:`, error);
    return city;
  }
}