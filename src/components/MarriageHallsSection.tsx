import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Star, 
  Users, 
  Car, 
  Utensils, 
  Wind, 
  Calendar, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ChevronRight, 
  Plus,
  Phone,
  Eye,
  Info,
  Navigation,
  Heart,
  MessageSquare,
  Compass
} from 'lucide-react';
import { MarriageHall, PricePackage, BundleItem } from '../types';
import { db } from '../services/databaseService';
import { formatINR, formatDistanceKm } from '../utils/formatters';

interface MarriageHallsSectionProps {
  halls: MarriageHall[];
  topRatedOnly: boolean;
  onToggleTopRated: () => void;
  onBookHall: (hall: MarriageHall, selectedPkg?: PricePackage) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleHallIds: string[];
  onOpenChatWithVendor?: (vendor: {
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
    vendorContactName?: string;
    vendorRole?: string;
  }) => void;
  onViewOnMap?: (hall: MarriageHall) => void;
}

export const MarriageHallsSection: React.FC<MarriageHallsSectionProps> = ({
  halls,
  topRatedOnly,
  onToggleTopRated,
  onBookHall,
  onAddToBundle,
  bundleHallIds,
  onOpenChatWithVendor,
  onViewOnMap
}) => {
  const [selectedPackages, setSelectedPackages] = useState<Record<string, string>>({});
  const [activeGalleryHall, setActiveGalleryHall] = useState<MarriageHall | null>(null);
  const [favRefresh, setFavRefresh] = useState(0);

  const handleSelectPackage = (hallId: string, pkgId: string) => {
    setSelectedPackages(prev => ({ ...prev, [hallId]: pkgId }));
  };

  const handleToggleFavorite = (hall: MarriageHall, e: React.MouseEvent) => {
    e.stopPropagation();
    db.toggleFavorite({
      vendorId: hall.id,
      vendorType: 'hall',
      vendorName: hall.name,
      vendorSubtitle: `${hall.location} • ${hall.tagline}`,
      vendorImage: hall.imageUrl,
      rating: hall.rating,
      priceFormatted: `${formatINR(hall.basePrice, true)} - ${formatINR(hall.pricePackages[hall.pricePackages.length - 1]?.price || hall.basePrice * 1.5, true)}`,
      location: hall.location
    });
    setFavRefresh(r => r + 1);
  };


  return (
    <section id="marriage-halls-section" className="mb-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6A24] uppercase tracking-widest bg-[#F7F3EB] px-3 py-1 rounded-full mb-2 border border-[#C5A059]/30">
            <Building2 className="w-3.5 h-3.5" /> Sector 01 • Royal Venues
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
            Marriage Halls & Palaces
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm mt-1 max-w-2xl">
            Location-based verified grand ballrooms, royal havelis, and glass waterfront pavilions with live booking statuses.
          </p>
        </div>

        {/* Top-Rated Filter Switch Layer */}
        <div className="flex items-center gap-3">
          <button
            id="halls-top-rated-filter-layer"
            onClick={onToggleTopRated}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
              topRatedOnly
                ? 'bg-[#C5A059] text-white ring-2 ring-[#C5A059]/40'
                : 'bg-white text-[#1A1A1A] border border-[#E5E0D5] hover:border-[#C5A059] hover:bg-[#F9F7F2]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${topRatedOnly ? 'text-[#FDFCFB]' : 'text-[#C5A059]'}`} />
            <span>Top-Rated Filter (4.9+ ★)</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
              topRatedOnly ? 'bg-[#8C6A24] text-white' : 'bg-[#F9F7F2] text-[#666666]'
            }`}>
              {halls.filter(h => h.rating >= 4.9).length}
            </span>
          </button>
        </div>
      </div>

      {/* Halls Grid: Location-based cards */}
      {halls.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E0D5]">
          <Building2 className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Marriage Halls Match These Filters</h3>
          <p className="text-[#888888] text-xs mt-1">Try broadening your location radius, price range, or clearing filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {halls.map((hall) => {
            const isAddedToBundle = bundleHallIds.includes(hall.id);
            const activePkgId = selectedPackages[hall.id] || hall.pricePackages[0]?.id;
            const currentPkg = hall.pricePackages.find(p => p.id === activePkgId) || hall.pricePackages[0];

            return (
              <div
                key={hall.id}
                id={`hall-card-${hall.id}`}
                className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Visual Image Banner & Live Status Badges */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-[#1A1A1A]">
                  <img
                    src={hall.imageUrl}
                    alt={hall.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badges: Distance (Halls Near Me) + Live Status */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                    {/* Halls Near Me Distance Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                      <Navigation className="w-3 h-3 text-[#C5A059]" />
                      <span>{formatDistanceKm(hall.distanceKm || hall.distanceMiles * 1.6)}</span>
                    </div>

                    {/* Live Booking Status & Favorite Heart */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                        hall.bookingStatus === 'Available'
                          ? 'bg-[#246A42] text-white'
                          : hall.bookingStatus === 'Fast Filling'
                          ? 'bg-[#C5A059] text-white animate-pulse'
                          : 'bg-[#1A1A1A] text-stone-300'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        {hall.bookingStatus === 'Fast Filling' ? `Fast Filling (${hall.availableSlotsLeft || 2} left)` : hall.bookingStatus}
                      </span>

                      {/* Wishlist Heart Toggle */}
                      <button
                        id={`fav-hall-btn-${hall.id}`}
                        onClick={(e) => handleToggleFavorite(hall, e)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                          db.isFavorite(hall.id)
                            ? 'bg-[#8C2424] text-white scale-110'
                            : 'bg-black/60 text-white hover:text-rose-400 hover:bg-black/80'
                        }`}
                        title="Save to Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${db.isFavorite(hall.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>


                  {/* Bottom Image Overlay: Title & Star Ratings */}
                  <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-auto">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 bg-[#C5A059] text-white px-2.5 py-0.5 rounded-md text-xs font-extrabold shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{hall.rating.toFixed(2)}</span>
                        <span className="text-[10px] opacity-90 font-normal">({hall.reviewCount} reviews)</span>
                      </div>
                      <span className="text-[11px] font-medium text-stone-200 bg-white/15 backdrop-blur-xs px-2.5 py-0.5 rounded-md border border-white/20">
                        {hall.acType}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                      {hall.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                  
                  {/* Location & Tagline */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-start gap-2 text-[#1A1A1A] text-xs font-medium">
                        <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-[#1A1A1A]">{hall.location}</span>
                          <span className="text-[#666666] block text-[11px]">{hall.area}</span>
                        </div>
                      </div>

                      {onViewOnMap && (
                        <button
                          type="button"
                          onClick={() => onViewOnMap(hall)}
                          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#8C6A24] bg-[#F7F3EB] hover:bg-[#EAE4D7] px-2 py-1 rounded-md border border-[#C5A059]/30 transition-colors cursor-pointer"
                          title="Locate on Pan-India Map"
                        >
                          <Compass className="w-3 h-3 text-[#C5A059]" />
                          <span>Map</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                      {hall.tagline}
                    </p>
                  </div>

                  {/* Specs Matrix: Guest Capacity, Dining, Parking */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#666666] font-medium">
                        <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Capacity</span>
                      </div>
                      <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                        {hall.capacityMin} - {hall.capacityMax}
                      </div>
                    </div>

                    <div className="border-x border-[#E5E0D5]">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#666666] font-medium">
                        <Utensils className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Dining</span>
                      </div>
                      <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                        {hall.diningCapacity} seated
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-[11px] text-[#666666] font-medium">
                        <Car className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Valet</span>
                      </div>
                      <div className="text-xs font-bold text-[#1A1A1A] mt-0.5">
                        {hall.parkingCapacity}+ cars
                      </div>
                    </div>
                  </div>

                  {/* Available Time Windows & Days */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[#666666] uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" /> Available Time Windows & Days
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {hall.availableTimeWindows.map((tw, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-[#F9F7F2] text-[#555555] px-2.5 py-1 rounded-md border border-[#E5E0D5] font-medium"
                        >
                          {tw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Occasion & Sacred Tradition Tags */}
                  {hall.suitableOccasions && hall.suitableOccasions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" /> Ideal For Occasions & Rites
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {hall.suitableOccasions.slice(0, 3).map((occ, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-semibold"
                          >
                            {occ}
                          </span>
                        ))}
                        {hall.religiousTraditions?.map((rel, idx) => (
                          <span
                            key={`rel-${idx}`}
                            className="text-[10px] bg-[#FAF5FF] text-[#7E22CE] px-2 py-0.5 rounded-full border border-[#E9D5FF] font-medium"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Packages Selector */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1A1A1A]">Select Price Package:</span>
                      <span className="text-[11px] text-[#8C6A24] font-semibold">{hall.pricePackages.length} Tiers Available</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {hall.pricePackages.map((pkg) => {
                        const isPkgActive = activePkgId === pkg.id;
                        return (
                          <button
                            key={pkg.id}
                            id={`pkg-select-${hall.id}-${pkg.id}`}
                            onClick={() => handleSelectPackage(hall.id, pkg.id)}
                            className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                              isPkgActive
                                ? 'bg-[#F7F3EB] border-[#C5A059] ring-1 ring-[#C5A059]/50 shadow-2xs'
                                : 'bg-white border-[#E5E0D5] hover:border-[#C5A059]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isPkgActive ? 'text-[#8C6A24]' : 'text-[#1A1A1A]'}`}>
                                  {pkg.name}
                                </span>
                                {pkg.isPopular && (
                                  <span className="text-[9px] bg-[#C5A059] text-white px-1 rounded-sm font-bold">VIP</span>
                                )}
                              </div>
                              <span className="text-[10px] text-[#888888] block truncate">{pkg.duration}</span>
                            </div>
                            <div className="mt-2 text-xs font-bold text-[#1A1A1A] font-mono">
                              {formatINR(pkg.price)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Package Highlight Inclusions */}
                    {currentPkg && (
                      <div className="p-3 bg-[#F7F3EB]/60 rounded-xl border border-[#C5A059]/30 text-xs space-y-1">
                        <span className="text-[11px] font-bold text-[#8C6A24] block mb-1">
                          Inclusions for {currentPkg.name}:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#555555]">
                          {currentPkg.features.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-[#C5A059] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions: "Check Dates / Book Now", "Live Chat", & "Add to Wedding Package" */}
                  <div className="pt-3 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-stretch gap-2.5">
                    
                    {/* Primary Booking Button */}
                    <button
                      id={`book-hall-btn-${hall.id}`}
                      onClick={() => onBookHall(hall, currentPkg)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>Book Now ({currentPkg ? formatINR(currentPkg.price) : formatINR(hall.basePrice)})</span>
                    </button>

                    {/* Chat with Venue Concierge Button */}
                    {onOpenChatWithVendor && (
                      <button
                        id={`chat-hall-btn-${hall.id}`}
                        onClick={() => onOpenChatWithVendor({
                          vendorId: hall.id,
                          vendorType: 'hall',
                          vendorName: hall.name,
                          vendorSubtitle: `${hall.location} • Royal Venue`,
                          vendorAvatar: hall.imageUrl,
                          vendorContactName: 'Grand Ballroom Concierge',
                          vendorRole: 'Senior Venue Director'
                        })}
                        className="px-3.5 py-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F0EBE1] text-[#1A1A1A] border border-[#E5E0D5] hover:border-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        title="Chat directly with Venue Director"
                      >
                        <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                        <span>Chat</span>
                      </button>
                    )}

                    {/* Add to Wedding Bundle Button */}
                    <button
                      id={`bundle-hall-btn-${hall.id}`}
                      onClick={() => onAddToBundle({
                        type: 'hall',
                        item: hall,
                        selectedPackage: currentPkg?.name,
                        estimatedCost: currentPkg?.price || hall.basePrice
                      })}
                      className={`px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isAddedToBundle
                          ? 'bg-[#C5A059] text-white border-[#C5A059] shadow-2xs'
                          : 'bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                      }`}
                    >
                      {isAddedToBundle ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>In Package</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-[#C5A059]" />
                          <span>Add to Package</span>
                        </>
                      )}
                    </button>

                  </div>


                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
