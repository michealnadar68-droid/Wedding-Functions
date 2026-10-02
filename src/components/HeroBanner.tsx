import React from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  ShieldCheck, 
  Calendar, 
  Star, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Compass,
  Briefcase,
  Users
} from 'lucide-react';
import { ServiceCategory, AuthRoleType } from '../types';

interface HeroBannerProps {
  onSelectCategory: (cat: ServiceCategory) => void;
  activeCategory: ServiceCategory;
  totalHallsCount: number;
  totalCaterersCount: number;
  totalPhotographersCount: number;
  totalDecorsCount: number;
  onOpenMultiRolePortal?: (role?: AuthRoleType) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  activeCategory,
  totalHallsCount,
  totalCaterersCount,
  totalPhotographersCount,
  totalDecorsCount,
  onOpenMultiRolePortal
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FDFCFB] via-[#F9F7F2] to-[#FDFCFB] border-b border-[#E5E0D5] pt-10 pb-14 sm:pt-14 sm:pb-18">
      {/* Subtle decorative background flourishes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 left-10 w-96 h-96 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-[#E5E0D5]/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Subheading badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F3EB] border border-[#C5A059]/35 text-[#8C6A24] text-xs font-semibold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Pan-India A-Z Venues • Weddings, 1st Birthdays & Traditional Rites
          </div>
        </div>

        {/* Grand Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-[1.15]">
            Book India's Finest Halls, Caterers & Photographers for{' '}
            <span className="italic font-normal font-cormorant text-[#C5A059]">
              Every Sacred Milestone
            </span>
          </h1>
          <p className="text-[#666666] text-sm sm:text-base md:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
            From 1st Birthday Wonderlands & Sacred Vedic Upanayanams to Royal Palaces, Nikahs, Anand Karaj, and Catholic Baptisms across India from Agra to Varanasi.
          </p>
        </div>

        {/* 4 Sector Interactive Quick Navigation Cards */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          
          {/* 1. Marriage Halls */}
          <div 
            id="hero-card-halls"
            onClick={() => onSelectCategory('halls')}
            className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeCategory === 'halls'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]'
                : 'bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === 'halls' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#F7F3EB] text-[#8C6A24]'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                activeCategory === 'halls' ? 'bg-[#2C2A28] text-[#C5A059]' : 'bg-[#F9F7F2] text-[#666666] border border-[#E5E0D5]'
              }`}>
                {totalHallsCount} Halls
              </span>
            </div>
            <h2 className="font-serif-luxury font-bold text-base sm:text-lg mb-1">
              Marriage Halls
            </h2>
            <p className={`text-xs line-clamp-2 ${activeCategory === 'halls' ? 'text-[#D5CEBE]' : 'text-[#666666]'}`}>
              Halls Near Me, live availability status, and customizable price tiers.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
              <span>Explore Venues</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Caterers & Menus */}
          <div 
            id="hero-card-caterers"
            onClick={() => onSelectCategory('caterers')}
            className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeCategory === 'caterers'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]'
                : 'bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === 'caterers' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#EBF5EF] text-[#246A42]'
              }`}>
                <Utensils className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                activeCategory === 'caterers' ? 'bg-[#2C2A28] text-[#C5A059]' : 'bg-[#F9F7F2] text-[#666666] border border-[#E5E0D5]'
              }`}>
                {totalCaterersCount} Caterers
              </span>
            </div>
            <h2 className="font-serif-luxury font-bold text-base sm:text-lg mb-1">
              Caterers & Menus
            </h2>
            <p className={`text-xs line-clamp-2 ${activeCategory === 'caterers' ? 'text-[#D5CEBE]' : 'text-[#666666]'}`}>
              Pure Veg & Mixed gourmet menus with interactive signature item viewers.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
              <span>View Menus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Photographers */}
          <div 
            id="hero-card-photographers"
            onClick={() => onSelectCategory('photographers')}
            className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeCategory === 'photographers'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]'
                : 'bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === 'photographers' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#EDEFF8] text-[#36427D]'
              }`}>
                <Camera className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                activeCategory === 'photographers' ? 'bg-[#2C2A28] text-[#C5A059]' : 'bg-[#F9F7F2] text-[#666666] border border-[#E5E0D5]'
              }`}>
                {totalPhotographersCount} Studios
              </span>
            </div>
            <h2 className="font-serif-luxury font-bold text-base sm:text-lg mb-1">
              Photographers
            </h2>
            <p className={`text-xs line-clamp-2 ${activeCategory === 'photographers' ? 'text-[#D5CEBE]' : 'text-[#666666]'}`}>
              Visual portfolio galleries with interactive date availability calendars.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
              <span>Check Dates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Custom Hall Decor */}
          <div 
            id="hero-card-decor"
            onClick={() => onSelectCategory('decorations')}
            className={`group relative p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
              activeCategory === 'decorations'
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-[1.02]'
                : 'bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeCategory === 'decorations' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#FDF0F0] text-[#9E3636]'
              }`}>
                <Palette className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                activeCategory === 'decorations' ? 'bg-[#2C2A28] text-[#C5A059]' : 'bg-[#F9F7F2] text-[#666666] border border-[#E5E0D5]'
              }`}>
                {totalDecorsCount} Themes
              </span>
            </div>
            <h2 className="font-serif-luxury font-bold text-base sm:text-lg mb-1">
              Custom Hall Decor
            </h2>
            <p className={`text-xs line-clamp-2 ${activeCategory === 'decorations' ? 'text-[#D5CEBE]' : 'text-[#666666]'}`}>
              Trendsetting mandap & stage themes sorted by client likes and top ratings.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
              <span>View Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* 3-Role Portal Feature Bar */}
        {onOpenMultiRolePortal && (
          <div className="mt-8 max-w-5xl mx-auto bg-white rounded-xl border border-[#E5E0D5] p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#1A1A1A]">
                    3-Role Unified Portal
                  </span>
                  <span className="bg-[#F7F3EB] text-[#8C6A24] border border-[#C5A059]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Customer • Admin • Vendor
                  </span>
                </div>
                <p className="text-xs text-[#666666] line-clamp-1">
                  Are you a Hall Owner, Caterer, Photographer, or Decorator? Register, upload your venue profile, location, photographer work & caterer menus!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onOpenMultiRolePortal('vendor')}
                className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A1A] hover:bg-[#2C2A28] text-[#C5A059] border border-[#C5A059]/50 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Vendor Register / Upload</span>
              </button>
              <button
                onClick={() => onOpenMultiRolePortal('admin')}
                className="px-3 py-2 bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                Admin
              </button>
              <button
                onClick={() => onOpenMultiRolePortal('customer')}
                className="px-3 py-2 bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                Customer
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-[#E5E0D5] flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-[#666666]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#246A42]" />
            <span>100% Escrow Price Lock Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <span>Instant Date Verification & Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
            <span>4.9+ Star Verified Couple Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#36427D]" />
            <span>Complimentary Venue Site Visits</span>
          </div>
        </div>

      </div>
    </section>
  );
};
