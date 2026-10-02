import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  Calendar, 
  PhoneCall, 
  ChevronDown, 
  Menu as MenuIcon, 
  X,
  Layers,
  Award,
  Utensils,
  Camera,
  Palette,
  Building2,
  User,
  MessageSquare,
  LogOut,
  Navigation,
  Loader2,
  Compass,
  Briefcase,
  ShieldCheck,
  FileDown,
  Database
} from 'lucide-react';
import { ServiceCategory, BundleItem, UserProfile, AuthRoleType } from '../types';
import { LOCATIONS_LIST } from '../data/mockData';
import { db } from '../services/databaseService';
import { detectCurrentIndianLocation } from '../services/locationService';

interface NavbarProps {
  activeCategory: ServiceCategory;
  onSelectCategory: (cat: ServiceCategory) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  bundleItems: BundleItem[];
  onOpenBundleDrawer: () => void;
  onOpenConsultationModal: () => void;
  currentUser: UserProfile;
  onOpenAuthModal: () => void;
  onOpenDashboard: () => void;
  onOpenChat: () => void;
  onOpenMap: () => void;
  onOpenMultiRolePortal?: (role?: AuthRoleType) => void;
  onOpenBudgetPlanner?: () => void;
  onOpenSmartCalendar?: () => void;
  onOpenCalendarSync?: () => void;
  onOpenBulkExport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  bundleItems,
  onOpenBundleDrawer,
  onOpenConsultationModal,
  currentUser,
  onOpenAuthModal,
  onOpenDashboard,
  onOpenChat,
  onOpenMap,
  onOpenMultiRolePortal,
  onOpenBudgetPlanner,
  onOpenSmartCalendar,
  onOpenCalendarSync,
  onOpenBulkExport
}) => {
  const triggerSmartCalendar = onOpenCalendarSync || onOpenSmartCalendar;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isDetectingNavLocation, setIsDetectingNavLocation] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(db.getTotalUnreadCount());
  const [favoritesCount, setFavoritesCount] = useState(db.getFavorites(currentUser.id).length);

  const handleNavDetectLocation = async () => {
    setIsDetectingNavLocation(true);
    try {
      const res = await detectCurrentIndianLocation();
      onSelectLocation(res.matchedLocation);
      setLocationDropdownOpen(false);
    } catch (e) {
      console.error(e);
      onSelectLocation('Mumbai (All Sectors)');
      setLocationDropdownOpen(false);
    } finally {
      setIsDetectingNavLocation(false);
    }
  };

  useEffect(() => {
    const handleDbChange = () => {
      setUnreadChatCount(db.getTotalUnreadCount());
      setFavoritesCount(db.getFavorites(currentUser.id).length);
    };

    window.addEventListener('elysian_db_update', handleDbChange);
    return () => window.removeEventListener('elysian_db_update', handleDbChange);
  }, [currentUser.id]);

  const totalBundleCost = bundleItems.reduce((sum, item) => sum + item.estimatedCost, 0);

  const navItems: { id: ServiceCategory; pageTag: string; label: string; icon: React.ReactNode }[] = [
    { id: 'halls', pageTag: 'Page 1', label: 'Marriage Halls', icon: <Building2 className="w-4 h-4" /> },
    { id: 'caterers', pageTag: 'Page 2', label: 'Caterers & Menus', icon: <Utensils className="w-4 h-4" /> },
    { id: 'photographers', pageTag: 'Page 3', label: 'Photographers', icon: <Camera className="w-4 h-4" /> },
    { id: 'decorations', pageTag: 'Page 4', label: 'Hall Decor Teams', icon: <Palette className="w-4 h-4" /> },
    { id: 'all', pageTag: 'All', label: 'All Sectors', icon: <Layers className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#E5E0D5] shadow-xs transition-all">
      {/* Top micro-bar */}
      <div className="bg-[#1A1A1A] text-[#D5CEBE] text-xs py-1.5 px-4 sm:px-8 border-b border-[#2C2A28]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[#C5A059] font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" /> Auspicious Muhurtham Dates 2026-2027 Open
            </span>
            <span className="hidden md:inline text-[#666666]">•</span>
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#246A42]/20 border border-[#246A42]/40 text-[#4EBA7C] text-[10px] font-medium font-mono" title="Connected to Google Firebase Cloud Firestore (encouraging-period-7dtd0)">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA7C] animate-pulse" />
              <Database className="w-3 h-3" />
              <span>Firebase Firestore Sync Live</span>
            </div>
            <span className="hidden xl:inline text-[#666666]">•</span>
            <span className="hidden xl:inline text-[#A8A29E] font-light">100% Verified Venues & Caterers with Escrow</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[#D5CEBE]">
            {onOpenMultiRolePortal && (
              <div className="flex items-center gap-1 bg-[#2C2A28] px-2.5 py-0.5 rounded-full border border-[#C5A059]/40 text-[11px]">
                <span className="text-[#C5A059] font-bold">3-Role Portal:</span>
                <button
                  onClick={() => onOpenMultiRolePortal('customer')}
                  className="hover:text-[#C5A059] transition-colors font-medium px-1 cursor-pointer"
                >
                  Customer
                </button>
                <span className="text-[#666666]">|</span>
                <button
                  onClick={() => onOpenMultiRolePortal('admin')}
                  className="hover:text-[#C5A059] transition-colors font-medium px-1 cursor-pointer"
                >
                  Admin
                </button>
                <span className="text-[#666666]">|</span>
                <button
                  onClick={() => onOpenMultiRolePortal('vendor')}
                  className="text-[#C5A059] hover:underline font-bold px-1 flex items-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3" /> Vendor Upload
                </button>
              </div>
            )}
            <button 
              onClick={onOpenConsultationModal}
              className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <PhoneCall className="w-3 h-3 text-[#C5A059]" /> VIP Concierge: +1 (800) 844-WEDD
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectCategory('all')} 
            className="flex items-center gap-3.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] flex items-center justify-center shadow-xs text-[#C5A059] group-hover:border-[#C5A059] transition-all duration-200 border border-[#C5A059]/40">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-2xl font-bold tracking-wider text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors">
                  ELYSIAN
                </span>
                <span className="font-serif-luxury text-2xl font-light text-[#C5A059] tracking-widest">
                  WEDLOCK
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#737373] uppercase font-medium">
                Haute Wedding Booking Platform
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links (4 Dedicated Pages + All) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F9F7F2] p-1.5 rounded-full border border-[#E5E0D5] shadow-2xs">
            {navItems.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectCategory(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                      : 'text-[#555555] hover:text-[#1A1A1A] hover:bg-[#EAE4D7]/60'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-[#C5A059] text-[#1A1A1A]' : 'bg-[#E5E0D5]/70 text-[#666666]'
                  }`}>
                    {item.pageTag}
                  </span>
                  <span className={isActive ? 'text-[#C5A059]' : 'text-[#888888]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Location Quick Selector + Real-time Chat + Wishlist + User Profile + Bundle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Location Selector */}
            <div className="relative hidden xl:block">
              <button
                id="location-selector-btn"
                onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#E5E0D5] text-[#1A1A1A] text-xs font-medium hover:border-[#C5A059] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="max-w-[110px] truncate font-semibold">
                  {selectedLocation === 'All Locations' ? 'All Locations' : selectedLocation.split('/')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#888888] transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {locationDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E5E0D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  id="location-dropdown-menu"
                >
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#888888] uppercase tracking-widest border-b border-[#F0EBE1] flex items-center justify-between">
                    <span>Select Wedding Zone</span>
                    <span className="text-[9px] text-[#C5A059] font-semibold">India</span>
                  </div>

                  {/* Auto GPS Detect Current Location button */}
                  <div className="p-1.5 border-b border-[#F0EBE1]">
                    <button
                      id="navbar-detect-gps-btn"
                      onClick={handleNavDetectLocation}
                      disabled={isDetectingNavLocation}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1A1A1A] text-[#C5A059] text-xs font-semibold hover:bg-[#2C2A28] transition-all cursor-pointer shadow-xs border border-[#C5A059]/30"
                    >
                      {isDetectingNavLocation ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                          <span>Locating Current Area...</span>
                        </>
                      ) : (
                        <>
                          <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Use Current Location (GPS)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {LOCATIONS_LIST.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        onSelectLocation(loc);
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#F9F7F2] cursor-pointer transition-colors ${
                        selectedLocation === loc ? 'text-[#C5A059] font-bold bg-[#F9F7F2]' : 'text-[#333333]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${selectedLocation === loc ? 'text-[#C5A059]' : 'text-[#888888]'}`} />
                        {loc}
                      </span>
                      {selectedLocation === loc && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Wedding Budget Planner Trigger */}
            {onOpenBudgetPlanner && (
              <button
                id="navbar-budget-planner-btn"
                onClick={onOpenBudgetPlanner}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs group"
                title="AI Wedding Budget Strategist"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-[#8C6A24]">AI Budget</span>
              </button>
            )}

            {/* Smart Calendar Sync Trigger */}
            {onOpenSmartCalendar && (
              <button
                id="navbar-calendar-sync-btn"
                onClick={onOpenSmartCalendar}
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs group"
                title="Smart Calendar & Auspicious Muhurtham Sync"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Calendar</span>
              </button>
            )}

            {/* Interactive India Map Trigger */}
            <button
              id="navbar-map-trigger-btn"
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs group"
              title="Explore Pan-India Map & Venues Near Me"
            >
              <Compass className="w-4 h-4 text-[#C5A059] group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-semibold hidden md:inline">India Map</span>
            </button>

            {/* 3-Role Portal Direct Button */}
            {onOpenMultiRolePortal && (
              <button
                id="navbar-portal-trigger-btn"
                onClick={() => onOpenMultiRolePortal('customer')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F7F3EB] border border-[#C5A059]/40 hover:bg-[#EAE4D7] text-[#8C6A24] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Customer / Admin / Vendor Listing Upload Portal"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>3-Role Portal</span>
              </button>
            )}

            {/* Real-time Live Chat Trigger */}
            <button
              id="navbar-chat-trigger-btn"
              onClick={onOpenChat}
              className="relative p-2.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs group"
              title="Live Vendor Chat"
            >
              <MessageSquare className="w-4 h-4 text-[#2A4365] group-hover:scale-110 transition-transform" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#8C2424] text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* User Wishlist Trigger (Opens Dashboard to Favorites tab) */}
            <button
              id="navbar-wishlist-trigger-btn"
              onClick={onOpenDashboard}
              className="relative p-2.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] hover:bg-[#F9F7F2] transition-all cursor-pointer shadow-2xs group"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4 text-[#8C2424] group-hover:scale-110 transition-transform" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C5A059] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Account / VIP Dashboard Menu */}
            <div className="relative">
              <button
                id="user-profile-menu-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-[#F9F7F2] border border-[#E5E0D5] hover:border-[#C5A059] transition-all cursor-pointer shadow-2xs"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#C5A059]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-bold text-[#1A1A1A] hidden md:inline max-w-[120px] truncate">
                  {currentUser.id === 'guest' ? 'Sign In' : currentUser.name.split('&')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#888888] hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E5E0D5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F0EBE1]">
                    <span className="text-[10px] uppercase font-bold text-[#8C6A24] block">Logged in as</span>
                    <strong className="text-xs text-[#1A1A1A] block truncate">{currentUser.name}</strong>
                    <span className="text-[11px] text-[#666666] block truncate">{currentUser.email}</span>
                  </div>

                  <button
                    onClick={onOpenDashboard}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#C5A059]" />
                    <span>My Wedding Dashboard</span>
                  </button>

                  {onOpenBudgetPlanner && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenBudgetPlanner();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>AI Wedding Budget Planner</span>
                    </button>
                  )}

                  {onOpenSmartCalendar && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSmartCalendar();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-[#C5A059]" />
                      <span>Smart Calendar & Muhurtham</span>
                    </button>
                  )}

                  {onOpenBulkExport && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenBulkExport();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-emerald-600" />
                      <span>Bulk Export & Ledger</span>
                    </button>
                  )}

                  <button
                    onClick={onOpenChat}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center justify-between font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                      <span>Vendor Live Messages</span>
                    </div>
                    {unreadChatCount > 0 && (
                      <span className="w-4 h-4 bg-[#8C2424] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadChatCount}
                      </span>
                    )}
                  </button>

                  {onOpenMultiRolePortal && (
                    <>
                      <div className="border-t border-[#F0EBE1] my-1" />
                      <div className="px-4 py-1 text-[10px] uppercase font-bold text-[#8C6A24]">
                        3-Role Access Portals
                      </div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMultiRolePortal('vendor');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-[#C5A059]" />
                        <span>Vendor Listing & Menu Upload</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMultiRolePortal('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#2A4365]" />
                        <span>Admin Master Console</span>
                      </button>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenMultiRolePortal('customer');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#1A1A1A] hover:bg-[#F9F7F2] flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#888888]" />
                        <span>Customer Portal Login / Signup</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-[#F0EBE1] my-1" />

                  <button
                    onClick={onOpenAuthModal}
                    className="w-full text-left px-4 py-2 text-xs text-[#666666] hover:bg-[#F9F7F2] hover:text-[#1A1A1A] flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#888888]" />
                    <span>Switch Profile / Quick Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      db.logout();
                      window.location.reload();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dream Wedding Package Bundle Planner Trigger */}
            <button
              id="wedding-bundle-trigger-btn"
              onClick={onOpenBundleDrawer}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-[#C5A059] hover:bg-[#B38F46] text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-white group-hover:rotate-6 transition-transform" />
                {bundleItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059] rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {bundleItems.length}
                  </span>
                )}
              </div>
              <span className="hidden md:inline tracking-wide">
                {bundleItems.length === 0 ? 'Package' : `Package (${bundleItems.length})`}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-nav-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#1A1A1A] hover:bg-[#F9F7F2] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E0D5] bg-[#FDFCFB] px-4 pt-3 pb-6 space-y-3">
          <div className="text-xs font-bold text-[#888888] uppercase tracking-wider px-2 flex items-center justify-between">
            <span>4 Dedicated Service Pages</span>
            <span className="text-[10px] text-[#C5A059] font-normal">Choose Sector</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectCategory(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                      : 'bg-white text-[#333333] border border-[#E5E0D5] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded shrink-0 ${
                    isActive ? 'bg-[#C5A059] text-[#1A1A1A]' : 'bg-[#E5E0D5] text-[#666666]'
                  }`}>
                    {item.pageTag}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenMap();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-[#F7F3EB] text-[#8C6A24] border border-[#C5A059]/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C5A059]" />
              Explore Interactive Pan-India Map
            </button>

            {onOpenMultiRolePortal && (
              <div className="pt-2 border-t border-[#E5E0D5]">
                <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2 px-1">
                  3-Role Login & Upload Portals
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      onOpenMultiRolePortal('customer');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-1 bg-white border border-[#E5E0D5] rounded-lg text-[11px] font-semibold text-center hover:bg-[#F9F7F2]"
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => {
                      onOpenMultiRolePortal('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-1 bg-white border border-[#E5E0D5] rounded-lg text-[11px] font-semibold text-center hover:bg-[#F9F7F2]"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      onOpenMultiRolePortal('vendor');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-1 bg-[#1A1A1A] text-[#C5A059] border border-[#C5A059]/40 rounded-lg text-[11px] font-bold text-center"
                  >
                    Vendor Upload
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onOpenDashboard();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-[#1A1A1A] text-[#C5A059] rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  onOpenChat();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 bg-white text-[#1A1A1A] border border-[#E5E0D5] rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-[#2A4365]" />
                Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

