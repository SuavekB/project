import { useState } from 'react';
import { MapPin, Calendar, Navigation, UtensilsCrossed, List } from 'lucide-react';
import Map from './Map';
import './MobileLayout.css';
import type { City, TouristPoint, RouteVariant, DailyRoute } from '../types';

interface MobileLayoutProps {
  selectedCity: City;
  startPoint: [number, number] | null;
  days: number;
  dailyRoutes: DailyRoute[];
  selectedDay: number;
  selectedVariant: RouteVariant | null;
  onLocationSearch: () => void;
  onDaysChange: (days: number) => void;
  onGenerateRoutes: () => void;
  onDaySelect: (day: number) => void;
  onVariantSelect: (variant: RouteVariant) => void;
}

export default function MobileLayout({
  selectedCity,
  startPoint,
  days,
  dailyRoutes,
  selectedDay,
  selectedVariant,
  onLocationSearch,
  onDaysChange,
  onGenerateRoutes,
  onDaySelect,
  onVariantSelect,
}: MobileLayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showLocalFood, setShowLocalFood] = useState(false);
  const [showRouteList, setShowRouteList] = useState(false);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="mobile-layout">
      <div className="top-bar">
        <div className="top-bar-icons">
          <button
            className="icon-button"
            onClick={() => toggleSection('location')}
          >
            <MapPin size={24} />
            <span>Start</span>
          </button>
          <button
            className="icon-button"
            onClick={() => toggleSection('days')}
          >
            <Calendar size={24} />
            <span>Days</span>
          </button>
          <button
            className="icon-button"
            onClick={onGenerateRoutes}
          >
            <Navigation size={24} />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Expandable sections */}
      <div className={`expandable-section ${activeSection === 'location' ? 'expanded' : ''}`}>
        {/* Location search content */}
      </div>
      <div className={`expandable-section ${activeSection === 'days' ? 'expanded' : ''}`}>
        {/* Days selection content */}
      </div>

      <div className="map-container">
        {dailyRoutes.length > 0 && (
          <div className="route-variants">
            {dailyRoutes[selectedDay - 1].routes.map((variant, index) => (
              <button
                key={variant.name}
                className={`variant-button ${selectedVariant?.name === variant.name ? 'active' : ''}`}
                onClick={() => onVariantSelect(variant)}
              >
                Variant {index + 1}
              </button>
            ))}
          </div>
        )}
        <Map
          center={selectedCity.coordinates}
          zoom={13}
          points={selectedVariant?.points || []}
          startPoint={startPoint || undefined}
          walkingPaths={selectedVariant?.paths}
        />
      </div>

      <div className="bottom-bar">
        <button
          className="icon-button"
          onClick={() => setShowLocalFood(!showLocalFood)}
        >
          <UtensilsCrossed size={24} />
          <span>Local Food</span>
        </button>
        <button
          className="icon-button"
          onClick={() => setShowRouteList(!showRouteList)}
        >
          <List size={24} />
          <span>Routes</span>
        </button>
      </div>

      {/* Expandable sections content */}
      <div className={`expandable-section ${activeSection === 'location' ? 'expanded' : ''}`}>
        <div className="section-content">
          <button className="action-button" onClick={onLocationSearch}>
            Search Starting Location
          </button>
          {startPoint && (
            <div className="location-info">
              <p>Starting point selected</p>
            </div>
          )}
        </div>
      </div>
      <div className={`expandable-section ${activeSection === 'days' ? 'expanded' : ''}`}>
        <div className="section-content days-selector">
          <button
            className="action-button small"
            onClick={() => onDaysChange(Math.max(1, days - 1))}
          >
            -
          </button>
          <span className="days-display">{days} days</span>
          <button
            className="action-button small"
            onClick={() => onDaysChange(days + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="map-container">
        {dailyRoutes.length > 0 && (
          <div className="route-variants">
            {dailyRoutes[selectedDay - 1].routes.map((variant, index) => (
              <button
                key={variant.name}
                className={`variant-button ${selectedVariant?.name === variant.name ? 'active' : ''}`}
                onClick={() => onVariantSelect(variant)}
              >
                Variant {index + 1}
              </button>
            ))}
          </div>
        )}
        <Map
          center={selectedCity.coordinates}
          zoom={13}
          points={selectedVariant?.points || []}
          startPoint={startPoint || undefined}
          walkingPaths={selectedVariant?.paths}
        />
      </div>

      <div className="bottom-bar">
        <button
          className="icon-button"
          onClick={() => setShowLocalFood(!showLocalFood)}
        >
          <UtensilsCrossed size={24} />
          <span>Local Food</span>
        </button>
        <button
          className="icon-button"
          onClick={() => setShowRouteList(!showRouteList)}
        >
          <List size={24} />
          <span>Routes</span>
        </button>
      </div>

      {/* Expandable sections content */}
      <div className={`expandable-section ${activeSection === 'location' ? 'expanded' : ''}`}>
        <div className="section-content">
          <button className="action-button" onClick={onLocationSearch}>
            Search Location
          </button>
        </div>
      </div>

      <div className={`expandable-section ${activeSection === 'days' ? 'expanded' : ''}`}>
        <div className="section-content">
          <div className="days-selector">
            <button
              className="days-button"
              onClick={() => days > 1 && onDaysChange(days - 1)}
            >
              -
            </button>
            <span>{days} days</span>
            <button
              className="days-button"
              onClick={() => onDaysChange(days + 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {showLocalFood && (
        <div className="overlay-panel">
          <div className="panel-header">
            <h3>Local Food</h3>
            <button onClick={() => setShowLocalFood(false)}>×</button>
          </div>
          <div className="panel-content">
            {/* Add local food content here */}
          </div>
        </div>
      )}

      {showRouteList && (
        <div className="overlay-panel">
          <div className="panel-header">
            <h3>Routes</h3>
            <button onClick={() => setShowRouteList(false)}>×</button>
          </div>
          <div className="panel-content">
            {dailyRoutes.map((route, index) => (
              <button
                key={index}
                className={`day-button ${selectedDay === index + 1 ? 'active' : ''}`}
                onClick={() => onDaySelect(index + 1)}
              >
                Day {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
