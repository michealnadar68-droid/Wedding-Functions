import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  Briefcase, 
  MessageSquare, 
  Heart, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  ShoppingBag
} from 'lucide-react';
import { AuthRoleType, BundleItem } from '../types';

interface VerticalToolsRailProps {
  onOpenBudgetPlanner?: () => void;
  onOpenMap: () => void;
  onOpenMultiRolePortal?: (role?: AuthRoleType) => void;
  onOpenChat: () => void;
  onOpenDashboard: () => void;
  onOpenBundleDrawer?: () => void;
  unreadChatCount: number;
  favoritesCount: number;
  bundleItemsCount?: number;
}

export const VerticalToolsRail: React.FC<VerticalToolsRailProps> = ({
  onOpenBudgetPlanner,
  onOpenMap,
  onOpenMultiRolePortal,
  onOpenChat,
  onOpenDashboard,
  onOpenBundleDrawer,
  unreadChatCount,
  favoritesCount,
  bundleItemsCount = 0
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      id="vertical-tools-rail"
      aria-label="Vertical Quick Navigation Rail"
      className="hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-30 flex-col items-center bg-[#1A1A1A]/95 text-white p-2 rounded-2xl shadow-2xl border-2 border-[#C5A059]/40 backdrop-blur-md transition-all duration-200"
    >
      {/* Rail Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full py-1 mb-1 text-[#C5A059] hover:text-white flex items-center justify-center text-[10px] font-bold tracking-wider cursor-pointer border-b border-stone-800"
        title={isCollapsed ? 'Expand Vertical Tools' : 'Collapse Vertical Tools'}
      >
        {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* Strictly Vertical Buttons Stack (Top to Bottom) */}
      <div className="flex flex-col items-stretch gap-2 w-full py-1">
        
        {/* 1. AI Budget Planner (Vertical) */}
        {onOpenBudgetPlanner && (
          <button
            onClick={onOpenBudgetPlanner}
            className={`flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all cursor-pointer group text-left border border-stone-800 ${
              isCollapsed ? 'justify-center' : 'w-44'
            }`}
            title="AI Wedding Budget Planner"
          >
            <div className="w-7 h-7 rounded-lg bg-[#C5A059]/20 flex items-center justify-center shrink-0 group-hover:bg-white/20">
              <Sparkles className="w-4 h-4 text-[#C5A059] group-hover:text-[#1A1A1A]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate leading-tight">AI Budget</span>
                <span className="text-[10px] text-stone-400 group-hover:text-[#1A1A1A]/80 block truncate">Strategist</span>
              </div>
            )}
          </button>
        )}

        {/* 2. Interactive India Map (Vertical) */}
        <button
          onClick={onOpenMap}
          className={`flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all cursor-pointer group text-left border border-stone-800 ${
            isCollapsed ? 'justify-center' : 'w-44'
          }`}
          title="Interactive India Venue Map"
        >
          <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-white/20">
            <Compass className="w-4 h-4 text-[#C5A059] group-hover:text-[#1A1A1A]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-xs font-bold block truncate leading-tight">India Map</span>
              <span className="text-[10px] text-stone-400 group-hover:text-[#1A1A1A]/80 block truncate">Venues Near Me</span>
            </div>
          )}
        </button>

        {/* 3. 3-Role Unified Portal (Vertical) */}
        {onOpenMultiRolePortal && (
          <button
            onClick={() => onOpenMultiRolePortal('customer')}
            className={`flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all cursor-pointer group text-left border border-stone-800 ${
              isCollapsed ? 'justify-center' : 'w-44'
            }`}
            title="3-Role Unified Portal"
          >
            <div className="w-7 h-7 rounded-lg bg-[#F7F3EB]/10 flex items-center justify-center shrink-0 group-hover:bg-white/20">
              <Briefcase className="w-4 h-4 text-[#C5A059] group-hover:text-[#1A1A1A]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate leading-tight">3-Role Portal</span>
                <span className="text-[10px] text-[#C5A059] group-hover:text-[#1A1A1A] block truncate">Host • Admin • Vendor</span>
              </div>
            )}
          </button>
        )}

        {/* 4. Live Chat (Vertical) */}
        <button
          onClick={onOpenChat}
          className={`relative flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all cursor-pointer group text-left border border-stone-800 ${
            isCollapsed ? 'justify-center' : 'w-44'
          }`}
          title="Vendor Live Chat"
        >
          <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-white/20 relative">
            <MessageSquare className="w-4 h-4 text-[#60A5FA] group-hover:text-[#1A1A1A]" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block truncate leading-tight">Live Chat</span>
                <span className="text-[10px] text-stone-400 group-hover:text-[#1A1A1A]/80 block truncate">Concierge & Vendors</span>
              </div>
              {unreadChatCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                  {unreadChatCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* 5. Saved Wishlist (Vertical) */}
        <button
          onClick={onOpenDashboard}
          className={`flex items-center gap-2 p-2 rounded-xl bg-stone-900 hover:bg-[#C5A059] hover:text-[#1A1A1A] transition-all cursor-pointer group text-left border border-stone-800 ${
            isCollapsed ? 'justify-center' : 'w-44'
          }`}
          title="Saved Favorites Wishlist"
        >
          <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-white/20 relative">
            <Heart className="w-4 h-4 text-rose-400 group-hover:text-[#1A1A1A]" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C5A059] text-[#1A1A1A] rounded-full text-[9px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold block truncate leading-tight">Wishlist</span>
                <span className="text-[10px] text-stone-400 group-hover:text-[#1A1A1A]/80 block truncate">Saved Items</span>
              </div>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </div>
          )}
        </button>

        {/* 6. Package Drawer (Vertical) */}
        {onOpenBundleDrawer && (
          <button
            onClick={onOpenBundleDrawer}
            className={`flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 transition-all cursor-pointer group text-left shadow-md ${
              isCollapsed ? 'justify-center' : 'w-44'
            }`}
            title="Dream Wedding Package"
          >
            <div className="w-7 h-7 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block truncate leading-tight">Package</span>
                  <span className="text-[10px] text-white/80 block truncate">Custom Bundle</span>
                </div>
                {bundleItemsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-white text-[#8C6A24] text-[10px] font-bold">
                    {bundleItemsCount}
                  </span>
                )}
              </div>
            )}
          </button>
        )}

      </div>
    </aside>
  );
};
