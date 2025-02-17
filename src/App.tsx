import React, { useState, useCallback, useMemo } from 'react';
import { MapPin, Calendar, Clock, Map as MapIcon, Navigation, UtensilsCrossed, Search, X } from 'lucide-react';
import Map from './components/Map';
import { cities } from './data/cities';
import { localFood } from './data/localFood';
import { searchLocation } from './utils/nominatim';
import { generateDailyRoutes } from './utils/routeOptimizer';
import type { City, TouristPoint, RouteVariant, DailyRoute } from './types';

// Normalize text for comparison (handle diacritics and case)
const normalizeText = (text: string) => {
  return text.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

function App() {
  const cityKeys = Object.keys(cities) as Array<keyof typeof cities>;
  const [selectedCity, setSelectedCity] = useState<City>(cities[cityKeys[0]]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [days, setDays] = useState(1);
  const [dailyRoutes, setDailyRoutes] = useState<DailyRoute[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<RouteVariant | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isGeneratingRoute, setIsGeneratingRoute] = useState(false);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery) return cityKeys;
    const normalizedQuery = normalizeText(citySearchQuery);
    return cityKeys.filter(key => {
      const city = cities[key];
      return normalizeText(city.name).includes(normalizedQuery) ||
             normalizeText(city.country).includes(normalizedQuery);
    });
  }, [citySearchQuery]);

  const handleCitySelect = (cityKey: keyof typeof cities) => {
    setSelectedCity(cities[cityKey]);
    setCitySearchQuery(cities[cityKey].name);
    setIsCityDropdownOpen(false);
    setDailyRoutes([]);
    setSelectedVariant(null);
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) {
      setSearchError('Please enter a location');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const searchQuery = `${location}, ${selectedCity.name}, ${selectedCity.country}`;
      const coordinates = await searchLocation(searchQuery);
      
      if (coordinates) {
        setStartPoint(coordinates);
        setSearchError(null);
      } else {
        setSearchError('Location not found. Please try a different address.');
        setStartPoint(null);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Error searching location. Please try again.');
      setStartPoint(null);
    } finally {
      setIsSearching(false);
    }
  };

  const generateRoutes = async (skippedPoints: string[] = []) => {
    if (!startPoint) {
      setSearchError('Please enter a starting location first.');
      return;
    }

    setIsGeneratingRoute(true);
    try {
      const activePoints = selectedCity.points.filter(point => !skippedPoints.includes(point.id));
      const routes = await generateDailyRoutes(startPoint, activePoints, days);
      setDailyRoutes(routes);
      if (routes.length > 0 && routes[0].routes.length > 0) {
        setSelectedDay(1);
        setSelectedVariant(routes[0].routes[0]);
      }
    } catch (error) {
      console.error('Error generating routes:', error);
      setSearchError('Failed to generate routes. Please try again.');
    } finally {
      setIsGeneratingRoute(false);
    }
  };

  const handleRouteUpdate = useCallback((skippedPoints: string[]) => {
    generateRoutes(skippedPoints);
  }, [startPoint, days, selectedCity]);

  const cityFoodRecommendations = localFood[selectedCity.name.toLowerCase() as keyof typeof localFood] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-2xl font-bold mb-6">Tourist Route Planner</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <MapPin className="inline-block mr-2" size={16} />
                Starting Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter hotel or address"
                  className="flex-1 px-3 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleLocationSearch();
                    }
                  }}
                />
                <button
                  onClick={handleLocationSearch}
                  disabled={isSearching}
                  className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors ${
                    isSearching ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              {searchError && (
                <p className="mt-2 text-red-400 text-sm">{searchError}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium mb-2">
                <MapIcon className="inline-block mr-2" size={16} />
                Select City
              </label>
              <div className="relative">
                <div className="flex items-center relative">
                  <Search className="absolute left-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => {
                      setCitySearchQuery(e.target.value);
                      setIsCityDropdownOpen(true);
                    }}
                    onFocus={() => setIsCityDropdownOpen(true)}
                    placeholder="Search for a city..."
                    className="w-full pl-10 pr-10 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {citySearchQuery && (
                    <button
                      onClick={() => {
                        setCitySearchQuery('');
                        setIsCityDropdownOpen(true);
                      }}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {isCityDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {filteredCities.map((key) => (
                      <button
                        key={key}
                        onClick={() => handleCitySelect(key)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center justify-between group"
                      >
                        <span>{cities[key].name}</span>
                        <span className="text-gray-400 group-hover:text-gray-300">
                          {cities[key].country}
                        </span>
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="px-4 py-2 text-gray-400">
                        No cities found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline-block mr-2" size={16} />
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={() => generateRoutes()}
              disabled={!startPoint || isGeneratingRoute}
              className={`w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors ${
                !startPoint || isGeneratingRoute ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGeneratingRoute ? 'Generating Routes...' : 'Generate Routes'}
            </button>
          </div>

          {dailyRoutes.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-2">
                {dailyRoutes.map((route) => (
                  <button
                    key={route.day}
                    onClick={() => {
                      setSelectedDay(route.day);
                      if (route.routes.length > 0) {
                        setSelectedVariant(route.routes[0]);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedDay === route.day
                        ? 'bg-blue-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Day {route.day}
                  </button>
                ))}
              </div>

              {selectedVariant && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {dailyRoutes[selectedDay - 1]?.routes.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'bg-purple-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Navigation size={20} />
                        Day {selectedDay} - {selectedVariant.name}
                      </h2>
                      <p className="text-gray-400 mt-1">{selectedVariant.description}</p>
                      <div className="mt-2 flex gap-4 text-sm text-gray-300">
                        <span>⌛ {Math.round(selectedVariant.totalDuration / 60)} hours</span>
                        <span>🚶‍♂️ {selectedVariant.walkingDistance.toFixed(1)} km</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {selectedVariant.points.map((point, index) => (
                        <div key={point.id} className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex flex-col">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg font-bold">
                                {index + 1}
                              </span>
                              <div>
                                <h3 className="font-medium text-lg">{point.name}</h3>
                                <div className="mt-1 space-y-1">
                                  <p className="text-sm text-gray-400">
                                    <Clock className="inline-block mr-1" size={14} />
                                    Visit: {point.visitDuration} minutes
                                  </p>
                                  {point.openingHours && (
                                    <p className="text-sm text-gray-400">
                                      ⏰ {point.openingHours}
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-400">
                                    🏛️ Type: {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-300">{point.description}</p>

                            {selectedVariant.navigationInstructions[index] && (
                              <div className="mt-3 bg-blue-600 bg-opacity-20 p-3 rounded-lg">
                                <p className="text-sm">
                                  🚶‍♂️ {selectedVariant.navigationInstructions[index]}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="h-[calc(100vh-12rem)]">
            <Map
              center={selectedCity.center}
              zoom={selectedCity.zoom}
              points={selectedVariant?.points || []}
              transportSuggestions={[]}
              startPoint={startPoint || undefined}
              walkingPaths={selectedVariant?.walkingPaths}
              onRouteUpdate={handleRouteUpdate}
            />
          </div>

          {cityFoodRecommendations.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UtensilsCrossed size={18} />
                Local Food & Drink
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cityFoodRecommendations.map((food) => (
                  <div key={food.name} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium text-base mb-2">{food.name}</h3>
                    <span className="inline-block px-2 py-0.5 text-xs bg-purple-600 rounded-full mb-2">
                      {food.type.charAt(0).toUpperCase() + food.type.slice(1)}
                    </span>
                    <p className="text-sm text-gray-300">{food.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;