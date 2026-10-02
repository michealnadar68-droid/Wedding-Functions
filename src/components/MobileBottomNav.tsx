import React from 'react';
import { 
  Building2, 
  Utensils,
  Camera,
  Palette,
  MapPin, 
  ShoppingBag, 
  Briefcase, 
  MessageSquare, 
  Sparkles,
  Compass,
  User,
  Layers
} from 'lucide-react';
import { ServiceCategory, BundleItem, UserProfile, AuthRoleType } from '../types';

interface MobileBottomNavProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  bundleItems: BundleItem[];
  onOpenBundleDrawer: () => void;
  unreadChatCount: number;
  onOpenChat: () => void;
  onOpenMap: () => void;
  onOpenMultiRolePortal: (role?: AuthRoleType) => void;
  onOpenDashboard: () => void;
  currentUser: UserProfile;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  bundleItems,
  onOpenBundleDrawer,
  unreadChatCount,
  onOpenChat,
  onOpenMap,
  onOpenMultiRolePortal,
  onOpenDashboard,
  currentUser
}) => {
  const totalBundleItems = bundleItems.length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1A1A1A]/95 backdrop-blur-lg border-t border-[#33302C] px-1 py-1.5 shadow-2xl safe-area-bottom">
      
      {/* 4 Dedicated Page Switcher Icons on Mobile */}
      <div className="flex items-center justify-around">
        
        {/* Page 1: Halls */}
        <button
          onClick={() => onSelectCategory('halls')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
            activeCategory === 'halls'
              ? 'text-[#C5A059] bg-white/10'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold">1. Halls</span>
        </button>

        {/* Page 2: Caterers */}
        <button
          onClick={() => onSelectCategory('caterers')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
            activeCategory === 'caterers'
              ? 'text-[#C5A059] bg-white/10'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Utensils className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold">2. Caterers</span>
        </button>

        {/* Page 3: Photographers */}
        <button
          onClick={() => onSelectCategory('photographers')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
            activeCategory === 'photographers'
              ? 'text-[#C5A059] bg-white/10'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold">3. Photos</span>
        </button>

        {/* Page 4: Decor Teams */}
        <button
          onClick={() => onSelectCategory('decorations')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg transition-colors cursor-pointer ${
            activeCategory === 'decorations'
              ? 'text-[#C5A059] bg-white/10'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Palette className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-bold">4. Decor</span>
        </button>

        {/* Bundle Cart */}
        <button
          onClick={onOpenBundleDrawer}
          className="relative flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5 text-[#C5A059]" />
            {totalBundleItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#8C6A24] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-[#1A1A1A]">
                {totalBundleItems}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold">Bundle</span>
        </button>

        {/* Live Chat */}
        <button
          onClick={onOpenChat}
          className="relative flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 mb-0.5 text-stone-300" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-2 ring-[#1A1A1A]">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold">Chat</span>
        </button>

      </div>
    </div>
  );
};
