export interface TouristPoint {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'landmark' | 'museum' | 'historical_site' | 'amusement_park';
  visitDuration: number;
  priority: number;
  openingHours?: string;
  image?: string;
  wikipediaUrl?: string;
  wikipediaPreview?: {
    image: string;
    extract: string;
  };
}

export interface TransportSuggestion {
  from: string;
  to: string;
  type: 'bus' | 'tram' | 'metro';
  line: string;
  direction: string;
  stop: string;
  walkingTime: number;
}

export interface RouteVariant {
  id: number;
  name: string;
  description: string;
  points: TouristPoint[];
  navigationInstructions: string[];
  totalDuration: number;
  walkingDistance: number;
  transportSuggestions: TransportSuggestion[];
  walkingPaths: [number, number][][];
}

export interface DailyRoute {
  day: number;
  routes: RouteVariant[];
}

export interface LocalFood {
  name: string;
  type: string;
  description: string;
}

export interface City {
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  points: TouristPoint[];
}