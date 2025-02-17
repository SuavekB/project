import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { TouristPoint, TransportSuggestion } from '../types';
import { getWikipediaInfo } from '../utils/wikipedia';
import { RefreshCw, X } from 'lucide-react';
import debounce from 'lodash/debounce';

interface MapProps {
  center: [number, number];
  zoom: number;
  points: TouristPoint[];
  transportSuggestions: TransportSuggestion[];
  startPoint?: [number, number];
  walkingPaths?: [number, number][][];
  onRouteUpdate?: (skippedPoints: string[]) => void;
}

export default function Map({ 
  center, 
  zoom, 
  points, 
  startPoint, 
  walkingPaths,
  onRouteUpdate 
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const routingRef = useRef<L.Polyline[]>([]);
  const [skippedPoints, setSkippedPoints] = useState<Set<string>>(new Set());
  const [isUpdatingRoute, setIsUpdatingRoute] = useState(false);

  const debouncedRouteUpdate = debounce((skippedPointIds: string[]) => {
    onRouteUpdate?.(skippedPointIds);
    setIsUpdatingRoute(false);
  }, 1000);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and routes
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    routingRef.current.forEach(route => route.remove());
    routingRef.current = [];

    if (startPoint) {
      const startIcon = L.divIcon({
        className: 'custom-marker-start',
        html: `<div class="w-8 h-8 rounded-full bg-blue-500 border-4 border-white text-white text-lg font-bold flex items-center justify-center shadow-lg">S</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const startMarker = L.marker(startPoint, { icon: startIcon })
        .addTo(mapRef.current)
        .bindPopup('<div class="text-lg font-bold">Starting Point</div>', {
          className: 'custom-popup'
        });
      
      markersRef.current['start'] = startMarker;
    }

    points.forEach(async (point, index) => {
      const isSkipped = skippedPoints.has(point.id);
      const icon = L.divIcon({
        className: `custom-marker ${isSkipped ? 'skipped' : ''}`,
        html: `
          <div class="relative group">
            <div class="w-8 h-8 rounded-full bg-purple-500 border-4 border-white text-white text-lg font-bold flex items-center justify-center shadow-lg transition-all duration-300">
              ${index + 1}
            </div>
            ${!isSkipped ? `
              <button class="remove-button absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg" data-point-id="${point.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            ` : ''}
            ${isSkipped ? `
              <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Click to restore
              </div>
            ` : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const wikiInfo = await getWikipediaInfo(point.name);
      const wikiPreview = wikiInfo?.preview ? `
        <div class="wiki-preview hidden group-hover:block absolute left-full top-0 ml-2 w-[300px] bg-gray-800 rounded-lg shadow-xl p-3 z-50">
          ${wikiInfo.preview.image ? `
            <img src="${wikiInfo.preview.image}" alt="${point.name}" class="w-full h-40 object-cover rounded-lg mb-2"/>
          ` : ''}
          <p class="text-sm text-gray-300">${wikiInfo.preview.extract}</p>
        </div>
      ` : '';

      const wikiLink = wikiInfo ? `
        <div class="relative group inline-block">
          <a href="${wikiInfo.url}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors mt-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .084-.103.135-.2.157-.74.108-1.178.255-.302 1.495.516.916 1.571 2.689 2.192 3.752.164.278.342.278.493 0 .291-.526 1.465-2.662 1.465-2.662.425-.878.681-1.664-.199-1.745-.226-.027-.326-.078-.326-.162V4.898l.049-.045h5.628l.05.045v.434c0 .084-.103.135-.201.157-.463.108-1.178.255-1.739 1.495-.561 1.24-2.106 4.279-2.106 4.279-.105.211-.087.362.046.362.128 0 .324-.151.486-.446.064-.119.227-.375.449-.724zm4.851-2.017c.952-.089 1.96-.137 3.107-.137 2.513 0 4.148.855 4.148 2.841 0 2.01-1.665 3.053-4.148 3.053-.516 0-1.099-.02-1.676-.06v2.726c0 .084.104.157.202.157h.463c.231 0 .334.054.334.137v.435l-.051.045h-5.629l-.05-.045v-.435c0-.083.103-.137.202-.137h.463c.231 0 .334-.073.334-.157V7.212c0-.083-.103-.156-.334-.156h-.463c-.099 0-.202-.052-.202-.136v-.435l.05-.045c.466.005 2.001-.045 3.25-.045zm1.431 4.02c.478.023.989.036 1.676.036 1.612 0 2.514-.855 2.514-1.899 0-1.068-.902-1.676-2.514-1.676-.687 0-1.198.012-1.676.036v3.503z"/>
            </svg>
            Wikipedia
            ${wikiPreview}
          </a>
        </div>
      ` : '';

      const marker = L.marker(point.coordinates, { icon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div class="max-w-xs">
            <h3 class="font-bold text-lg">${point.name}</h3>
            <p class="text-sm my-2">${point.description}</p>
            <p class="text-sm font-medium">
              ⏰ ${point.openingHours || 'Always open'}
            </p>
            ${wikiLink}
          </div>
        `, {
          maxWidth: 350,
          className: 'custom-popup'
        });
      
      markersRef.current[point.id] = marker;

      // Add click handlers
      marker.getElement()?.addEventListener('click', (e) => {
        if (isSkipped) {
          e.stopPropagation();
          togglePointSkip(point.id);
        }
      });

      marker.getElement()?.querySelector(`[data-point-id="${point.id}"]`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePointSkip(point.id);
      });
    });

    // Draw walking paths with reduced opacity for skipped sections
    if (walkingPaths && walkingPaths.length > 0) {
      walkingPaths.forEach(path => {
        const polyline = L.polyline(path, {
          color: '#8b5cf6',
          weight: 4,
          opacity: 0.7,
          smoothFactor: 1,
          lineCap: 'round',
          className: 'route-path'
        }).addTo(mapRef.current);
        
        routingRef.current.push(polyline);
      });
    }

    // Fit bounds to include all points, including skipped ones
    const allPoints = startPoint 
      ? [startPoint, ...points.map(p => p.coordinates)]
      : points.map(p => p.coordinates);

    if (allPoints.length > 0) {
      mapRef.current.fitBounds(allPoints, {
        padding: [50, 50]
      });
    }
  }, [points, startPoint, walkingPaths, skippedPoints]);

  const togglePointSkip = (pointId: string) => {
    setSkippedPoints(prev => {
      const newSkipped = new Set(prev);
      if (newSkipped.has(pointId)) {
        newSkipped.delete(pointId);
      } else {
        newSkipped.add(pointId);
      }
      return newSkipped;
    });
  };

  const handleRouteUpdate = () => {
    setIsUpdatingRoute(true);
    debouncedRouteUpdate(Array.from(skippedPoints));
  };

  return (
    <div className="relative w-full h-full">
      <div id="map" className="absolute inset-0 rounded-lg shadow-xl" />
      {skippedPoints.size > 0 && (
        <button
          onClick={handleRouteUpdate}
          disabled={isUpdatingRoute}
          className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors z-[1000]"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdatingRoute ? 'animate-spin' : ''}`} />
          {isUpdatingRoute ? 'Updating route...' : 'Update route'}
        </button>
      )}
    </div>
  );
}