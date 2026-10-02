import React, { useState } from 'react';
import { 
  Utensils, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  UserCheck, 
  Leaf, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Plus, 
  Check, 
  Calendar,
  Calculator,
  Award,
  BookOpen,
  Heart,
  MessageSquare
} from 'lucide-react';
import { Caterer, MenuItem, BundleItem } from '../types';
import { db } from '../services/databaseService';
import { formatINR, formatPerPlate } from '../utils/formatters';

interface CaterersSectionProps {
  caterers: Caterer[];
  dietaryFilter: 'all' | 'Pure Veg' | 'Non-Veg & Mixed';
  onSetDietaryFilter: (diet: 'all' | 'Pure Veg' | 'Non-Veg & Mixed') => void;
  onOpenMenuModal: (caterer: Caterer) => void;
  onBookCaterer: (caterer: Caterer, estimatedCost: number, guestCount: number) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleCatererIds: string[];
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

export const CaterersSection: React.FC<CaterersSectionProps> = ({
  caterers,
  dietaryFilter,
  onSetDietaryFilter,
  onOpenMenuModal,
  onBookCaterer,
  onAddToBundle,
  bundleCatererIds,
  onOpenChatWithVendor
}) => {
  const [expandedMenuCatererId, setExpandedMenuCatererId] = useState<string | null>(null);
  const [guestCounts, setGuestCounts] = useState<Record<string, number>>({});
  const [favRefresh, setFavRefresh] = useState(0);

  const toggleMenuDropdown = (catererId: string) => {
    setExpandedMenuCatererId(prev => (prev === catererId ? null : catererId));
  };

  const handleGuestCountChange = (catererId: string, count: number) => {
    setGuestCounts(prev => ({ ...prev, [catererId]: count }));
  };

  const handleToggleFavorite = (caterer: Caterer, e: React.MouseEvent) => {
    e.stopPropagation();
    db.toggleFavorite({
      vendorId: caterer.id,
      vendorType: 'caterer',
      vendorName: caterer.name,
      vendorSubtitle: `${caterer.location} • ${caterer.tagline}`,
      vendorImage: caterer.imageUrl,
      rating: caterer.rating,
      priceFormatted: `${formatPerPlate(caterer.costPerPlate)}`,
      location: caterer.location
    });
    setFavRefresh(r => r + 1);
  };



  return (
    <section id="caterers-section" className="mb-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6A24] uppercase tracking-widest bg-[#F7F3EB] px-3 py-1 rounded-full mb-2 border border-[#C5A059]/30">
            <Utensils className="w-3.5 h-3.5" /> Sector 02 • Haute Cuisine & Banquets
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
            Caterers Directory & Signature Menus
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm mt-1 max-w-2xl">
            Sattvic Pure Vegetarian royal feasts and Continental Non-Veg gourmet banquets with interactive course previews.
          </p>
        </div>

        {/* Dietary Preference Segmented Tabs */}
        <div className="flex items-center gap-1.5 bg-[#F9F7F2] p-1.5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <button
            id="dietary-tab-all"
            onClick={() => onSetDietaryFilter('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dietaryFilter === 'all'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            All Kitchens
          </button>
          
          <button
            id="dietary-tab-pure-veg"
            onClick={() => onSetDietaryFilter('Pure Veg')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dietaryFilter === 'Pure Veg'
                ? 'bg-[#246A42] text-white shadow-xs'
                : 'text-[#246A42] hover:bg-[#246A42]/10'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span>Pure Veg</span>
          </button>

          <button
            id="dietary-tab-non-veg"
            onClick={() => onSetDietaryFilter('Non-Veg & Mixed')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              dietaryFilter === 'Non-Veg & Mixed'
                ? 'bg-[#8C2424] text-white shadow-xs'
                : 'text-[#8C2424] hover:bg-[#8C2424]/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-300" />
            <span>Non-Veg & Mixed</span>
          </button>
        </div>
      </div>

      {/* Caterers Grid */}
      {caterers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E0D5]">
          <Utensils className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Caterers Match This Dietary / Price Filter</h3>
          <p className="text-[#888888] text-xs mt-1">Try switching to 'All Kitchens' or adjusting price per plate filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caterers.map((caterer) => {
            const isPureVeg = caterer.dietaryType === 'Pure Veg';
            const isAddedToBundle = bundleCatererIds.includes(caterer.id);
            const isMenuExpanded = expandedMenuCatererId === caterer.id;
            const currentGuestCount = guestCounts[caterer.id] || caterer.minimumPlates || 250;
            const estimatedCateringTotal = currentGuestCount * caterer.costPerPlate;

            return (
              <div
                key={caterer.id}
                id={`caterer-card-${caterer.id}`}
                className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image & Dietary Badge */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={caterer.imageUrl}
                      alt={caterer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {/* Dietary Type Chip */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md border ${
                        isPureVeg
                          ? 'bg-[#246A42]/90 text-emerald-100 border-emerald-500/40 backdrop-blur-md'
                          : 'bg-[#8C2424]/90 text-rose-100 border-rose-500/40 backdrop-blur-md'
                      }`}>
                        {isPureVeg ? <Leaf className="w-3.5 h-3.5 text-emerald-300" /> : <Flame className="w-3.5 h-3.5 text-rose-300" />}
                        <span>{caterer.dietaryType}</span>
                      </span>

                      {/* Live Booking Status & Wishlist Heart */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                          caterer.bookingStatus === 'Available' ? 'bg-[#246A42]' : 'bg-[#C5A059]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {caterer.bookingStatus}
                        </span>

                        <button
                          id={`fav-caterer-btn-${caterer.id}`}
                          onClick={(e) => handleToggleFavorite(caterer, e)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                            db.isFavorite(caterer.id)
                              ? 'bg-[#8C2424] text-white scale-110'
                              : 'bg-black/60 text-white hover:text-rose-400 hover:bg-black/80'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${db.isFavorite(caterer.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>


                    {/* Title & Star Rating on bottom overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1.5 bg-[#C5A059] text-white px-2 py-0.5 rounded-md text-xs font-extrabold shadow-2xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{caterer.rating.toFixed(2)}</span>
                          <span className="text-[10px] opacity-90 font-normal">({caterer.reviewCount})</span>
                        </div>
                        <span className="text-[11px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                          Min. {caterer.minimumPlates} Plates
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                        {caterer.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Location, Pricing, Coordinator Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0EBE1]">
                      <div>
                        <div className="flex items-center gap-1.5 text-[#1A1A1A] text-xs font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                          <span className="font-bold text-[#1A1A1A]">{caterer.location}</span>
                          <span className="text-[#888888]">({caterer.area})</span>
                        </div>
                        <div className="text-[11px] text-[#666666] mt-0.5 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-[#246A42]" />
                          <span>Head Chef: <strong className="text-[#1A1A1A]">{caterer.coordinatorName}</strong></span>
                        </div>
                      </div>

                      {/* Base Price Per Plate */}
                      <div className="text-left sm:text-right bg-[#F9F7F2] sm:bg-transparent p-2.5 sm:p-0 rounded-xl border sm:border-0 border-[#E5E0D5]">
                        <div className="text-[10px] text-[#888888] uppercase tracking-wider font-semibold">Starting Base Rate</div>
                        <div className="text-xl sm:text-2xl font-extrabold text-[#246A42] font-mono">
                          {formatPerPlate(caterer.costPerPlate)}
                        </div>
                      </div>
                    </div>

                    {/* Cuisine Specialties Chips */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-[#666666] uppercase tracking-wider">
                        Cuisine Specialties & Feasts
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {caterer.cuisineSpecialties.map((spec, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#F9F7F2] text-[#555555] px-2.5 py-1 rounded-md border border-[#E5E0D5] font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Suitable Occasions & Religious Traditions Chips */}
                    {caterer.suitableOccasions && caterer.suitableOccasions.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Specializes For Occasions
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {caterer.suitableOccasions.map((occ, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30 font-semibold"
                            >
                              {occ}
                            </span>
                          ))}
                          {caterer.religiousTraditions?.map((rel, idx) => (
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

                    {/* Contact Details Bar */}
                    <div className="p-3 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-[#666666]">
                        <a 
                          href={`tel:${caterer.contactPhone}`}
                          className="flex items-center gap-1.5 font-bold text-[#1A1A1A] hover:text-[#8C6A24] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{caterer.contactPhone}</span>
                        </a>
                        <span className="hidden sm:inline text-[#CCCCCC]">•</span>
                        <a 
                          href={`mailto:${caterer.contactEmail}`}
                          className="hidden sm:flex items-center gap-1.5 text-[#666666] hover:text-[#1A1A1A]"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#888888]" />
                          <span>{caterer.contactEmail}</span>
                        </a>
                      </div>

                      <button
                        onClick={() => onOpenMenuModal(caterer)}
                        className="text-xs font-bold text-[#8C6A24] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer underline decoration-[#C5A059]/50"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Full Menu Brochure</span>
                      </button>
                    </div>

                    {/* Interactive Dropdown: Signature / Special Menu Items */}
                    <div className="border border-[#C5A059]/40 bg-[#F7F3EB]/40 rounded-xl overflow-hidden">
                      <button
                        id={`toggle-signature-menu-${caterer.id}`}
                        onClick={() => toggleMenuDropdown(caterer.id)}
                        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F7F3EB]/80 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#C5A059]" />
                          <div>
                            <span className="text-xs font-bold text-[#1A1A1A] block">
                              Signature / Special Menu Items Preview ({caterer.signatureDishes.length} items)
                            </span>
                            <span className="text-[10px] text-[#666666]">
                              Click to view live counters, starters & dessert pairings
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-bold text-[#8C6A24]">
                          <span>{isMenuExpanded ? 'Hide' : 'Expand Menu'}</span>
                          {isMenuExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Dropdown Content */}
                      {isMenuExpanded && (
                        <div className="p-4 bg-white border-t border-[#C5A059]/30 space-y-3 animate-in fade-in duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {caterer.signatureDishes.map((dish) => (
                              <div
                                key={dish.id}
                                className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#E5E0D5] space-y-1"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-bold text-[#1A1A1A] line-clamp-1">
                                    {dish.name}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${
                                    dish.isVeg ? 'bg-[#246A42]/15 text-[#246A42]' : 'bg-[#8C2424]/15 text-[#8C2424]'
                                  }`}>
                                    {dish.isVeg ? 'VEG' : 'NON-VEG'}
                                  </span>
                                </div>
                                <span className="text-[10px] font-semibold text-[#8C6A24] block">
                                  {dish.category}
                                </span>
                                <p className="text-[11px] text-[#666666] line-clamp-2 leading-relaxed">
                                  {dish.description}
                                </p>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {dish.dietaryTags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[9px] bg-[#F7F3EB] text-[#8C6A24] px-1.5 py-0.5 rounded-md font-medium border border-[#C5A059]/30">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="text-center pt-1">
                            <button
                              onClick={() => onOpenMenuModal(caterer)}
                              className="text-xs font-bold text-[#8C6A24] hover:text-[#C5A059] underline"
                            >
                              Explore complete 4-course banquet packages & tasting options →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Guest Count & Live Plate Cost Calculator */}
                    <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <label className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          <Calculator className="w-3.5 h-3.5 text-[#246A42]" />
                          <span>Guest Count Calculator:</span>
                        </label>
                        <span className="font-mono font-bold text-[#1A1A1A]">
                          {currentGuestCount} Guests
                        </span>
                      </div>

                      <input
                        type="range"
                        min={caterer.minimumPlates}
                        max={1500}
                        step={25}
                        value={currentGuestCount}
                        onChange={(e) => handleGuestCountChange(caterer.id, Number(e.target.value))}
                        className="w-full accent-[#246A42] cursor-pointer h-1.5 bg-[#E5E0D5] rounded-lg"
                      />

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-[#666666] text-[11px]">
                          Est. Total ({currentGuestCount} × {formatPerPlate(caterer.costPerPlate)}):
                        </span>
                        <span className="font-bold text-[#246A42] font-mono text-sm">
                          {formatINR(estimatedCateringTotal)}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Actions: Book, Live Chat, Bundle */}
                <div className="p-5 sm:p-6 pt-0 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-stretch gap-2.5">
                  <button
                    id={`book-caterer-btn-${caterer.id}`}
                    onClick={() => onBookCaterer(caterer, estimatedCateringTotal, currentGuestCount)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>Reserve ({formatINR(estimatedCateringTotal)})</span>
                  </button>

                  {onOpenChatWithVendor && (
                    <button
                      id={`chat-caterer-btn-${caterer.id}`}
                      onClick={() => onOpenChatWithVendor({
                        vendorId: caterer.id,
                        vendorType: 'caterer',
                        vendorName: caterer.name,
                        vendorSubtitle: `${caterer.location} • Banquet Cuisine`,
                        vendorAvatar: caterer.imageUrl,
                        vendorContactName: caterer.coordinatorName || caterer.contactPerson || 'Executive Chef',
                        vendorRole: 'Master Culinary Director'
                      })}
                      className="px-3.5 py-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F0EBE1] text-[#1A1A1A] border border-[#E5E0D5] hover:border-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Chat directly with Executive Chef"
                    >
                      <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                      <span>Chat</span>
                    </button>
                  )}

                  <button
                    id={`bundle-caterer-btn-${caterer.id}`}
                    onClick={() => onAddToBundle({
                      type: 'caterer',
                      item: caterer,
                      selectedPackage: `${caterer.dietaryType} Banquet (${currentGuestCount} guests)`,
                      estimatedCost: estimatedCateringTotal
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
