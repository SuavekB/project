import { TouristPoint } from '../types';

interface WikimediaResponse {
  query?: {
    pages?: {
      [key: string]: {
        imageinfo?: Array<{
          url?: string;
        }>;
        images?: Array<{
          title?: string;
        }>;
      };
    };
  };
}

interface WikimediaImageInfo {
  query?: {
    pages?: {
      [key: string]: {
        imageinfo?: Array<{
          url?: string;
        }>;
      };
    };
  };
}

async function searchWikimediaImages(title: string): Promise<string | null> {
  try {
    // First, search for images related to the title
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=images&titles=${encodeURIComponent(title)}&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData: WikimediaResponse = await searchResponse.json();

    if (!searchData.query?.pages) {
      return null;
    }

    // Get the first page's images
    const page = Object.values(searchData.query.pages)[0];
    if (!page.images || page.images.length === 0) {
      return null;
    }

    // Get the first image's details
    const firstImage = page.images[0];
    if (!firstImage.title) {
      return null;
    }

    // Then, get the actual image URL
    const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(firstImage.title)}&origin=*`;
    const imageInfoResponse = await fetch(imageInfoUrl);
    const imageInfoData: WikimediaImageInfo = await imageInfoResponse.json();

    if (!imageInfoData.query?.pages) {
      return null;
    }

    // Get the image URL from the response
    const imageInfo = Object.values(imageInfoData.query.pages)[0];
    return imageInfo.imageinfo?.[0]?.url || null;
  } catch (error) {
    console.error(`Error fetching Wikimedia image for ${title}:`, error);
    return null;
  }
}

async function isImageValid(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

export async function enhanceAttractionImages(attractions: TouristPoint[]): Promise<TouristPoint[]> {
  const enhancedAttractions = [...attractions];
  
  for (let i = 0; i < enhancedAttractions.length; i++) {
    const attraction = enhancedAttractions[i];
    
    // Check if current image is valid
    const hasValidImage = attraction.image && await isImageValid(attraction.image);
    
    if (!hasValidImage) {
      console.log(`Searching for new image for: ${attraction.name}`);
      
      try {
        // Try to find a new image
        const newImageUrl = await searchWikimediaImages(attraction.name);
        
        if (newImageUrl && await isImageValid(newImageUrl)) {
          enhancedAttractions[i] = {
            ...attraction,
            image: newImageUrl
          };
          console.log(`Updated image for ${attraction.name}`);
        } else {
          console.warn(`Could not find valid image for ${attraction.name}`);
        }
      } catch (error) {
        console.error(`Error enhancing image for ${attraction.name}:`, error);
      }
    }
  }
  
  return enhancedAttractions;
}