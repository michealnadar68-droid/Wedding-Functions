import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Check, 
  Plus, 
  Film, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Video, 
  Layers, 
  Clock, 
  Compass,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Photographer, BundleItem } from '../types';
import { db } from '../services/databaseService';
import { formatINR, formatPerDay, formatDistanceKm } from '../utils/formatters';

interface PhotographersSectionProps {
  photographers: Photographer[];
  onBookPhotographer: (photographer: Photographer, selectedDate?: string) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundlePhotographerIds: string[];
  onOpenChatWithVendor?: (vendor: {
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
    vendorContactName?: string;
    vendorRole?: string;
  }) => void;
}

export const PhotographersSection: React.FC<PhotographersSectionProps> = ({
  photographers,
  onBookPhotographer,
  onAddToBundle,
  bundlePhotographerIds,
  onOpenChatWithVendor
}) => {
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [selectedDates, setSelectedDates] = useState<Record<string, string>>({});
  const [expandedCalendarId, setExpandedCalendarId] = useState<string | null>(null);
  const [favRefresh, setFavRefresh] = useState(0);

  const handleNextImage = (photographerId: string, maxImages: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [photographerId]: ((prev[photographerId] || 0) + 1) % maxImages
    }));
  };

  const handlePrevImage = (photographerId: string, maxImages: number) => {
    setActiveImageIndexes(prev => ({
      ...prev,
      [photographerId]: ((prev[photographerId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  const handleSelectDate = (photographerId: string, dateStr: string) => {
    setSelectedDates(prev => ({ ...prev, [photographerId]: dateStr }));
  };

  const handleToggleFavorite = (photographer: Photographer, e: React.MouseEvent) => {
    e.stopPropagation();
    db.toggleFavorite({
      vendorId: photographer.id,
      vendorType: 'photographer',
      vendorName: photographer.name,
      vendorSubtitle: `${photographer.location} • ${photographer.specialties.join(', ')}`,
      vendorImage: photographer.portfolioImages[0]?.url || photographer.imageUrl,
      rating: photographer.rating,
      priceFormatted: `${formatPerDay(photographer.pricePerDay)}`,
      location: photographer.location
    });
    setFavRefresh(r => r + 1);
  };



  // Generate 14 upcoming auspicious calendar days for interactive grid
  const upcomingDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(2026, 7, 20 + i); // Starts Aug 20, 2026
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum };
  });

  return (
    <section id="photographers-section" className="mb-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6A24] uppercase tracking-widest bg-[#F7F3EB] px-3 py-1 rounded-full mb-2 border border-[#C5A059]/30">
            <Camera className="w-3.5 h-3.5" /> Sector 03 • Cinematographers & Visual Artists
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
            Photographers Registry & Availability
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm mt-1 max-w-2xl">
            Verified master wedding cinematographers with 4K drone reels, editorial fine-art portraits, and live interactive date locking.
          </p>
        </div>

        {/* Legend for Availability Calendar */}
        <div className="flex items-center gap-3 text-xs font-medium text-[#666666] bg-white px-3.5 py-2 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <span className="text-[11px] font-bold text-[#888888] uppercase">Calendar Legend:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#246A42]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059]" />
            <span>Fast Filling</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C2424]" />
            <span>Booked</span>
          </div>
        </div>
      </div>

      {/* Photographers Grid */}
      {photographers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E0D5]">
          <Camera className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Photographers Match These Criteria</h3>
          <p className="text-[#888888] text-xs mt-1">Try expanding your price range or selecting 'All Locations'.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {photographers.map((photographer) => {
            const isAddedToBundle = bundlePhotographerIds.includes(photographer.id);
            const activeImgIdx = activeImageIndexes[photographer.id] || 0;
            const currentImg = photographer.portfolioImages[activeImgIdx] || photographer.portfolioImages[0];
            const activeSelectedDate = selectedDates[photographer.id] || '2026-08-28';

            return (
              <div
                key={photographer.id}
                id={`photographer-card-${photographer.id}`}
                className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Visual Portfolio Carousel */}
                  <div className="relative h-64 sm:h-72 overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={currentImg?.url || photographer.imageUrl}
                      alt={currentImg?.title || photographer.name}
                      className="w-full h-full object-cover transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Left & Right Portfolio Carousel Navigation */}
                    {photographer.portfolioImages.length > 1 && (
                      <>
                        <button
                          onClick={() => handlePrevImage(photographer.id, photographer.portfolioImages.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                          aria-label="Previous portfolio photo"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleNextImage(photographer.id, photographer.portfolioImages.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                          aria-label="Next portfolio photo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                        <Film className="w-3 h-3 text-[#C5A059]" />
                        <span>{photographer.experienceYears} Years Exp.</span>
                      </div>

                      {/* Live Booking Status & Wishlist Heart */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                          photographer.bookingStatus === 'Available' ? 'bg-[#246A42]' : 'bg-[#C5A059]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {photographer.bookingStatus}
                        </span>

                        <button
                          id={`fav-photographer-btn-${photographer.id}`}
                          onClick={(e) => handleToggleFavorite(photographer, e)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                            db.isFavorite(photographer.id)
                              ? 'bg-[#8C2424] text-white scale-110'
                              : 'bg-black/60 text-white hover:text-rose-400 hover:bg-black/80'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${db.isFavorite(photographer.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>


                    {/* Bottom Image Overlay: Photo Title + Rating */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 bg-[#C5A059] text-white px-2 py-0.5 rounded-md text-xs font-extrabold shadow-2xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{photographer.rating.toFixed(2)}</span>
                          <span className="text-[10px] opacity-90 font-normal">({photographer.reviewCount})</span>
                        </div>
                        <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono">
                          {activeImgIdx + 1} of {photographer.portfolioImages.length} Shots
                        </span>
                      </div>
                      <p className="text-xs font-medium text-stone-200 line-clamp-1 italic">
                        "{currentImg?.title} — {currentImg?.caption}"
                      </p>
                    </div>
                  </div>

                  {/* Portfolio Thumbnails Bar */}
                  <div className="flex gap-1.5 p-2 bg-[#F9F7F2] border-b border-[#E5E0D5] overflow-x-auto scrollbar-none">
                    {photographer.portfolioImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndexes(prev => ({ ...prev, [photographer.id]: idx }))}
                        className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeImgIdx === idx ? 'border-[#C5A059] scale-105 shadow-2xs' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Studio Name & Location */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] leading-tight">
                            {photographer.name}
                          </h3>
                          <span className="text-xs font-semibold text-[#8C6A24] block">
                            {photographer.studioName}
                          </span>
                        </div>

                        {/* Price Per Day */}
                        <div className="text-right">
                          <div className="text-[10px] text-[#888888] font-bold uppercase">Booking Rate</div>
                          <div className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] font-mono">
                            {formatPerDay(photographer.pricePerDay)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-[#666666] mt-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-medium text-[#1A1A1A]">{photographer.location}</span>
                        <span className="text-[#888888]">({formatDistanceKm(photographer.travelRadiusKm || photographer.travelRadiusMiles * 1.6)} coverage)</span>
                      </div>
                    </div>

                    {/* Specialties Chips */}
                    <div className="flex flex-wrap gap-1">
                      {photographer.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-[10px] bg-[#F9F7F2] text-[#555555] px-2 py-0.5 rounded-md border border-[#E5E0D5] font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Occasions & Sacred Traditions */}
                    {photographer.suitableOccasions && photographer.suitableOccasions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {photographer.suitableOccasions.slice(0, 3).map((occ, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-semibold"
                          >
                            {occ}
                          </span>
                        ))}
                        {photographer.religiousTraditions?.map((rel, idx) => (
                          <span
                            key={`rel-${idx}`}
                            className="text-[10px] bg-[#FAF5FF] text-[#7E22CE] px-2 py-0.5 rounded-full border border-[#E9D5FF] font-medium"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* INTERACTIVE AVAILABILITY CALENDAR DISPLAY */}
                    <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Interactive Availability Calendar:</span>
                        </span>
                        <span className="text-[11px] font-mono font-bold text-[#8C6A24] bg-[#F7F3EB] px-2 py-0.5 rounded-md border border-[#C5A059]/40">
                          {activeSelectedDate ? `Selected: ${activeSelectedDate}` : 'Pick a Date'}
                        </span>
                      </div>

                      {/* Mini Scrollable 14-Day Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {upcomingDays.slice(0, 7).map(({ dateStr, dayName, dayNum }) => {
                          const isBooked = photographer.bookedDates.includes(dateStr);
                          const isFastFilling = photographer.fastFillingDates.includes(dateStr);
                          const isSelected = activeSelectedDate === dateStr;

                          return (
                            <button
                              key={dateStr}
                              disabled={isBooked}
                              onClick={() => handleSelectDate(photographer.id, dateStr)}
                              title={isBooked ? 'Booked' : isFastFilling ? 'Fast Filling' : 'Available'}
                              className={`p-1.5 rounded-lg text-center border transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                                  : isBooked
                                  ? 'bg-[#8C2424]/10 text-[#8C2424]/40 border-[#8C2424]/20 cursor-not-allowed line-through opacity-60'
                                  : isFastFilling
                                  ? 'bg-[#F7F3EB] text-[#8C6A24] border-[#C5A059]/40 hover:bg-[#F7F3EB]/80 cursor-pointer'
                                  : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:bg-[#F9F7F2] cursor-pointer'
                              }`}
                            >
                              <span className="text-[9px] font-medium block uppercase">{dayName}</span>
                              <span className="text-xs font-bold block">{dayNum}</span>
                              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                                isBooked ? 'bg-[#8C2424]' : isFastFilling ? 'bg-[#C5A059]' : 'bg-[#246A42]'
                              }`} />
                            </button>
                          );
                        })}
                      </div>

                      {/* Second Row of upcoming dates */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {upcomingDays.slice(7, 14).map(({ dateStr, dayName, dayNum }) => {
                          const isBooked = photographer.bookedDates.includes(dateStr);
                          const isFastFilling = photographer.fastFillingDates.includes(dateStr);
                          const isSelected = activeSelectedDate === dateStr;

                          return (
                            <button
                              key={dateStr}
                              disabled={isBooked}
                              onClick={() => handleSelectDate(photographer.id, dateStr)}
                              title={isBooked ? 'Booked' : isFastFilling ? 'Fast Filling' : 'Available'}
                              className={`p-1.5 rounded-lg text-center border transition-all flex flex-col items-center justify-center ${
                                isSelected
                                  ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                                  : isBooked
                                  ? 'bg-[#8C2424]/10 text-[#8C2424]/40 border-[#8C2424]/20 cursor-not-allowed line-through opacity-60'
                                  : isFastFilling
                                  ? 'bg-[#F7F3EB] text-[#8C6A24] border-[#C5A059]/40 hover:bg-[#F7F3EB]/80 cursor-pointer'
                                  : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:bg-[#F9F7F2] cursor-pointer'
                              }`}
                            >
                              <span className="text-[9px] font-medium block uppercase">{dayName}</span>
                              <span className="text-xs font-bold block">{dayNum}</span>
                              <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                                isBooked ? 'bg-[#8C2424]' : isFastFilling ? 'bg-[#C5A059]' : 'bg-[#246A42]'
                              }`} />
                            </button>
                          );
                        })}
                      </div>

                    </div>

                    {/* Key Deliverables Bullet Points */}
                    <div className="space-y-1.5 text-xs text-[#666666]">
                      <span className="text-[11px] font-bold text-[#1A1A1A] block">Package Inclusions:</span>
                      <ul className="space-y-1 text-[11px]">
                        {photographer.deliverables.slice(0, 3).map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Bottom Actions: "Book Now / Check Dates", "Live Chat", + "Add to Package" */}
                <div className="p-5 sm:p-6 pt-0 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-stretch gap-2.5">
                  <button
                    id={`book-photographer-btn-${photographer.id}`}
                    onClick={() => onBookPhotographer(photographer, activeSelectedDate)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <CalendarIcon className="w-4 h-4 text-[#C5A059]" />
                    <span>Lock Date ({formatINR(photographer.pricePerDay)})</span>
                  </button>

                  {onOpenChatWithVendor && (
                    <button
                      id={`chat-photographer-btn-${photographer.id}`}
                      onClick={() => onOpenChatWithVendor({
                        vendorId: photographer.id,
                        vendorType: 'photographer',
                        vendorName: photographer.name,
                        vendorSubtitle: `${photographer.location} • Cinema & Photography`,
                        vendorAvatar: photographer.imageUrl,
                        vendorContactName: photographer.name.split(' ')[0] + ' Studio Team',
                        vendorRole: 'Lead Cinematographer'
                      })}
                      className="px-3.5 py-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F0EBE1] text-[#1A1A1A] border border-[#E5E0D5] hover:border-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Chat directly with Lead Cinematographer"
                    >
                      <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                      <span>Chat</span>
                    </button>
                  )}

                  <button
                    id={`bundle-photographer-btn-${photographer.id}`}
                    onClick={() => onAddToBundle({
                      type: 'photographer',
                      item: photographer,
                      selectedPackage: `Full Day Cinema (${activeSelectedDate})`,
                      estimatedCost: photographer.pricePerDay
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
            );
          })}
        </div>
      )}

    </section>
  );
};
