import React from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin
} from 'lucide-react';
import { ServiceCategory } from '../types';

interface PageHeaderBannerProps {
  category: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  totalCount: number;
  itemCounts: {
    halls: number;
    caterers: number;
    photographers: number;
    decorations: number;
  };
}

export const PageHeaderBanner: React.FC<PageHeaderBannerProps> = ({
  category,
  onSelectCategory,
  totalCount,
  itemCounts
}) => {
  const pagesConfig = [
    {
      id: 'halls' as ServiceCategory,
      pageNumber: 'Page 1',
      title: 'Marriage Halls & Palaces',
      shortTitle: '1. Marriage Halls',
      tagline: 'Grand Ballrooms, Royal Havelis & AC Glass Pavilions with Live Booking Status',
      icon: <Building2 className="w-5 h-5" />,
      color: '#C5A059',
      bgGradient: 'from-amber-950/20 via-stone-900/10 to-transparent',
      count: itemCounts.halls,
      unit: 'Verified Venues',
      highlights: ['Halls Near Me Distance', '3-Tier Price Packages', 'Vedic & Modern Occasions', 'Instant Date Hold']
    },
    {
      id: 'caterers' as ServiceCategory,
      pageNumber: 'Page 2',
      title: 'Caterers & Royal Menus',
      shortTitle: '2. Caterers & Menus',
      tagline: 'Multi-Cuisine Royal Feasts, Live Food Pavilions & Signature Dish Tasting',
      icon: <Utensils className="w-5 h-5" />,
      color: '#246A42',
      bgGradient: 'from-emerald-950/20 via-stone-900/10 to-transparent',
      count: itemCounts.caterers,
      unit: 'Gourmet Kitchens',
      highlights: ['Pure Veg & Non-Veg', 'Live Plate Price Calculator', 'Authentic Vedic Menus', 'Free Food Tasting']
    },
    {
      id: 'photographers' as ServiceCategory,
      pageNumber: 'Page 3',
      title: 'Wedding Photographers & Cinema',
      shortTitle: '3. Photographers',
      tagline: '4K Drone Cinematography, Candid Milestone Portraits & Live Date Availability',
      icon: <Camera className="w-5 h-5" />,
      color: '#3730A3',
      bgGradient: 'from-indigo-950/20 via-stone-900/10 to-transparent',
      count: itemCounts.photographers,
      unit: 'Master Studios',
      highlights: ['Licensed 4K Drone Crews', 'Real-Time Calendar Lock', '1st Birthdays to Weddings', 'Full Album Delivery']
    },
    {
      id: 'decorations' as ServiceCategory,
      pageNumber: 'Page 4',
      title: 'Hall Decor & Staging Themes',
      shortTitle: '4. Hall Decor Teams',
      tagline: 'Floral Mandaps, 1st Birthday Wonderlands & Reception Stages with Live Likes',
      icon: <Palette className="w-5 h-5" />,
      color: '#8C2424',
      bgGradient: 'from-rose-950/20 via-stone-900/10 to-transparent',
      count: itemCounts.decorations,
      unit: 'Decor Concepts',
      highlights: ['Mandap & Stage Staging', 'Real-time Like Counter', 'Eco-Friendly Florals', 'Bespoke 3D Previews']
    }
  ];

  const currentPage = pagesConfig.find(p => p.id === category) || {
    id: 'all' as ServiceCategory,
    pageNumber: 'All Sectors',
    title: 'Pan-India 4-Sector Celebration Hub',
    shortTitle: 'All-in-One',
    tagline: 'Explore All 4 Pages: Marriage Halls, Caterers, Photographers & Decor Teams',
    icon: <Layers className="w-5 h-5" />,
    color: '#C5A059',
    bgGradient: 'from-amber-950/20 via-stone-900/10 to-transparent',
    count: totalCount,
    unit: 'Total Listings',
    highlights: ['Page 1: Halls', 'Page 2: Caterers', 'Page 3: Photographers', 'Page 4: Decor']
  };

  return (
    <div className="mb-8">
      {/* 4 Dedicated Page Navigation Switcher Tabs */}
      <div className="bg-[#1A1A1A] p-2 sm:p-2.5 rounded-2xl shadow-xl border border-[#33302C] mb-6">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#2C2A28] mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[11px] font-bold text-[#D5CEBE] uppercase tracking-wider">
              Choose Service Page (4 Dedicated Sectors):
            </span>
          </div>
          <span className="text-[10px] text-[#A8A29E] hidden sm:inline">
            Click any page to switch with zero confusion
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {pagesConfig.map((page) => {
            const isActive = category === page.id;
            return (
              <button
                key={page.id}
                id={`page-switch-tab-${page.id}`}
                onClick={() => onSelectCategory(page.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#8C6A24] text-white shadow-lg scale-[1.02] ring-2 ring-[#C5A059]/50'
                    : 'bg-[#262422] text-[#D5CEBE] hover:bg-[#33302C] hover:text-white border border-[#3A3734]'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-black/20 text-white' : 'bg-black/40 text-[#C5A059]'
                }`}>
                  {page.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-black/25 text-white' : 'bg-[#1A1A1A] text-[#C5A059]'
                    }`}>
                      {page.pageNumber}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold bg-white text-[#1A1A1A] px-1.5 py-0.2 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <strong className="text-xs sm:text-sm font-bold block truncate mt-0.5">
                    {page.title.split('&')[0]}
                  </strong>
                  <span className={`text-[10px] block truncate ${isActive ? 'text-white/90' : 'text-stone-400'}`}>
                    {page.count} {page.unit}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Page Breadcrumb & Active Page Identity Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl ${currentPage.bgGradient} rounded-full blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#888888]">
              <button 
                onClick={() => onSelectCategory('all')} 
                className="hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#C5A059] font-bold">
                {currentPage.pageNumber}: {currentPage.title}
              </span>
            </div>

            {/* Page Heading */}
            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#1A1A1A] flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[#F7F3EB] text-[#8C6A24] inline-flex items-center justify-center border border-[#C5A059]/30">
                {currentPage.icon}
              </span>
              <span>{currentPage.title}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              {currentPage.tagline}
            </p>

            {/* Highlights pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {currentPage.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F9F7F2] text-[#555555] px-2.5 py-1 rounded-full border border-[#E5E0D5]"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#246A42]" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-[#FDFCFB] p-4 rounded-xl border border-[#E5E0D5] flex md:flex-col items-center justify-around gap-4 shrink-0 shadow-2xs">
            <div className="text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] font-mono block">
                {currentPage.count}
              </span>
              <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                {currentPage.unit}
              </span>
            </div>

            <div className="h-8 w-px md:w-full md:h-px bg-[#E5E0D5]" />

            <div className="text-center">
              <span className="text-xs font-bold text-[#246A42] flex items-center gap-1 justify-center">
                <ShieldCheck className="w-4 h-4" /> 100% Escrow
              </span>
              <span className="text-[10px] text-[#888888] block">Verified Vendors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
