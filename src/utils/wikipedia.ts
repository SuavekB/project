import { WikipediaResponse } from '../types';

const wikiCache = new Map<string, {url: string; preview: { image: string; extract: string; } | null} | null>();

export async function getWikipediaInfo(title: string, lang = 'en'): Promise<{url: string; preview: { image: string; extract: string; } | null} | null> {
  // Check cache first
  const cacheKey = `${lang}:${title}`;
  if (wikiCache.has(cacheKey)) {
    return wikiCache.get(cacheKey)!;
  }
  try {
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(title)}&exintro=1&explaintext=1&pithumbsize=300&origin=*`;
    
    const response = await fetch(searchUrl);
    const data: WikipediaResponse = await response.json();

    if (!data.query?.pages) {
      return null;
    }

    const page = Object.values(data.query.pages)[0];
    if (!page) {
      return null;
    }

    const url = `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`;
    const preview = page.extract ? {
      image: page.thumbnail?.source || '',
      extract: page.extract.substring(0, 200) + '...'
    } : null;

    const result = { url, preview };
    // Store in cache
    wikiCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error fetching Wikipedia info for ${title}:`, error);
    return null;
  }
}