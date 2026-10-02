import React, { useState } from 'react';
import { 
  Palette, 
  MapPin, 
  Star, 
  Heart, 
  Sparkles, 
  Ruler, 
  Clock, 
  SunMedium, 
  Layers, 
  Plus, 
  Check, 
  Calendar,
  Flame,
  Award,
  TrendingUp,
  Eye,
  MessageSquare
} from 'lucide-react';
import { DecorationTheme, BundleItem } from '../types';
import { db } from '../services/databaseService';
import { formatINR } from '../utils/formatters';

interface DecorationsSectionProps {
  decorations: DecorationTheme[];
  activeSort: 'default' | 'top-rated' | 'most-liked';
  onSetSort: (sort: 'default' | 'top-rated' | 'most-liked') => void;
  onToggleLike: (themeId: string) => void;
  onBookDecor: (decor: DecorationTheme) => void;
  onAddToBundle: (item: BundleItem) => void;
  bundleDecorIds: string[];
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

export const DecorationsSection: React.FC<DecorationsSectionProps> = ({
  decorations,
  activeSort,
  onSetSort,
  onToggleLike,
  onBookDecor,
  onAddToBundle,
  bundleDecorIds,
  onOpenChatWithVendor
}) => {
  const [selectedPaletteTheme, setSelectedPaletteTheme] = useState<string | null>(null);

  // Sorting logic based on active tab
  const sortedDecorations = [...decorations].sort((a, b) => {
    if (activeSort === 'top-rated') {
      return b.rating - a.rating;
    }
    if (activeSort === 'most-liked') {
      return b.likesCount - a.likesCount;
    }
    return 0; // default order
  });


  return (
    <section id="decorations-section" className="mb-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6A24] uppercase tracking-widest bg-[#F7F3EB] px-3 py-1 rounded-full mb-2 border border-[#C5A059]/30">
            <Palette className="w-3.5 h-3.5" /> Sector 04 • Bespoke Stage & Mandap Architecture
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A1A1A]">
            Custom Hall Decorations Display
          </h2>
          <p className="text-[#666666] text-xs sm:text-sm mt-1 max-w-2xl">
            Trendsetting royal mandaps, minimalist acrylic stages, enchanted floral gardens, and Gatsby Art Deco backdrops.
          </p>
        </div>

        {/* Dynamic Sorting Tabs: "Top-Rated Designs" and "Most Liked Frameworks" */}
        <div className="flex items-center gap-1.5 bg-[#F9F7F2] p-1.5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <button
            id="decor-sort-default"
            onClick={() => onSetSort('default')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSort === 'default'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            All Designs
          </button>

          <button
            id="decor-sort-top-rated"
            onClick={() => onSetSort('top-rated')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSort === 'top-rated'
                ? 'bg-[#C5A059] text-white shadow-xs'
                : 'text-[#8C6A24] hover:bg-[#F7F3EB]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Top-Rated Designs</span>
          </button>

          <button
            id="decor-sort-most-liked"
            onClick={() => onSetSort('most-liked')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSort === 'most-liked'
                ? 'bg-[#8C2424] text-white shadow-xs'
                : 'text-[#8C2424] hover:bg-[#8C2424]/10'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
            <span>Most Liked Frameworks</span>
          </button>
        </div>
      </div>

      {/* Visual Design Gallery Grid */}
      {sortedDecorations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E0D5]">
          <Palette className="w-12 h-12 text-[#CCCCCC] mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Decor Themes Found</h3>
          <p className="text-[#888888] text-xs mt-1">Try loosening search keywords or price bounds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedDecorations.map((decor) => {
            const isAddedToBundle = bundleDecorIds.includes(decor.id);

            return (
              <div
                key={decor.id}
                id={`decor-card-${decor.id}`}
                className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Hero Visual Theme Image */}
                  <div className="relative h-64 overflow-hidden bg-[#1A1A1A]">
                    <img
                      src={decor.imageUrl}
                      alt={decor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Badges: Category Chip & Client Like Button */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {/* Theme Category Badge */}
                      <span className="px-3 py-1 rounded-full bg-black/70 text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold backdrop-blur-md">
                        {decor.themeCategory}
                      </span>

                      {/* Interactive Client Like Count Button */}
                      <button
                        id={`like-btn-${decor.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(decor.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all transform active:scale-90 cursor-pointer shadow-md ${
                          decor.userLiked
                            ? 'bg-[#8C2424] text-white ring-2 ring-rose-300'
                            : 'bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20'
                        }`}
                        aria-label="Like this decoration theme"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${decor.userLiked ? 'fill-white text-white' : 'text-rose-400'}`} />
                        <span>{decor.likesCount.toLocaleString()}</span>
                      </button>
                    </div>

                    {/* Bottom Image Overlay: Title, Rating, Price */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5 bg-[#C5A059] text-white px-2 py-0.5 rounded-md text-xs font-extrabold shadow-2xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{decor.rating.toFixed(2)}</span>
                          <span className="text-[10px] opacity-90 font-normal">({decor.reviewCount})</span>
                        </div>
                        <span className="text-xs font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-md backdrop-blur-xs font-mono border border-white/10">
                          {formatINR(decor.price)}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                        {decor.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    
                    {/* Location & Studio */}
                    <div className="flex items-center justify-between text-xs text-[#666666]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                        <span className="font-medium text-[#1A1A1A]">{decor.location}</span>
                      </div>
                      <span className="font-semibold text-[#1A1A1A] text-[11px]">
                        By {decor.designerStudio}
                      </span>
                    </div>

                    {/* Color Palette Swatches */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                        Curated Color Palette
                      </div>
                      <div className="flex items-center gap-2">
                        {decor.paletteColors.map((colorHex, cIdx) => (
                          <div
                            key={cIdx}
                            title={colorHex}
                            className="w-6 h-6 rounded-full border border-[#E5E0D5] shadow-2xs transition-transform hover:scale-125"
                            style={{ backgroundColor: colorHex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Hall Suitability Specs Matrix */}
                    <div className="p-3.5 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] space-y-2 text-xs">
                      <div className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Hall Suitability Specs:</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#666666]">
                        <div>
                          <span className="text-[#888888] block">Min. Ceiling Height:</span>
                          <strong className="text-[#1A1A1A]">{decor.hallSuitability.minCeilingHeightFt} ft. required</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block">Min. Stage Width:</span>
                          <strong className="text-[#1A1A1A]">{decor.hallSuitability.minStageWidthFt} ft. wide</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block">Venue Format:</span>
                          <strong className="text-[#1A1A1A]">{decor.hallSuitability.indoorOutdoor}</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block">Setup Time:</span>
                          <strong className="text-[#1A1A1A]">{decor.hallSuitability.setupDurationHours} Hours</strong>
                        </div>
                      </div>
                    </div>

                    {/* Staging Elements Included */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#1A1A1A] block">Stage Elements Included:</span>
                      <ul className="space-y-1 text-[11px] text-[#666666]">
                        {decor.elementsIncluded.slice(0, 3).map((item, eIdx) => (
                          <li key={eIdx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Occasion & Religious Tradition Badges */}
                    {decor.suitableOccasions && decor.suitableOccasions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {decor.suitableOccasions.map((occ, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-2 py-0.5 rounded-full border border-[#C5A059]/30 font-semibold"
                          >
                            {occ}
                          </span>
                        ))}
                        {decor.religiousTraditions?.map((rel, idx) => (
                          <span
                            key={`rel-${idx}`}
                            className="text-[10px] bg-[#FAF5FF] text-[#7E22CE] px-2 py-0.5 rounded-full border border-[#E9D5FF] font-medium"
                          >
                            {rel}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                {/* Bottom Actions: Reserve, Live Chat, Add to Package */}
                <div className="p-5 sm:p-6 pt-0 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-stretch gap-2.5">
                  <button
                    id={`book-decor-btn-${decor.id}`}
                    onClick={() => onBookDecor(decor)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-[#C5A059]" />
                    <span>Reserve Theme ({formatINR(decor.price)})</span>
                  </button>

                  {onOpenChatWithVendor && (
                    <button
                      id={`chat-decor-btn-${decor.id}`}
                      onClick={() => onOpenChatWithVendor({
                        vendorId: decor.id,
                        vendorType: 'decor',
                        vendorName: decor.name,
                        vendorSubtitle: `${decor.location} • ${decor.themeCategory} Staging`,
                        vendorAvatar: decor.imageUrl,
                        vendorContactName: 'Aesthetic Scenographer Studio',
                        vendorRole: 'Lead Floral & Lighting Director'
                      })}
                      className="px-3.5 py-3 rounded-xl bg-[#F9F7F2] hover:bg-[#F0EBE1] text-[#1A1A1A] border border-[#E5E0D5] hover:border-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Chat directly with Lead Floral & Lighting Director"
                    >
                      <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                      <span>Chat</span>
                    </button>
                  )}

                  <button
                    id={`bundle-decor-btn-${decor.id}`}
                    onClick={() => onAddToBundle({
                      type: 'decor',
                      item: decor,
                      selectedPackage: `${decor.name}`,
                      estimatedCost: decor.price
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
