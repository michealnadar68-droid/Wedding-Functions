import React, { useState } from 'react';
import { 
  X, 
  Utensils, 
  Leaf, 
  Flame, 
  Sparkles, 
  Calendar, 
  Phone, 
  Star, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ChefHat,
  Award
} from 'lucide-react';
import { Caterer, MenuItem } from '../types';
import { formatPerPlate } from '../utils/formatters';

interface SignatureMenuModalProps {
  caterer: Caterer | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTasting: (caterer: Caterer) => void;
}

export const SignatureMenuModal: React.FC<SignatureMenuModalProps> = ({
  caterer,
  isOpen,
  onClose,
  onBookTasting
}) => {
  if (!isOpen || !caterer) return null;

  const [activeCourseTab, setActiveCourseTab] = useState<string>('All Courses');

  const courseCategories = [
    'All Courses',
    'Welcome Drinks',
    'Starters & Hors d\'oeuvres',
    'Live Counters & Chaat',
    'Main Entrees',
    'Artisanal Breads & Rice',
    'Signature Desserts & Paan'
  ];

  const filteredDishes = activeCourseTab === 'All Courses'
    ? caterer.signatureDishes
    : caterer.signatureDishes.filter(d => d.category === activeCourseTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="signature-menu-modal-container"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Background */}
        <div className="relative bg-[#1A1A1A] text-white p-6 sm:p-8 overflow-hidden">
          <div className="absolute inset-0 opacity-25">
            <img src={caterer.imageUrl} alt={caterer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/90 to-[#1A1A1A]/70" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                  caterer.dietaryType === 'Pure Veg' ? 'bg-[#246A42]/80 text-white' : 'bg-[#8C2424]/80 text-white'
                }`}>
                  {caterer.dietaryType === 'Pure Veg' ? <Leaf className="w-3.5 h-3.5 text-emerald-300" /> : <Flame className="w-3.5 h-3.5 text-rose-300" />}
                  {caterer.dietaryType} Kitchen
                </span>
                <span className="text-xs bg-[#C5A059] text-white px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {caterer.rating.toFixed(2)}
                </span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {caterer.name}
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
                {caterer.tagline}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="relative mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <div>
              <span className="text-[#A59F95] block text-[10px] uppercase font-bold">Starting Price</span>
              <strong className="text-[#C5A059] font-mono text-base">{formatPerPlate(caterer.costPerPlate)}</strong>
            </div>
            <div>
              <span className="text-[#A59F95] block text-[10px] uppercase font-bold">Min. Batch</span>
              <strong className="text-white">{caterer.minimumPlates} Guests</strong>
            </div>
            <div>
              <span className="text-[#A59F95] block text-[10px] uppercase font-bold">Head Chef</span>
              <strong className="text-white">{caterer.coordinatorName}</strong>
            </div>
          </div>
        </div>

        {/* Course Filter Tabs */}
        <div className="p-4 sm:p-6 bg-[#F9F7F2] border-b border-[#E5E0D5]">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {courseCategories.map((course) => (
              <button
                key={course}
                onClick={() => setActiveCourseTab(course)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCourseTab === course
                    ? 'bg-[#246A42] text-white shadow-xs'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F7F3EB] border border-[#E5E0D5]'
                }`}
              >
                {course}
              </button>
            ))}
          </div>
        </div>

        {/* Signature Dishes Grid */}
        <div className="p-6 sm:p-8 max-h-[50vh] overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="p-4 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] transition-all space-y-2 group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#8C6A24] transition-colors">
                      {dish.name}
                    </h4>
                    <span className="text-[10px] uppercase font-semibold text-[#246A42]">
                      {dish.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    dish.isVeg ? 'bg-[#246A42]/15 text-[#246A42]' : 'bg-[#8C2424]/15 text-[#8C2424]'
                  }`}>
                    {dish.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
                  </span>
                </div>

                <p className="text-xs text-[#666666] leading-relaxed">
                  {dish.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dish.dietaryTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-2 py-0.5 rounded-md font-medium border border-[#C5A059]/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Catering Packages Comparison */}
          <div className="pt-4 border-t border-[#E5E0D5]">
            <h4 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-3">
              Standard Banquet Packages
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caterer.packages.map((pkg, pIdx) => (
                <div key={pIdx} className="p-4 rounded-xl bg-[#F9F7F2] border border-[#E5E0D5] space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-[#1A1A1A]">{pkg.name}</strong>
                    <span className="text-sm font-extrabold font-mono text-[#246A42]">
                      ${pkg.pricePerPlate} <span className="text-[10px] text-[#888888] font-normal">/ plate</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#666666]">{pkg.description}</p>
                  <ul className="text-[11px] text-[#1A1A1A] space-y-1 pt-1">
                    {pkg.inclusions.map((inc, iIdx) => (
                      <li key={iIdx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#246A42] shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 sm:p-6 bg-[#F9F7F2] border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#666666]">
            <span>Want to sample these dishes? Schedule a </span>
            <strong className="text-[#1A1A1A]">Complimentary Chef Tasting Session</strong>.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E5E0D5] bg-white text-[#1A1A1A] text-xs font-bold hover:bg-[#F9F7F2] cursor-pointer"
            >
              Close Menu
            </button>
            <button
              onClick={() => {
                onClose();
                onBookTasting(caterer);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#246A42] hover:bg-[#1c5334] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <ChefHat className="w-4 h-4" />
              <span>Schedule Food Tasting / Reserve</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
