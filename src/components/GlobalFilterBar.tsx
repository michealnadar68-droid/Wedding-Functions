import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  SlidersHorizontal, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Layers,
  Utensils,
  Camera,
  Palette,
  Building2,
  Navigation,
  Loader2,
  Compass,
  Gift,
  Flame
} from 'lucide-react';
import { GlobalFilterState, ServiceCategory } from '../types';
import { LOCATIONS_LIST, OCCASIONS_LIST, RELIGIONS_TRADITIONS_LIST } from '../data/mockData';
import { detectCurrentIndianLocation, GeolocationResult } from '../services/locationService';
import { formatINR, formatPerPlate, formatPerDay } from '../utils/formatters';

interface GlobalFilterBarProps {
  filters: GlobalFilterState;
  onFilterChange: (newFilters: Partial<GlobalFilterState>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
  onOpenMap?: () => void;
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
  onOpenMap
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [geoResult, setGeoResult] = useState<GeolocationResult | null>(null);

  const handleNearMeToggle = async () => {
    setIsDetectingLocation(true);
    try {
      const result = await detectCurrentIndianLocation();
      setGeoResult(result);
      onFilterChange({ location: result.matchedLocation });
    } catch (err) {
      console.error('Location detection error:', err);
      onFilterChange({ location: 'Mumbai - Bandra & BKC Prestige Hub' });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Determine price bounds based on current category in Indian Rupees (INR)
  const getPriceLabel = () => {
    if (filters.category === 'caterers') {
      return `Up to ${formatPerPlate(filters.maxPrice)}`;
    } else if (filters.category === 'photographers') {
      return `Up to ${formatPerDay(filters.maxPrice)}`;
    } else {
      return `Budget up to ${formatINR(filters.maxPrice, true)}`;
    }
  };

  const getPriceMinLimit = () => {
    if (filters.category === 'caterers') return 500;
    if (filters.category === 'photographers') return 50000;
    if (filters.category === 'decorations') return 100000;
    return 300000; // Halls or All
  };

  const getPriceMaxLimit = () => {
    if (filters.category === 'caterers') return 5000;
    if (filters.category === 'photographers') return 1200000;
    if (filters.category === 'decorations') return 2500000;
    return 5000000; // Halls or All (Up to ₹50 Lakhs)
  };

  const getPriceStep = () => {
    if (filters.category === 'caterers') return 50;
    if (filters.category === 'photographers') return 25000;
    if (filters.category === 'decorations') return 50000;
    return 100000;
  };

  const isFiltered = 
    filters.searchQuery !== '' || 
    (filters.location !== 'All Locations (India)' && filters.location !== 'All Locations') || 
    (Boolean(filters.occasion) && filters.occasion !== 'All Occasions (Birthdays, Weddings, Traditional Rites)') ||
    (Boolean(filters.religiousTradition) && filters.religiousTradition !== 'All Faiths & Cultural Traditions') ||
    filters.availabilityStatus !== 'All' ||
    filters.minRating > 0 ||
    filters.selectedDate !== '' ||
    filters.dietaryFilter !== 'all' ||
    filters.hallTopRatedOnly ||
    filters.decorSortBy !== 'default';

  return (
    <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-4 sm:p-6 mb-8 transition-all">
      
      {/* Top Filter Header: Search Bar + Sector Quick Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-[#F0EBE1]">
        
        {/* Universal Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search all Pan-India: 1st birthday, Upanayanam, Nikah, Anand Karaj, halls, caterers, photographers, decor..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-[#FDFCFB] border border-[#E5E0D5] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-[#888888] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#1A1A1A] text-xs px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sector Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Services', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'halls', label: 'Marriage Halls & Mandapams', icon: <Building2 className="w-3.5 h-3.5" /> },
            { id: 'caterers', label: 'Caterers & Feasts', icon: <Utensils className="w-3.5 h-3.5" /> },
            { id: 'photographers', label: 'Photographers', icon: <Camera className="w-3.5 h-3.5" /> },
            { id: 'decorations', label: 'Decor Themes', icon: <Palette className="w-3.5 h-3.5" /> }
          ].map((tab) => {
            const isSelected = filters.category === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-sector-${tab.id}`}
                onClick={() => onFilterChange({ category: tab.id as ServiceCategory })}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-[#C5A059] shadow-2xs'
                    : 'bg-[#F9F7F2] hover:bg-[#EAE4D7]/60 text-[#555555] hover:text-[#1A1A1A] border border-[#E5E0D5]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* Quick Occasion Selection Bar */}
      <div className="py-3 border-b border-[#F0EBE1] flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-[#888888] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
          <Gift className="w-3 h-3 text-[#C5A059]" /> Quick Occasion:
        </span>
        {[
          { label: 'All Celebrations', val: 'All Occasions (Birthdays, Weddings, Traditional Rites)' },
          { label: '🎂 1st Birthday & Milestones', val: '1st Year Birthday & Baby Milestones (Ayushya Homam / Janmadin / Cake Smash)' },
          { label: '🪔 Sacred Vedic & Upanayanam', val: 'Sacred Vedic & Traditional Rites (Upanayanam / Poonal / Janeu / Homa)' },
          { label: '💍 Weddings & Receptions', val: 'Weddings, Engagements & Receptions' },
          { label: '👑 Milestone 60th / 80th', val: 'Milestone Birthdays (Sashtiapthapoorthi 60th / Shathabhishekam 80th / Golden 50th)' },
          { label: '🌸 Baby Showers (Godh Bharai)', val: 'Baby Showers & Motherhood (Godh Bharai / Seemantham / Valakaappu)' }
        ].map((quickOccasion) => {
          const isActive = (filters.occasion || 'All Occasions (Birthdays, Weddings, Traditional Rites)') === quickOccasion.val;
          return (
            <button
              key={quickOccasion.label}
              onClick={() => onFilterChange({ occasion: quickOccasion.val })}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#8C6A24] text-white shadow-2xs'
                  : 'bg-[#F9F7F2] hover:bg-[#EAE4D7] text-[#555555] border border-[#E5E0D5]'
              }`}
            >
              {quickOccasion.label}
            </button>
          );
        })}
      </div>

      {/* Core Universal Filter Grid: Location, Occasion, Religious Tradition, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 items-end">
        
        {/* 1. Location / Halls Near Me */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              Pan-India City (A to Z)
            </label>
            <button
              id="halls-near-me-btn"
              onClick={handleNearMeToggle}
              disabled={isDetectingLocation}
              className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                filters.location !== 'All Locations (India)' && filters.location !== 'All Locations'
                  ? 'bg-[#1A1A1A] text-[#C5A059] shadow-2xs border border-[#C5A059]/40'
                  : 'bg-[#F7F3EB] text-[#8C6A24] hover:bg-[#EAE4D7] border border-[#C5A059]/30'
              }`}
              title="Detect current GPS location in India"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-[#C5A059]" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3 h-3 text-[#C5A059]" />
                  <span>Near Me</span>
                </>
              )}
            </button>
          </div>

          <select
            id="location-filter-select"
            value={filters.location}
            onChange={(e) => {
              onFilterChange({ location: e.target.value });
            }}
            className="w-full bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          >
            {LOCATIONS_LIST.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {geoResult && (
            <p className="text-[10px] text-[#246A42] font-medium flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#246A42] animate-pulse"></span>
              GPS Located: {geoResult.cityLabel}
            </p>
          )}
        </div>

        {/* 2. Occasion Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-[#D97706]" />
            Purpose / Occasion
          </label>
          <select
            id="occasion-filter-select"
            value={filters.occasion || 'All Occasions (Birthdays, Weddings, Traditional Rites)'}
            onChange={(e) => onFilterChange({ occasion: e.target.value })}
            className="w-full bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          >
            {OCCASIONS_LIST.map((occ) => (
              <option key={occ} value={occ}>{occ}</option>
            ))}
          </select>
        </div>

        {/* 3. Religious / Cultural Tradition Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#9333EA]" />
            Faith & Tradition
          </label>
          <select
            id="religion-filter-select"
            value={filters.religiousTradition || 'All Faiths & Cultural Traditions'}
            onChange={(e) => onFilterChange({ religiousTradition: e.target.value })}
            className="w-full bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-3 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          >
            {RELIGIONS_TRADITIONS_LIST.map((rel) => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        {/* 4. Budget / Price Range */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#246A42]" />
              Price Range (INR)
            </label>
            <span className="text-xs font-bold text-[#246A42] font-mono">
              {getPriceLabel()}
            </span>
          </div>

          <div className="px-1 py-1">
            <input
              id="price-range-slider"
              type="range"
              min={getPriceMinLimit()}
              max={getPriceMaxLimit()}
              step={getPriceStep()}
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#C5A059] cursor-pointer h-1.5 bg-[#E5E0D5] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#888888] font-mono mt-1">
              <span>{formatINR(getPriceMinLimit(), true)}</span>
              <span>{formatINR(getPriceMaxLimit(), true)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Date & Booking Status Layer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 items-end">
        {/* Availability Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#36427D]" />
            Auspicious Date / Muhurtham
          </label>

          <input
            id="date-filter-picker"
            type="date"
            value={filters.selectedDate}
            onChange={(e) => onFilterChange({ selectedDate: e.target.value })}
            className="w-full bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          />
        </div>

        {/* Live Booking Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            Live Booking Status
          </label>

          <select
            id="status-filter-select"
            value={filters.availabilityStatus}
            onChange={(e) => onFilterChange({ availabilityStatus: e.target.value })}
            className="w-full bg-[#FDFCFB] border border-[#E5E0D5] rounded-lg px-3.5 py-2 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] cursor-pointer"
          >
            <option value="All">All Live Statuses</option>
            <option value="Available">Available Only</option>
            <option value="Fast Filling">Fast Filling (Limited Dates)</option>
          </select>
        </div>

        {/* More Filters Toggle */}
        <div className="flex items-center justify-end pb-1">
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="text-xs font-semibold text-[#8C6A24] hover:text-[#C5A059] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F7F3EB] border border-[#C5A059]/30 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {isAdvancedOpen ? 'Hide Specialized Filters' : 'Specialized Diet & Rating Filters'}
          </button>
        </div>
      </div>

      {/* Advanced Sector Specific Filtering Layer */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-[#F0EBE1] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Star Rating threshold */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#666666] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              Minimum Star Rating
            </label>
            <div className="flex gap-2">
              {[0, 4.8, 4.9, 4.95].map((ratingVal) => (
                <button
                  key={ratingVal}
                  onClick={() => onFilterChange({ minRating: ratingVal })}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filters.minRating === ratingVal
                      ? 'bg-[#C5A059] text-white shadow-2xs'
                      : 'bg-[#F9F7F2] hover:bg-[#EAE4D7]/60 text-[#555555] border border-[#E5E0D5]'
                  }`}
                >
                  {ratingVal === 0 ? 'All' : `${ratingVal}+ ★`}
                </button>
              ))}
            </div>
          </div>

          {/* Caterer Dietary Filter */}
          {(filters.category === 'all' || filters.category === 'caterers') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#666666] flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-[#246A42]" />
                Catering Dietary Preference
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Diet' },
                  { id: 'Pure Veg', label: 'Pure Veg / Satvik' },
                  { id: 'Non-Veg & Mixed', label: 'Non-Veg / Halal' }
                ].map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => onFilterChange({ dietaryFilter: diet.id as any })}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filters.dietaryFilter === diet.id
                        ? 'bg-[#246A42] text-white shadow-2xs'
                        : 'bg-[#F9F7F2] hover:bg-[#EAE4D7]/60 text-[#555555] border border-[#E5E0D5]'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hall Top-Rated Filter & Decor Sorting */}
          {(filters.category === 'all' || filters.category === 'halls') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#666666] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                Marriage Hall Layer
              </label>
              <button
                id="top-rated-halls-toggle"
                onClick={() => onFilterChange({ hallTopRatedOnly: !filters.hallTopRatedOnly })}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  filters.hallTopRatedOnly
                    ? 'bg-[#1A1A1A] text-[#C5A059] shadow-2xs'
                    : 'bg-[#F9F7F2] hover:bg-[#EAE4D7]/60 text-[#555555] border border-[#E5E0D5]'
                }`}
              >
                <span>🏆 Top-Rated Halls Only (4.9+ ★)</span>
                <span className={`w-2 h-2 rounded-full ${filters.hallTopRatedOnly ? 'bg-[#C5A059]' : 'bg-[#AAAAAA]'}`} />
              </button>
            </div>
          )}

          {(filters.category === 'all' || filters.category === 'decorations') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#666666] flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-[#9E3636]" />
                Decor Dynamic Sorting
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'top-rated', label: 'Top-Rated' },
                  { id: 'most-liked', label: 'Most Liked ❤️' }
                ].map((sortMode) => (
                  <button
                    key={sortMode.id}
                    onClick={() => onFilterChange({ decorSortBy: sortMode.id as any })}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      filters.decorSortBy === sortMode.id
                        ? 'bg-[#9E3636] text-white shadow-2xs'
                        : 'bg-[#F9F7F2] hover:bg-[#EAE4D7]/60 text-[#555555] border border-[#E5E0D5]'
                    }`}
                  >
                    {sortMode.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Filter Status Bar: Result Count & Clear Button */}
      <div className="mt-4 pt-3 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#666666]">
          <span className="font-bold text-[#1A1A1A]">{totalResultsCount} Results Found</span>
          <span>•</span>
          <span>Showing verified venues & vendors in <span className="font-semibold text-[#8C6A24]">{filters.location}</span></span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMap && (
            <button
              id="filter-bar-open-map-btn"
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F7F3EB] hover:bg-[#EAE4D7] text-[#8C6A24] border border-[#C5A059]/30 transition-all font-semibold cursor-pointer text-xs"
              title="Open Interactive Pan-India Map"
            >
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Interactive Map View</span>
            </button>
          )}

          {isFiltered && (
            <button
              id="reset-all-filters-btn"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F9F7F2] border border-transparent hover:border-[#E5E0D5] transition-all font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
