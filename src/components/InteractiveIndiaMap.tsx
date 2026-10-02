import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Search, 
  MapPin, 
  X, 
  Navigation, 
  Compass, 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  Star, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  Calendar,
  PhoneCall,
  Sparkles,
  Info
} from 'lucide-react';
import { MarriageHall, Caterer, Photographer, DecorationTheme, ServiceCategory } from '../types';
import { formatINR, formatPerPlate, formatPerDay, formatDistanceKm } from '../utils/formatters';
import { detectCurrentIndianLocation, GeolocationResult } from '../services/locationService';

interface MapItem {
  id: string;
  type: 'hall' | 'caterer' | 'photographer' | 'decor';
  title: string;
  subtitle: string;
  location: string;
  area: string;
  city?: string;
  state?: string;
  rating: number;
  reviewCount: number;
  priceFormatted: string;
  rawPrice: number;
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  contactPhone: string;
  originalItem: MarriageHall | Caterer | Photographer | DecorationTheme;
}

interface InteractiveIndiaMapProps {
  isOpen: boolean;
  onClose: () => void;
  halls: MarriageHall[];
  caterers: Caterer[];
  photographers: Photographer[];
  decorations: DecorationTheme[];
  initialTargetItem?: { lat: number; lng: number; title: string; id: string } | null;
  onSelectItemForBooking?: (type: 'hall' | 'caterer' | 'photographer' | 'decor', item: any) => void;
  onAddToBundle?: (type: 'hall' | 'caterer' | 'photographer' | 'decor', item: any) => void;
  onOpenChat?: (vendor: any) => void;
}

const INDIAN_CITIES_PRESETS = [
  { name: 'All India', lat: 21.7679, lng: 78.8718, zoom: 5 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  { name: 'Udaipur', lat: 24.5854, lng: 73.7125, zoom: 13 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, zoom: 12 },
  { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, zoom: 11 },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, zoom: 12 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240, zoom: 11 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, zoom: 12 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, zoom: 12 },
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  isOpen,
  onClose,
  halls,
  caterers,
  photographers,
  decorations,
  initialTargetItem,
  onSelectItemForBooking,
  onAddToBundle,
  onOpenChat
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);
  const [userGpsCoords, setUserGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All India');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Normalize all items into standard map format
  const allMapItems = useMemo<MapItem[]>(() => {
    const items: MapItem[] = [];

    halls.forEach(h => {
      if (h.coordinates) {
        items.push({
          id: h.id,
          type: 'hall',
          title: h.name,
          subtitle: h.tagline,
          location: h.location,
          area: h.area,
          city: h.city || 'Mumbai',
          state: h.state || 'Maharashtra',
          rating: h.rating,
          reviewCount: h.reviewCount,
          priceFormatted: formatINR(h.basePrice),
          rawPrice: h.basePrice,
          imageUrl: h.imageUrl,
          coordinates: h.coordinates,
          contactPhone: h.contactPhone,
          originalItem: h
        });
      }
    });

    caterers.forEach(c => {
      if (c.coordinates) {
        items.push({
          id: c.id,
          type: 'caterer',
          title: c.name,
          subtitle: c.tagline,
          location: c.location,
          area: c.area,
          city: c.city || 'Mumbai',
          state: c.state || 'Maharashtra',
          rating: c.rating,
          reviewCount: c.reviewCount,
          priceFormatted: formatPerPlate(c.costPerPlate),
          rawPrice: c.costPerPlate,
          imageUrl: c.imageUrl,
          coordinates: c.coordinates,
          contactPhone: c.contactPhone,
          originalItem: c
        });
      }
    });

    photographers.forEach(p => {
      if (p.coordinates) {
        items.push({
          id: p.id,
          type: 'photographer',
          title: p.name,
          subtitle: p.tagline,
          location: p.location,
          area: p.area,
          city: p.city || 'Mumbai',
          state: p.state || 'Maharashtra',
          rating: p.rating,
          reviewCount: p.reviewCount,
          priceFormatted: formatPerDay(p.pricePerDay),
          rawPrice: p.pricePerDay,
          imageUrl: p.imageUrl,
          coordinates: p.coordinates,
          contactPhone: p.contactPhone,
          originalItem: p
        });
      }
    });

    decorations.forEach(d => {
      if (d.coordinates) {
        items.push({
          id: d.id,
          type: 'decor',
          title: d.name,
          subtitle: `${d.themeCategory} • ${d.designerStudio}`,
          location: d.location,
          area: d.area,
          city: d.city || 'Mumbai',
          state: d.state || 'Maharashtra',
          rating: d.rating,
          reviewCount: d.reviewCount,
          priceFormatted: formatINR(d.price),
          rawPrice: d.price,
          imageUrl: d.imageUrl,
          coordinates: d.coordinates,
          contactPhone: d.contactPhone,
          originalItem: d
        });
      }
    });

    return items;
  }, [halls, caterers, photographers, decorations]);

  // Filter items by category and search query
  const filteredMapItems = useMemo(() => {
    return allMapItems.filter(item => {
      if (activeCategory === 'halls' && item.type !== 'hall') return false;
      if (activeCategory === 'caterers' && item.type !== 'caterer') return false;
      if (activeCategory === 'photographers' && item.type !== 'photographer') return false;
      if (activeCategory === 'decorations' && item.type !== 'decor') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesArea = item.area.toLowerCase().includes(q);
        const matchesCity = item.city?.toLowerCase().includes(q);
        const matchesState = item.state?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesArea && !matchesCity && !matchesState) {
          return false;
        }
      }

      return true;
    });
  }, [allMapItems, activeCategory, searchQuery]);

  // Custom marker icons
  const createCustomIcon = (type: string, isSelected: boolean) => {
    let bgColor = '#C5A059'; // Gold for halls
    let iconSvg = '🏰';

    if (type === 'caterer') {
      bgColor = '#166534'; // Emerald for caterers
      iconSvg = '🍽️';
    } else if (type === 'photographer') {
      bgColor = '#3730A3'; // Indigo for photographers
      iconSvg = '📸';
    } else if (type === 'decor') {
      bgColor = '#9D174D'; // Rose for decor
      iconSvg = '🌸';
    }

    const scale = isSelected ? 'scale(1.25)' : 'scale(1)';
    const ringClass = isSelected ? 'box-shadow: 0 0 0 4px #1A1A1A, 0 8px 16px rgba(0,0,0,0.3);' : 'box-shadow: 0 4px 10px rgba(0,0,0,0.25);';

    return L.divIcon({
      className: 'custom-venue-pin',
      html: `
        <div style="
          transform: ${scale};
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          background-color: ${bgColor};
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          transform-origin: bottom left;
          transform: rotate(-45deg) ${scale};
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
          ${ringClass}
          cursor: pointer;
        ">
          <div style="transform: rotate(45deg); font-size: 16px; line-height: 1;">
            ${iconSvg}
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });
  };

  // Initialize or re-render map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = initialTargetItem ? initialTargetItem.lat : 21.7679;
      const initialLng = initialTargetItem ? initialTargetItem.lng : 78.8718;
      const initialZoom = initialTargetItem ? 14 : 5;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: true
      });

      // High-resolution luxury styled OpenStreetMap / CartoDB Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    // Trigger resize to prevent grey tiles
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      // Don't destroy immediately on state changes, only on unmount
    };
  }, [isOpen]);

  // Clean up on modal close
  useEffect(() => {
    if (!isOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersGroupRef.current = null;
    }
  }, [isOpen]);

  // Update map markers when filtered items change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    filteredMapItems.forEach(item => {
      const isSelected = selectedItem?.id === item.id;
      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], {
        icon: createCustomIcon(item.type, isSelected),
        title: item.title
      });

      marker.on('click', () => {
        setSelectedItem(item);
        mapInstanceRef.current?.flyTo([item.coordinates.lat, item.coordinates.lng], 14, {
          duration: 0.8
        });
      });

      marker.addTo(markersGroupRef.current!);
    });

    // If initial target passed, select and center it
    if (initialTargetItem) {
      const match = allMapItems.find(i => i.id === initialTargetItem.id);
      if (match) {
        setSelectedItem(match);
        mapInstanceRef.current.flyTo([match.coordinates.lat, match.coordinates.lng], 14, {
          duration: 0.8
        });
      }
    }
  }, [filteredMapItems, selectedItem, initialTargetItem, allMapItems]);

  // Handle GPS detection
  const handleDetectGPS = async () => {
    setIsLocating(true);
    try {
      const result: GeolocationResult = await detectCurrentIndianLocation();
      if (result.latitude && result.longitude) {
        const coords = { lat: result.latitude, lng: result.longitude };
        setUserGpsCoords(coords);
        mapInstanceRef.current?.flyTo([result.latitude, result.longitude], 13, {
          duration: 1.2
        });

        // Add user location pulsing marker
        if (mapInstanceRef.current) {
          const userIcon = L.divIcon({
            className: 'user-gps-pulse',
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background-color: #2563EB;
                border-radius: 50%;
                border: 3px solid #FFFFFF;
                box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.35);
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          L.marker([result.latitude, result.longitude], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>📍 Your Current Location</b>')
            .openPopup();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLocating(false);
    }
  };

  // City jump button
  const handleCityJump = (city: typeof INDIAN_CITIES_PRESETS[0]) => {
    setSelectedCity(city.name);
    setSearchQuery('');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lng], city.zoom, {
        duration: 1.0
      });
    }
  };

  // Open in real Google Maps
  const handleOpenInGoogleMaps = (lat: number, lng: number, query: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ', India')}&query_place_id=&center=${lat},${lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div 
        className={`bg-[#FDFCFB] rounded-2xl shadow-2xl border border-[#E5E0D5] flex flex-col overflow-hidden transition-all duration-300 ${
          isFullScreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl h-[92vh]'
        }`}
      >
        
        {/* Map Top Header: Title, Place Search, GPS, and Actions */}
        <div className="bg-white border-b border-[#E5E0D5] px-4 py-3 sm:px-6 sm:py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif-luxury flex items-center gap-2">
                  <span>Pan-India Luxury Wedding Map</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F7F3EB] text-[#8C6A24] font-semibold border border-[#C5A059]/30">
                    {filteredMapItems.length} Locations
                  </span>
                </h2>
                <p className="text-[11px] text-[#666666]">
                  Interactive Google Maps & OpenStreetMap Explorer for Indian Marriage Halls, Palaces, Caterers & Decor
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <button 
                onClick={onClose}
                className="p-2 text-[#666666] hover:text-[#1A1A1A] rounded-lg hover:bg-[#F4EFE6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input for Indian Places / Landmarks */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
              <input
                id="map-place-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any place in India (e.g. Udaipur, BKC, Marine Drive, Juhu, Falaknuma...)"
                className="w-full pl-9 pr-8 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#888888] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#1A1A1A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* GPS Auto Detect Current Location */}
            <button
              id="map-gps-locate-btn"
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1A1A1A] text-[#C5A059] text-xs font-semibold hover:bg-[#2B2927] transition-all cursor-pointer shrink-0 border border-[#C5A059]/40 shadow-xs"
              title="Detect my location on map"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-[#C5A059]' : ''}`} />
              <span className="hidden sm:inline">{isLocating ? 'Locating...' : 'My Location'}</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden md:flex p-2 text-[#666666] hover:text-[#1A1A1A] rounded-xl border border-[#E5E0D5] hover:bg-[#F9F7F2] transition-colors"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="hidden md:flex p-2 text-[#666666] hover:text-[#1A1A1A] rounded-xl border border-[#E5E0D5] hover:bg-[#F9F7F2] transition-colors"
              title="Close Map"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Filter Bar: Category Tabs + City Presets */}
        <div className="bg-[#F9F7F2] border-b border-[#E5E0D5] px-4 py-2 sm:px-6 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1A1A1A] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-[#E5E0D5] hover:border-[#C5A059]'
              }`}
            >
              All Vendors ({allMapItems.length})
            </button>

            <button
              onClick={() => setActiveCategory('halls')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'halls'
                  ? 'bg-[#C5A059] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-[#E5E0D5] hover:border-[#C5A059]'
              }`}
            >
              <span>🏰</span>
              <span>Halls & Palaces ({halls.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('caterers')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'caterers'
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-[#E5E0D5] hover:border-[#C5A059]'
              }`}
            >
              <span>🍽️</span>
              <span>Caterers ({caterers.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('photographers')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'photographers'
                  ? 'bg-[#3730A3] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-[#E5E0D5] hover:border-[#C5A059]'
              }`}
            >
              <span>📸</span>
              <span>Photographers ({photographers.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory('decorations')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCategory === 'decorations'
                  ? 'bg-[#9D174D] text-white shadow-2xs'
                  : 'bg-white text-[#555555] border border-[#E5E0D5] hover:border-[#C5A059]'
              }`}
            >
              <span>🌸</span>
              <span>Decor Themes ({decorations.length})</span>
            </button>
          </div>

          {/* Quick City Presets */}
          <div className="flex items-center gap-1 shrink-0 pl-3 border-l border-[#E5E0D5]">
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider hidden lg:inline">
              Jump to:
            </span>
            {INDIAN_CITIES_PRESETS.map((city) => (
              <button
                key={city.name}
                onClick={() => handleCityJump(city)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  selectedCity === city.name
                    ? 'bg-[#C5A059]/20 text-[#8C6A24] font-bold border border-[#C5A059]/40'
                    : 'text-[#666666] hover:bg-white hover:text-[#1A1A1A]'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>

        {/* Map Body: Map Canvas on Left/Center + Interactive Preview Card on Right/Bottom */}
        <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Leaflet Map Canvas */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full flex-1 z-10 bg-[#E5E0D5]"
            style={{ minHeight: '320px' }}
          />

          {/* Legend Overlay at Bottom-Left of Map */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md rounded-xl p-2.5 border border-[#E5E0D5] shadow-md hidden sm:flex flex-col gap-1.5 text-[11px] font-medium">
            <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-0.5">Map Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#C5A059]"></span>
              <span>Marriage Halls & Palaces</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#166534]"></span>
              <span>Gourmet Caterers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#3730A3]"></span>
              <span>Photographers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#9D174D]"></span>
              <span>Decor Themes</span>
            </div>
          </div>

          {/* Selected Item Detail Sidebar / Card */}
          {selectedItem && (
            <div className="w-full md:w-96 bg-white border-t md:border-t-0 md:border-l border-[#E5E0D5] z-30 shadow-xl overflow-y-auto max-h-[45vh] md:max-h-full flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-200">
              
              {/* Card Image */}
              <div className="relative h-44 sm:h-48 w-full bg-[#1A1A1A] shrink-0">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${
                    selectedItem.type === 'hall' ? 'bg-[#C5A059]' :
                    selectedItem.type === 'caterer' ? 'bg-[#166534]' :
                    selectedItem.type === 'photographer' ? 'bg-[#3730A3]' : 'bg-[#9D174D]'
                  }`}>
                    {selectedItem.type === 'hall' ? 'Marriage Hall / Palace' :
                     selectedItem.type === 'caterer' ? 'Royal Caterer' :
                     selectedItem.type === 'photographer' ? 'Wedding Cinematographer' : 'Decor Theme'}
                  </span>

                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-xs font-bold text-[#1A1A1A]">
                    <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
                    <span>{selectedItem.rating.toFixed(2)}</span>
                    <span className="text-[10px] text-[#666666]">({selectedItem.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-serif-luxury leading-snug">
                    {selectedItem.title}
                  </h3>
                  
                  <p className="text-xs text-[#666666] line-clamp-2">
                    {selectedItem.subtitle}
                  </p>

                  <div className="pt-1 flex items-start gap-1.5 text-xs text-[#444444]">
                    <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span>{selectedItem.area}</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#F0EBE1]">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#888888] font-bold">Pricing in INR</div>
                      <div className="text-lg font-bold text-[#1A1A1A] font-serif-luxury">
                        {selectedItem.priceFormatted}
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenInGoogleMaps(selectedItem.coordinates.lat, selectedItem.coordinates.lng, selectedItem.title)}
                      className="flex items-center gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8] font-semibold hover:underline cursor-pointer"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                  
                  {onSelectItemForBooking && (
                    <button
                      id="map-item-book-btn"
                      onClick={() => {
                        onSelectItemForBooking(selectedItem.type, selectedItem.originalItem);
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1A1A1A] text-[#C5A059] text-xs font-bold hover:bg-[#2C2A28] transition-all cursor-pointer shadow-xs border border-[#C5A059]/40"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Check Availability & Book (INR)</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {onAddToBundle && (
                      <button
                        onClick={() => {
                          onAddToBundle(selectedItem.type, selectedItem.originalItem);
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#F7F3EB] text-[#8C6A24] hover:bg-[#EAE4D7] border border-[#C5A059]/40 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Add to Bundle</span>
                      </button>
                    )}

                    {onOpenChat && (
                      <button
                        onClick={() => {
                          onOpenChat(selectedItem.originalItem);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white text-[#1A1A1A] hover:bg-[#F9F7F2] border border-[#E5E0D5] text-xs font-bold transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#246A42]" />
                        <span>Chat Vendor</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
