import { TouristPoint, RouteVariant, TransportSuggestion, DailyRoute } from '../types';

function getDistance(point1: [number, number], point2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(point2[0] - point1[0]);
  const dLon = deg2rad(point2[1] - point1[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1[0])) * Math.cos(deg2rad(point2[0])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function getWalkingTime(distance: number): number {
  // Average walking speed: 4.5 km/h (accounting for traffic lights and crossings)
  return (distance / 4.5) * 60; // minutes
}

function getBearing(point1: [number, number], point2: [number, number]): string {
  const lat1 = deg2rad(point1[0]);
  const lat2 = deg2rad(point2[0]);
  const lon1 = deg2rad(point1[1]);
  const lon2 = deg2rad(point2[1]);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

  const directions = ['north', 'northeast', 'east', 'southeast', 
                     'south', 'southwest', 'west', 'northwest'];
  return directions[Math.round(bearing / 45) % 8];
}

async function getWalkingPath(start: [number, number], end: [number, number]): Promise<[number, number][]> {
  try {
    const response = await fetch(
      `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'TouristRoutePlanner/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch route');
    }

    const data = await response.json();
    if (!data.routes?.[0]?.geometry?.coordinates) {
      throw new Error('Invalid route data');
    }

    return data.routes[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
  } catch (error) {
    console.warn('OpenStreetMap routing failed, falling back to direct line:', error);
    return [start, end];
  }
}

function generateNavigationInstructions(
  from: [number, number],
  to: [number, number],
  toName: string
): string {
  const distance = getDistance(from, to);
  const walkingTime = getWalkingTime(distance);
  const direction = getBearing(from, to);
  
  return `Walk ${direction} for about ${Math.round(walkingTime)} minutes (${(distance * 1000).toFixed(0)}m) to ${toName}`;
}

// New function to calculate visit duration based on attraction type
function calculateVisitDuration(point: TouristPoint): number {
  if (point.type === 'museum') {
    return 120; // 2 hours for museums
  }
  return 20; // 20 minutes for other attractions
}

interface Cluster {
  points: TouristPoint[];
  center: [number, number];
  totalDuration: number;
}

function createGeographicalClusters(
  points: TouristPoint[],
  startPoint: [number, number],
  maxPointsPerDay: number
): Cluster[] {
  const clusters: Cluster[] = [];
  const remainingPoints = [...points];
  
  while (remainingPoints.length > 0) {
    let currentPoint = remainingPoints[0];
    let currentCluster: TouristPoint[] = [currentPoint];
    let clusterDuration = calculateVisitDuration(currentPoint);
    
    // Remove the first point from remaining points
    remainingPoints.splice(0, 1);
    
    // Find nearby points for the current cluster
    for (let i = remainingPoints.length - 1; i >= 0; i--) {
      const point = remainingPoints[i];
      const isNearby = currentCluster.some(p => 
        getDistance(p.coordinates, point.coordinates) < 1.5 // 1.5km radius
      );
      
      if (isNearby && currentCluster.length < maxPointsPerDay) {
        currentCluster.push(point);
        clusterDuration += calculateVisitDuration(point);
        remainingPoints.splice(i, 1);
      }
    }
    
    // Calculate cluster center
    const center: [number, number] = [
      currentCluster.reduce((sum, p) => sum + p.coordinates[0], 0) / currentCluster.length,
      currentCluster.reduce((sum, p) => sum + p.coordinates[1], 0) / currentCluster.length
    ];
    
    clusters.push({
      points: currentCluster,
      center,
      totalDuration: clusterDuration
    });
  }
  
  // Sort clusters by distance from start point
  return clusters.sort((a, b) => 
    getDistance(startPoint, a.center) - getDistance(startPoint, b.center)
  );
}

function balanceClusters(
  clusters: Cluster[],
  days: number
): TouristPoint[][] {
  const dailyRoutes: TouristPoint[][] = Array(days).fill(null).map(() => []);
  const dailyDurations: number[] = Array(days).fill(0);
  
  // Sort clusters by duration (descending) to distribute major attractions first
  clusters.sort((a, b) => b.totalDuration - a.totalDuration);
  
  // Calculate target duration per day
  const totalDuration = clusters.reduce((sum, cluster) => sum + cluster.totalDuration, 0);
  const targetDurationPerDay = totalDuration / days;
  
  // Distribute clusters to balance duration and maintain geographical proximity
  clusters.forEach((cluster) => {
    // Find the day with the lowest current duration
    let minDurationDay = 0;
    let minDuration = dailyDurations[0];
    
    for (let i = 1; i < days; i++) {
      if (dailyDurations[i] < minDuration) {
        minDuration = dailyDurations[i];
        minDurationDay = i;
      }
    }
    
    // If adding to the minimum duration day would make it too unbalanced,
    // find the next best day
    if (minDuration + cluster.totalDuration > targetDurationPerDay * 1.4) {
      for (let i = 0; i < days; i++) {
        if (i !== minDurationDay && 
            dailyDurations[i] + cluster.totalDuration <= targetDurationPerDay * 1.4) {
          minDurationDay = i;
          break;
        }
      }
    }
    
    dailyRoutes[minDurationDay].push(...cluster.points);
    dailyDurations[minDurationDay] += cluster.totalDuration;
  });
  
  return dailyRoutes;
}

async function optimizeRoute(
  startPoint: [number, number],
  points: TouristPoint[]
): Promise<{
  points: TouristPoint[];
  navigationInstructions: string[];
  totalDuration: number;
  walkingDistance: number;
  walkingPaths: [number, number][][];
}> {
  const visitedPoints = new Set<string>();
  const orderedPoints: TouristPoint[] = [];
  const navigationInstructions: string[] = [];
  const walkingPaths: [number, number][][] = [];
  let totalDuration = 0;
  let totalDistance = 0;
  let currentPoint = startPoint;

  while (orderedPoints.length < points.length) {
    let nearestPoint: TouristPoint | null = null;
    let minDistance = Infinity;

    // Find the nearest unvisited point
    for (const point of points) {
      if (!visitedPoints.has(point.id)) {
        const distance = getDistance(currentPoint, point.coordinates);
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
        }
      }
    }

    if (!nearestPoint) break;

    const path = await getWalkingPath(currentPoint, nearestPoint.coordinates);
    const walkingTime = getWalkingTime(minDistance);
    const visitDuration = calculateVisitDuration(nearestPoint);

    walkingPaths.push(path);
    navigationInstructions.push(
      generateNavigationInstructions(currentPoint, nearestPoint.coordinates, nearestPoint.name)
    );

    orderedPoints.push(nearestPoint);
    visitedPoints.add(nearestPoint.id);
    totalDuration += walkingTime + visitDuration;
    totalDistance += minDistance;
    currentPoint = nearestPoint.coordinates;
  }

  return {
    points: orderedPoints,
    navigationInstructions,
    totalDuration,
    walkingDistance: totalDistance,
    walkingPaths
  };
}

export async function generateDailyRoutes(
  startPoint: [number, number],
  points: TouristPoint[],
  days: number
): Promise<DailyRoute[]> {
  const dailyRoutes: DailyRoute[] = [];
  const maxPointsPerDay = 7; // Maximum points per day

  if (days === 1) {
    // For single day, use the original optimization
    const route = await optimizeRoute(startPoint, points);
    dailyRoutes.push({
      day: 1,
      routes: [{
        id: 1,
        name: "Complete City Experience",
        description: "A comprehensive route covering major attractions across the city.",
        ...route,
        transportSuggestions: []
      }]
    });
  } else {
    // For multiple days, use geographical clustering
    const clusters = createGeographicalClusters(points, startPoint, maxPointsPerDay);
    const dailyPoints = balanceClusters(clusters, days);

    // Generate optimized route for each day
    for (let day = 0; day < days; day++) {
      const dayPoints = dailyPoints[day];
      if (dayPoints.length === 0) continue;

      const route = await optimizeRoute(startPoint, dayPoints);
      
      dailyRoutes.push({
        day: day + 1,
        routes: [{
          id: 1,
          name: `Day ${day + 1} Exploration`,
          description: `Discover a curated selection of nearby attractions in the ${getBearing(startPoint, clusters[day].center)} part of the city.`,
          ...route,
          transportSuggestions: []
        }]
      });
    }
  }

  return dailyRoutes;
}