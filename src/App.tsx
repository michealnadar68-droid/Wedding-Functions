import React, { useState, useMemo, useEffect } from 'react';
import { 
  MARRIAGE_HALLS_DATA, 
  CATERERS_DATA, 
  PHOTOGRAPHERS_DATA, 
  DECORATIONS_DATA,
  LOCATIONS_LIST 
} from './data/mockData';
import { 
  GlobalFilterState, 
  ServiceCategory, 
  MarriageHall, 
  Caterer, 
  Photographer, 
  DecorationTheme, 
  BundleItem, 
  BookingDetails, 
  PricePackage,
  UserProfile,
  Conversation,
  AuthRoleType 
} from './types';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { GlobalFilterBar } from './components/GlobalFilterBar';
import { HallsPage } from './pages/HallsPage';
import { CaterersPage } from './pages/CaterersPage';
import { PhotographersPage } from './pages/PhotographersPage';
import { DecorationsPage } from './pages/DecorationsPage';
import { ExploreAllPage } from './pages/ExploreAllPage';
import { BookingModal } from './components/BookingModal';
import { SignatureMenuModal } from './components/SignatureMenuModal';
import { WeddingBundleDrawer } from './components/WeddingBundleDrawer';
import { AuthModal } from './components/AuthModal';
import { UserProfileDashboard } from './components/UserProfileDashboard';
import { InteractiveIndiaMap } from './components/InteractiveIndiaMap';
import { ChatModal } from './components/ChatModal';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { MultiRolePortalPage } from './components/MultiRolePortalPage';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AiWeddingBudgetPlannerModal } from './components/AiWeddingBudgetPlannerModal';
import { SmartCalendarSyncModal } from './components/SmartCalendarSyncModal';
import { BulkExportModal } from './components/BulkExportModal';
import { VendorReviewHighlightsModal } from './components/VendorReviewHighlightsModal';
import { CredentialsPdfModal } from './components/CredentialsPdfModal';

import { db } from './services/databaseService';
import { realtimeChat } from './services/realtimeChatService';
import { detectCurrentIndianLocation } from './services/locationService';

import { Sparkles, CheckCircle2, ShoppingBag, ArrowUp, FileText } from 'lucide-react';

export default function App() {
  // Current Authenticated User state
  const [currentUser, setCurrentUser] = useState<UserProfile>(db.getCurrentUser());

  // Custom User/Vendor Uploaded Data
  const [customHalls, setCustomHalls] = useState<MarriageHall[]>(db.getCustomHalls());
  const [customCaterers, setCustomCaterers] = useState<Caterer[]>(db.getCustomCaterers());
  const [customPhotographers, setCustomPhotographers] = useState<Photographer[]>(db.getCustomPhotographers());
  const [customDecors, setCustomDecors] = useState<DecorationTheme[]>(db.getCustomDecors());

  // Master Data State (Decorations allows live like incrementing)
  const [decorations, setDecorations] = useState<DecorationTheme[]>(DECORATIONS_DATA);

  // Global Unified Filter Engine State (Defaults to Page 1: Marriage Halls)
  const [filters, setFilters] = useState<GlobalFilterState>({
    searchQuery: '',
    category: 'halls',
    location: 'All Locations',
    maxPrice: 20000,
    minRating: 0,
    availabilityStatus: 'All',
    selectedDate: '',
    dietaryFilter: 'all',
    hallTopRatedOnly: false,
    decorSortBy: 'default'
  });

  // Bundle / Dream Package State
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [isBundleDrawerOpen, setIsBundleDrawerOpen] = useState(false);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeBookingData, setActiveBookingData] = useState<Partial<BookingDetails> | null>(null);

  // Signature Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [activeMenuCaterer, setActiveMenuCaterer] = useState<Caterer | null>(null);

  // User Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 3-Role Portal State (Customer / Admin / Vendor Listing & Menu Upload)
  const [isMultiRolePortalOpen, setIsMultiRolePortalOpen] = useState(false);
  const [multiRoleInitialRole, setMultiRoleInitialRole] = useState<AuthRoleType>('customer');

  // User Dashboard State
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] = useState<'overview' | 'favorites' | 'bookings' | 'messages' | 'settings'>('overview');

  // Real-Time Chat Modal State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatVendorTarget, setChatVendorTarget] = useState<{
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
    vendorContactName?: string;
    vendorRole?: string;
  } | null>(null);

  // Interactive Pan-India Map State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapInitialTargetItem, setMapInitialTargetItem] = useState<{ lat: number; lng: number; title: string; id: string } | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Features State
  const [isBudgetPlannerOpen, setIsBudgetPlannerOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isReviewHighlightsOpen, setIsReviewHighlightsOpen] = useState(false);
  const [reviewHighlightsTarget, setReviewHighlightsTarget] = useState<{
    id: string;
    name: string;
    category: string;
    location?: string;
    rating?: number;
    reviewsCount?: number;
    priceFormatted?: string;
    image?: string;
  } | null>(null);

  // Sync DB changes
  useEffect(() => {
    const handleDbChange = () => {
      setCurrentUser(db.getCurrentUser());
      setCustomHalls(db.getCustomHalls());
      setCustomCaterers(db.getCustomCaterers());
      setCustomPhotographers(db.getCustomPhotographers());
      setCustomDecors(db.getCustomDecors());
    };
    window.addEventListener('elysian_db_update', handleDbChange);
    return () => window.removeEventListener('elysian_db_update', handleDbChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Filter Updates
  const handleFilterChange = (newFilters: Partial<GlobalFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      location: 'All Locations',
      maxPrice: 20000,
      minRating: 0,
      availabilityStatus: 'All',
      selectedDate: '',
      dietaryFilter: 'all',
      hallTopRatedOnly: false,
      decorSortBy: 'default'
    });
    showToast('Filters reset to default view');
  };

  // Like Toggle on Custom Decor Themes (Interactive Requirement)
  const handleToggleLike = (themeId: string) => {
    setDecorations(prev => prev.map(item => {
      if (item.id === themeId) {
        const isLikedNow = !item.userLiked;
        const newCount = isLikedNow ? item.likesCount + 1 : item.likesCount - 1;
        showToast(isLikedNow ? `Liked "${item.name}" ❤️` : `Removed like from "${item.name}"`);
        
        // Also persist as favorite
        db.toggleFavorite({
          vendorId: item.id,
          vendorType: 'decor',
          vendorName: item.name,
          vendorSubtitle: `${item.location} • ${item.themeCategory}`,
          vendorImage: item.imageUrl,
          rating: item.rating,
          priceFormatted: `$${item.price.toLocaleString()}`,
          location: item.location
        });

        return {
          ...item,
          userLiked: isLikedNow,
          likesCount: newCount
        };
      }
      return item;
    }));
  };

  // Add Item to Dream Wedding Package Bundle
  const handleAddToBundle = (bundleItem: BundleItem) => {
    const existingIndex = bundleItems.findIndex(i => i.item.id === bundleItem.item.id);
    if (existingIndex >= 0) {
      // Remove if already in bundle
      setBundleItems(prev => prev.filter((_, idx) => idx !== existingIndex));
      showToast(`Removed "${bundleItem.item.name}" from your Package`);
    } else {
      setBundleItems(prev => [...prev, bundleItem]);
      showToast(`Added "${bundleItem.item.name}" to your Dream Wedding Package! 🎉`);
    }
  };

  const handleRemoveBundleItem = (index: number) => {
    setBundleItems(prev => prev.filter((_, i) => i !== index));
    showToast('Item removed from wedding package');
  };

  const handleClearBundle = () => {
    setBundleItems([]);
    showToast('Wedding package cleared');
  };

  // Direct Vendor Chat Launcher
  const handleOpenChatWithVendor = (vendor: {
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
    vendorContactName?: string;
    vendorRole?: string;
  }) => {
    setChatVendorTarget(vendor);
    setIsChatModalOpen(true);
  };

  // Open Interactive India Map (Optionally centering on a specific venue)
  const handleOpenMapWithTarget = (item?: { coordinates?: { lat: number; lng: number }; name?: string; id?: string }) => {
    if (item && item.coordinates) {
      setMapInitialTargetItem({
        lat: item.coordinates.lat,
        lng: item.coordinates.lng,
        title: item.name || 'Venue',
        id: item.id || ''
      });
    } else {
      setMapInitialTargetItem(null);
    }
    setIsMapModalOpen(true);
  };

  // Handlers for Opening Booking Modal across 4 services
  const handleBookHall = (hall: MarriageHall, selectedPkg?: PricePackage) => {
    const pkg = selectedPkg || hall.pricePackages[0];
    setActiveBookingData({
      serviceType: 'hall',
      vendorId: hall.id,
      vendorName: hall.name,
      location: hall.location,
      selectedDate: filters.selectedDate || '2026-09-18',
      selectedTimeWindow: 'Full Day Auspicious (07:00 AM - 11:30 PM)',
      estimatedCost: pkg?.price || hall.basePrice,
      packageName: pkg?.name,
      depositAmount: Math.round((pkg?.price || hall.basePrice) * 0.2),
      inclusions: pkg?.features || ['Royal Hall Staging', 'Central AC & Genset', 'Bridal Suite Suite'],
      guestCount: hall.capacityMax
    });
    setIsBookingModalOpen(true);
  };


  const handleBookCaterer = (caterer: Caterer, estimatedCost: number, guestCount: number) => {
    setActiveBookingData({
      serviceType: 'caterer',
      vendorId: caterer.id,
      vendorName: caterer.name,
      location: caterer.location,
      selectedDate: filters.selectedDate || '2026-09-18',
      selectedTimeWindow: 'Evening Banquet Dinner (06:30 PM - 11:00 PM)',
      estimatedCost: estimatedCost,
      packageName: `${caterer.dietaryType} Royal Banquet (${guestCount} guests)`,
      depositAmount: Math.round(estimatedCost * 0.2),
      inclusions: [
        `${caterer.dietaryType} Haute Cuisine`,
        'Live Chaat & Beverage Stations',
        'Fine Porcelain & Silverware Setup',
        'Full White-Glove Captain Service'
      ],
      guestCount: guestCount
    });
    setIsBookingModalOpen(true);
  };

  const handleBookPhotographer = (photographer: Photographer, selectedDate?: string) => {
    setActiveBookingData({
      serviceType: 'photographer',
      vendorId: photographer.id,
      vendorName: photographer.name,
      location: photographer.location,
      selectedDate: selectedDate || filters.selectedDate || '2026-08-28',
      selectedTimeWindow: 'Full Day Cinematic Coverage (10 Hours)',
      estimatedCost: photographer.pricePerDay,
      packageName: `Full Day Cinema & Traditional Coverage`,
      depositAmount: Math.round(photographer.pricePerDay * 0.25),
      inclusions: photographer.deliverables,
      guestCount: 500
    });
    setIsBookingModalOpen(true);
  };

  const handleBookDecor = (decor: DecorationTheme) => {
    setActiveBookingData({
      serviceType: 'decor',
      vendorId: decor.id,
      vendorName: decor.name,
      location: decor.location,
      selectedDate: filters.selectedDate || '2026-09-18',
      selectedTimeWindow: 'Pre-Event Staging (04:00 AM - 04:00 PM)',
      estimatedCost: decor.price,
      packageName: `${decor.themeCategory} Luxury Staging`,
      depositAmount: Math.round(decor.price * 0.2),
      inclusions: decor.elementsIncluded,
      guestCount: 500
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenConsultationModal = () => {
    setActiveBookingData({
      serviceType: 'hall',
      vendorId: 'concierge-vip',
      vendorName: 'Elysian VIP Wedding Concierge Direct',
      location: 'Pan-National Luxury Services',
      selectedDate: '2026-09-18',
      selectedTimeWindow: 'VIP 1-on-1 Virtual Consultation',
      estimatedCost: 0,
      packageName: 'Complimentary Wedding Concierge Consultation',
      depositAmount: 0,
      inclusions: [
        'Dedicated Senior Wedding Architect',
        'Custom Budget & Vendor Matrix Optimization',
        'Direct Negotiated Venue & Muhurtham Dates Locking'
      ],
      guestCount: 300
    });
    setIsBookingModalOpen(true);
  };

  const handleCheckoutBundle = () => {
    const totalCost = bundleItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    setIsBundleDrawerOpen(false);
    setActiveBookingData({
      serviceType: 'hall',
      vendorId: 'bundle-package',
      vendorName: 'Custom Dream Wedding Master Package',
      location: 'Unified Venues & Services',
      selectedDate: filters.selectedDate || '2026-09-18',
      selectedTimeWindow: 'Full Wedding Weekend Coverage',
      estimatedCost: totalCost,
      packageName: `Curated ${bundleItems.length}-Vendor Grand Package`,
      depositAmount: Math.round(totalCost * 0.15),
      inclusions: bundleItems.map(i => `${i.type.toUpperCase()}: ${i.item.name} (${i.selectedPackage || 'Standard'})`),
      guestCount: 450
    });
    setIsBookingModalOpen(true);
  };

  // Location Filter Matcher (Supports All Locations, Pan-India hubs, cities)
  const isLocationMatch = (itemLocation: string, itemArea: string = '', itemCity?: string, itemState?: string) => {
    if (!filters.location || filters.location === 'All Locations' || filters.location === 'All Locations (India)') return true;
    
    // Extract base city name from format like "Chennai - ECR Beach Road & Guindy" or "Chennai"
    const locLower = filters.location.toLowerCase();
    const itemLocLower = itemLocation.toLowerCase();
    const itemAreaLower = (itemArea || '').toLowerCase();
    const itemCityLower = (itemCity || '').toLowerCase();
    const itemStateLower = (itemState || '').toLowerCase();

    // Direct match
    if (itemLocLower === locLower || itemAreaLower.includes(locLower)) return true;
    if (itemCityLower && locLower.includes(itemCityLower)) return true;
    if (itemStateLower && locLower.includes(itemStateLower)) return true;

    // Check city tokens
    const cityTokens = filters.location.split(/[-–,]/).map(t => t.trim().toLowerCase());
    for (const token of cityTokens) {
      if (token && (itemLocLower.includes(token) || itemAreaLower.includes(token))) {
        return true;
      }
    }

    return false;
  };

  // Helper to check occasion suitability
  const isOccasionMatch = (suitableOccasions?: string[]) => {
    if (!filters.occasion || filters.occasion === 'All Occasions (Birthdays, Weddings, Traditional Rites)' || filters.occasion === 'All Occasions') return true;
    if (!suitableOccasions || suitableOccasions.length === 0) return true;
    
    const filterOccLower = filters.occasion.toLowerCase();
    return suitableOccasions.some(occ => {
      const occLower = occ.toLowerCase();
      // Match keywords (birthday, upanayanam, wedding, anniversary, baby shower, homam, etc.)
      if (filterOccLower.includes('birthday') && (occLower.includes('birthday') || occLower.includes('ayushya') || occLower.includes('janmadin') || occLower.includes('cake smash') || occLower.includes('choroonu') || occLower.includes('annaprashan'))) return true;
      if (filterOccLower.includes('vedic') && (occLower.includes('vedic') || occLower.includes('upanayanam') || occLower.includes('poonal') || occLower.includes('janeu') || occLower.includes('homa') || occLower.includes('shanti'))) return true;
      if (filterOccLower.includes('wedding') && (occLower.includes('wedding') || occLower.includes('vivah') || occLower.includes('kalyana') || occLower.includes('nikah') || occLower.includes('anand karaj') || occLower.includes('matrimony') || occLower.includes('reception'))) return true;
      if (filterOccLower.includes('shower') && (occLower.includes('shower') || occLower.includes('godh') || occLower.includes('seemantham') || occLower.includes('valakaappu'))) return true;
      return occLower.includes(filterOccLower) || filterOccLower.includes(occLower);
    });
  };

  // Helper to check religious tradition suitability
  const isReligionMatch = (religiousTraditions?: string[]) => {
    if (!filters.religiousTradition || filters.religiousTradition === 'All Faiths & Cultural Traditions' || filters.religiousTradition === 'All Faiths') return true;
    if (!religiousTraditions || religiousTraditions.length === 0) return true;

    const filterRelLower = filters.religiousTradition.toLowerCase();
    return religiousTraditions.some(rel => {
      const relLower = rel.toLowerCase();
      if (relLower.includes('secular') || relLower.includes('multi-faith') || relLower.includes('all traditions')) return true;
      if (filterRelLower.includes('hindu') && relLower.includes('hindu')) return true;
      if (filterRelLower.includes('muslim') && (relLower.includes('muslim') || relLower.includes('islam') || relLower.includes('nikah') || relLower.includes('halal'))) return true;
      if (filterRelLower.includes('christian') && (relLower.includes('christian') || relLower.includes('catholic') || relLower.includes('protestant') || relLower.includes('orthodox'))) return true;
      if (filterRelLower.includes('sikh') && (relLower.includes('sikh') || relLower.includes('anand karaj') || relLower.includes('gurdwara'))) return true;
      if (filterRelLower.includes('jain') && (relLower.includes('jain') || relLower.includes('chauvihar'))) return true;
      if (filterRelLower.includes('parsi') && (relLower.includes('parsi') || relLower.includes('zoroastrian'))) return true;
      return relLower.includes(filterRelLower) || filterRelLower.includes(relLower);
    });
  };

  // Unified Combined Datasets (System Pan-India Data + Admin-Approved Custom Vendor Listings)
  const approvedCustomHalls = useMemo(() => customHalls.filter(h => h.approvalStatus === 'approved'), [customHalls]);
  const approvedCustomCaterers = useMemo(() => customCaterers.filter(c => c.approvalStatus === 'approved'), [customCaterers]);
  const approvedCustomPhotographers = useMemo(() => customPhotographers.filter(p => p.approvalStatus === 'approved'), [customPhotographers]);
  const approvedCustomDecors = useMemo(() => customDecors.filter(d => d.approvalStatus === 'approved'), [customDecors]);

  const allHalls = useMemo(() => [...MARRIAGE_HALLS_DATA, ...approvedCustomHalls], [approvedCustomHalls]);
  const allCaterers = useMemo(() => [...CATERERS_DATA, ...approvedCustomCaterers], [approvedCustomCaterers]);
  const allPhotographers = useMemo(() => [...PHOTOGRAPHERS_DATA, ...approvedCustomPhotographers], [approvedCustomPhotographers]);
  const allDecorations = useMemo(() => [...decorations, ...approvedCustomDecors], [decorations, approvedCustomDecors]);

  // Global Filter Engine Calculations
  const filteredHalls = useMemo(() => {
    return allHalls.filter(hall => {
      if (filters.category !== 'all' && filters.category !== 'halls') return false;
      if (!isLocationMatch(hall.location, hall.area, hall.city, hall.state)) return false;
      if (!isOccasionMatch(hall.suitableOccasions)) return false;
      if (!isReligionMatch(hall.religiousTraditions)) return false;
      if (hall.basePrice > filters.maxPrice) return false;
      if (hall.rating < filters.minRating) return false;
      if (filters.availabilityStatus !== 'All' && hall.bookingStatus !== filters.availabilityStatus) return false;
      if (filters.hallTopRatedOnly && hall.rating < 4.85) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = hall.name.toLowerCase().includes(q);
        const matchesLoc = hall.location.toLowerCase().includes(q) || hall.area.toLowerCase().includes(q);
        const matchesTagline = hall.tagline.toLowerCase().includes(q);
        const matchesAmenity = hall.amenities.some(f => f.toLowerCase().includes(q));
        const matchesDesc = hall.description.toLowerCase().includes(q);
        const matchesOccasion = (hall.suitableOccasions || []).some(o => o.toLowerCase().includes(q));
        const matchesReligion = (hall.religiousTraditions || []).some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesTagline && !matchesAmenity && !matchesDesc && !matchesOccasion && !matchesReligion) return false;
      }
      return true;
    });
  }, [filters, allHalls]);

  const filteredCaterers = useMemo(() => {
    return allCaterers.filter(caterer => {
      if (filters.category !== 'all' && filters.category !== 'caterers') return false;
      if (!isLocationMatch(caterer.location, caterer.area, caterer.city, caterer.state)) return false;
      if (!isOccasionMatch(caterer.suitableOccasions)) return false;
      if (!isReligionMatch(caterer.religiousTraditions)) return false;
      if (caterer.costPerPlate * (caterer.minimumPlates || 200) > filters.maxPrice * 2) return false;
      if (caterer.rating < filters.minRating) return false;
      if (filters.availabilityStatus !== 'All' && caterer.bookingStatus !== filters.availabilityStatus) return false;
      if (filters.dietaryFilter !== 'all' && caterer.dietaryType !== filters.dietaryFilter) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = caterer.name.toLowerCase().includes(q);
        const matchesLoc = caterer.location.toLowerCase().includes(q) || caterer.area.toLowerCase().includes(q);
        const matchesSpeciality = caterer.tagline.toLowerCase().includes(q) || caterer.cuisineSpecialties.some(c => c.toLowerCase().includes(q));
        const matchesMenu = caterer.signatureDishes.some(m => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
        const matchesDesc = caterer.description.toLowerCase().includes(q);
        const matchesOccasion = (caterer.suitableOccasions || []).some(o => o.toLowerCase().includes(q));
        const matchesReligion = (caterer.religiousTraditions || []).some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesSpeciality && !matchesMenu && !matchesDesc && !matchesOccasion && !matchesReligion) return false;
      }
      return true;
    });
  }, [filters, allCaterers]);

  const filteredPhotographers = useMemo(() => {
    return allPhotographers.filter(photo => {
      if (filters.category !== 'all' && filters.category !== 'photographers') return false;
      if (!isLocationMatch(photo.location, photo.area, photo.city, photo.state)) return false;
      if (!isOccasionMatch(photo.suitableOccasions)) return false;
      if (!isReligionMatch(photo.religiousTraditions)) return false;
      if (photo.pricePerDay > filters.maxPrice) return false;
      if (photo.rating < filters.minRating) return false;
      if (filters.availabilityStatus !== 'All' && photo.bookingStatus !== filters.availabilityStatus) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = photo.name.toLowerCase().includes(q) || photo.studioName.toLowerCase().includes(q);
        const matchesLoc = photo.location.toLowerCase().includes(q) || photo.area.toLowerCase().includes(q);
        const matchesSpecialty = photo.specialties.some(s => s.toLowerCase().includes(q));
        const matchesDeliv = photo.deliverables.some(d => d.toLowerCase().includes(q));
        const matchesTagline = photo.tagline.toLowerCase().includes(q);
        const matchesOccasion = (photo.suitableOccasions || []).some(o => o.toLowerCase().includes(q));
        const matchesReligion = (photo.religiousTraditions || []).some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesSpecialty && !matchesDeliv && !matchesTagline && !matchesOccasion && !matchesReligion) return false;
      }
      return true;
    });
  }, [filters, allPhotographers]);

  const filteredDecorations = useMemo(() => {
    return allDecorations.filter(decor => {
      if (filters.category !== 'all' && filters.category !== 'decorations') return false;
      if (!isLocationMatch(decor.location, decor.area, decor.city, decor.state)) return false;
      if (!isOccasionMatch(decor.suitableOccasions)) return false;
      if (!isReligionMatch(decor.religiousTraditions)) return false;
      if (decor.price > filters.maxPrice) return false;
      if (decor.rating < filters.minRating) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = decor.name.toLowerCase().includes(q) || decor.designerStudio.toLowerCase().includes(q);
        const matchesLoc = decor.location.toLowerCase().includes(q) || decor.area.toLowerCase().includes(q);
        const matchesTheme = decor.themeCategory.toLowerCase().includes(q);
        const matchesElem = decor.elementsIncluded.some(e => e.toLowerCase().includes(q));
        const matchesDesc = decor.description.toLowerCase().includes(q);
        const matchesOccasion = (decor.suitableOccasions || []).some(o => o.toLowerCase().includes(q));
        const matchesReligion = (decor.religiousTraditions || []).some(r => r.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesTheme && !matchesElem && !matchesDesc && !matchesOccasion && !matchesReligion) return false;
      }
      return true;
    });
  }, [filters, allDecorations]);


  const totalResultsCount = filteredHalls.length + filteredCaterers.length + filteredPhotographers.length + filteredDecorations.length;

  const bundleIds = {
    hall: bundleItems.filter(b => b.type === 'hall').map(b => b.item.id),
    caterer: bundleItems.filter(b => b.type === 'caterer').map(b => b.item.id),
    photographer: bundleItems.filter(b => b.type === 'photographer').map(b => b.item.id),
    decor: bundleItems.filter(b => b.type === 'decor').map(b => b.item.id)
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#C5A059] selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
        selectedLocation={filters.location}
        onSelectLocation={(loc) => handleFilterChange({ location: loc })}
        bundleItems={bundleItems}
        onOpenBundleDrawer={() => setIsBundleDrawerOpen(true)}
        onOpenConsultationModal={handleOpenConsultationModal}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDashboard={() => {
          setDashboardInitialTab('overview');
          setIsDashboardOpen(true);
        }}
        onOpenChat={() => {
          setChatVendorTarget(null);
          setIsChatModalOpen(true);
        }}
        onOpenMap={() => handleOpenMapWithTarget()}
        onOpenMultiRolePortal={(role) => {
          setMultiRoleInitialRole(role || 'customer');
          setIsMultiRolePortalOpen(true);
        }}
        onOpenBudgetPlanner={() => setIsBudgetPlannerOpen(true)}
        onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
        onOpenBulkExport={() => setIsBulkExportOpen(true)}
      />

      {/* Primary Page Router (4 Dedicated Pages: Halls, Caterers, Photographers, Decor + Explore All) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Page 1: Marriage Halls & Palaces */}
        {filters.category === 'halls' && (
          <HallsPage
            halls={filteredHalls}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
            onBookHall={handleBookHall}
            onAddToBundle={handleAddToBundle}
            bundleHallIds={bundleIds.hall}
            onOpenChatWithVendor={handleOpenChatWithVendor}
            onViewOnMap={(hall) => handleOpenMapWithTarget(hall)}
            onOpenMap={() => handleOpenMapWithTarget()}
            itemCounts={{
              halls: allHalls.length,
              caterers: allCaterers.length,
              photographers: allPhotographers.length,
              decorations: allDecorations.length
            }}
          />
        )}

        {/* Page 2: Royal Caterers & Menus */}
        {filters.category === 'caterers' && (
          <CaterersPage
            caterers={filteredCaterers}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
            onOpenMenuModal={(caterer) => {
              setActiveMenuCaterer(caterer);
              setIsMenuModalOpen(true);
            }}
            onBookCaterer={handleBookCaterer}
            onAddToBundle={handleAddToBundle}
            bundleCatererIds={bundleIds.caterer}
            onOpenChatWithVendor={handleOpenChatWithVendor}
            onOpenMap={() => handleOpenMapWithTarget()}
            itemCounts={{
              halls: allHalls.length,
              caterers: allCaterers.length,
              photographers: allPhotographers.length,
              decorations: allDecorations.length
            }}
          />
        )}

        {/* Page 3: Wedding Photographers & Cinema */}
        {filters.category === 'photographers' && (
          <PhotographersPage
            photographers={filteredPhotographers}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
            onBookPhotographer={handleBookPhotographer}
            onAddToBundle={handleAddToBundle}
            bundlePhotographerIds={bundleIds.photographer}
            onOpenChatWithVendor={handleOpenChatWithVendor}
            onOpenMap={() => handleOpenMapWithTarget()}
            itemCounts={{
              halls: allHalls.length,
              caterers: allCaterers.length,
              photographers: allPhotographers.length,
              decorations: allDecorations.length
            }}
          />
        )}

        {/* Page 4: Hall Decor & Staging Teams */}
        {filters.category === 'decorations' && (
          <DecorationsPage
            decorations={filteredDecorations}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
            onToggleLike={handleToggleLike}
            onBookDecor={handleBookDecor}
            onAddToBundle={handleAddToBundle}
            bundleDecorIds={bundleIds.decor}
            onOpenChatWithVendor={handleOpenChatWithVendor}
            onOpenMap={() => handleOpenMapWithTarget()}
            itemCounts={{
              halls: allHalls.length,
              caterers: allCaterers.length,
              photographers: allPhotographers.length,
              decorations: allDecorations.length
            }}
          />
        )}

        {/* All Sectors Comprehensive View */}
        {filters.category === 'all' && (
          <ExploreAllPage
            halls={filteredHalls}
            caterers={filteredCaterers}
            photographers={filteredPhotographers}
            decorations={filteredDecorations}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
            onBookHall={handleBookHall}
            onOpenMenuModal={(caterer) => {
              setActiveMenuCaterer(caterer);
              setIsMenuModalOpen(true);
            }}
            onBookCaterer={handleBookCaterer}
            onBookPhotographer={handleBookPhotographer}
            onToggleLike={handleToggleLike}
            onBookDecor={handleBookDecor}
            onAddToBundle={handleAddToBundle}
            bundleIds={bundleIds}
            onOpenChatWithVendor={handleOpenChatWithVendor}
            onViewOnMap={(hall) => handleOpenMapWithTarget(hall)}
            onOpenMap={() => handleOpenMapWithTarget()}
            onOpenMultiRolePortal={(role) => {
              setMultiRoleInitialRole(role || 'vendor');
              setIsMultiRolePortalOpen(true);
            }}
            itemCounts={{
              halls: allHalls.length,
              caterers: allCaterers.length,
              photographers: allPhotographers.length,
              decorations: allDecorations.length
            }}
          />
        )}

      </main>

      {/* Floating Real-time Chat Launcher & Notification Toast */}
      <FloatingChatWidget
        onOpenChat={() => {
          setChatVendorTarget(null);
          setIsChatModalOpen(true);
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-[#FDFCFB] px-5 py-3 rounded-xl shadow-xl border border-[#C5A059]/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Sparkles className="w-4 h-4 text-[#C5A059]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Booking & Date Hold Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingData={activeBookingData}
        onConfirmBooking={(confirmed) => {
          // Persist to user's database records
          db.addBooking({
            referenceId: confirmed.id,
            serviceType: confirmed.serviceType,
            vendorId: confirmed.vendorId,
            serviceTitle: confirmed.vendorName,
            serviceSubtitle: `${confirmed.location} • ${confirmed.packageName || 'Reserved Package'}`,
            packageTier: confirmed.packageName,
            eventDate: confirmed.selectedDate,
            timeWindow: confirmed.selectedTimeWindow,
            guestCount: confirmed.guestCount,
            basePrice: confirmed.estimatedCost,
            taxAmount: Math.round(confirmed.estimatedCost * 0.08),
            totalAmount: Math.round(confirmed.estimatedCost * 1.08),
            depositPaid: confirmed.depositAmount,
            status: 'Confirmed',
            clientName: confirmed.clientName,
            clientEmail: confirmed.clientEmail,
            clientPhone: confirmed.clientPhone,
            specialRequests: confirmed.specialRequests
          });

          showToast(`Reservation #${confirmed.id} Confirmed! Escrow locked & synced to your Dashboard.`);
        }}
      />

      {/* Signature Menu Details Modal */}
      <SignatureMenuModal
        caterer={activeMenuCaterer}
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onBookTasting={(caterer) => {
          handleBookCaterer(caterer, caterer.costPerPlate * (caterer.minimumPlates || 200), caterer.minimumPlates || 200);
        }}
      />

      {/* Wedding Package Bundle Slide-over Drawer */}
      <WeddingBundleDrawer
        isOpen={isBundleDrawerOpen}
        onClose={() => setIsBundleDrawerOpen(false)}
        items={bundleItems}
        onRemoveItem={handleRemoveBundleItem}
        onClearBundle={handleClearBundle}
        onCheckoutBundle={handleCheckoutBundle}
        onNavigateToSector={(sector) => handleFilterChange({ category: sector })}
      />

      {/* User Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={(user) => {
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      {/* User Profile & Wedding Planner Management Dashboard */}
      <UserProfileDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        initialTab={dashboardInitialTab}
        onOpenChatWithVendor={(vendor) => {
          setIsDashboardOpen(false);
          handleOpenChatWithVendor(vendor);
        }}
        onBookFavorite={(fav) => {
          setIsDashboardOpen(false);
          // Navigate to sector
          handleFilterChange({ category: fav.vendorType === 'hall' ? 'halls' : fav.vendorType === 'caterer' ? 'caterers' : fav.vendorType === 'photographer' ? 'photographers' : 'decorations' });
        }}
        onOpenBudgetPlanner={() => setIsBudgetPlannerOpen(true)}
        onOpenCalendarSync={() => setIsCalendarSyncOpen(true)}
        onOpenBulkExport={() => setIsBulkExportOpen(true)}
      />

      {/* Interactive Pan-India Map Modal */}
      <InteractiveIndiaMap
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        halls={filteredHalls}
        caterers={filteredCaterers}
        photographers={filteredPhotographers}
        decorations={filteredDecorations}
        initialTargetItem={mapInitialTargetItem}
        onSelectItemForBooking={(type, item) => {
          setIsMapModalOpen(false);
          if (type === 'hall') handleBookHall(item);
          else if (type === 'caterer') handleBookCaterer(item, item.costPerPlate * (item.minimumPlates || 200), item.minimumPlates || 200);
          else if (type === 'photographer') handleBookPhotographer(item);
          else if (type === 'decor') handleBookDecor(item);
        }}
        onAddToBundle={(type, item) => {
          if (type === 'hall') {
            handleAddToBundle({
              type: 'hall',
              item: item,
              estimatedCost: item.basePrice,
              selectedPackage: item.pricePackages?.[0]?.name
            });
          } else if (type === 'caterer') {
            handleAddToBundle({
              type: 'caterer',
              item: item,
              estimatedCost: item.costPerPlate * (item.minimumPlates || 200),
              selectedPackage: item.dietaryType
            });
          } else if (type === 'photographer') {
            handleAddToBundle({
              type: 'photographer',
              item: item,
              estimatedCost: item.pricePerDay
            });
          } else if (type === 'decor') {
            handleAddToBundle({
              type: 'decor',
              item: item,
              estimatedCost: item.price
            });
          }
        }}
        onOpenChat={(vendor) => {
          setIsMapModalOpen(false);
          handleOpenChatWithVendor({
            vendorId: vendor.id,
            vendorType: vendor.type,
            vendorName: vendor.title,
            vendorSubtitle: vendor.subtitle || vendor.location,
            vendorAvatar: vendor.imageUrl,
            vendorContactName: vendor.originalItem?.conciergeName || vendor.originalItem?.masterChef || vendor.originalItem?.leadArtist || vendor.originalItem?.designerStudio,
            vendorRole: vendor.originalItem?.conciergeRole || 'Wedding Consultant'
          });
        }}
      />

      {/* Real-time Vendor Chat Modal */}
      <ChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        initialVendor={chatVendorTarget}
        onBookVendor={(vendorId, vendorType) => {
          setIsChatModalOpen(false);
          if (vendorType === 'hall') {
            const hall = MARRIAGE_HALLS_DATA.find(h => h.id === vendorId);
            if (hall) handleBookHall(hall);
          } else if (vendorType === 'caterer') {
            const cat = CATERERS_DATA.find(c => c.id === vendorId);
            if (cat) handleBookCaterer(cat, cat.costPerPlate * 250, 250);
          } else if (vendorType === 'photographer') {
            const p = PHOTOGRAPHERS_DATA.find(ph => ph.id === vendorId);
            if (p) handleBookPhotographer(p);
          } else if (vendorType === 'decor') {
            const d = DECORATIONS_DATA.find(dc => dc.id === vendorId);
            if (d) handleBookDecor(d);
          }
        }}
      />

      {/* Multi-Role Unified Portal (Customer • Admin • Vendor Listing & Menu Upload) */}
      <MultiRolePortalPage
        isOpen={isMultiRolePortalOpen}
        onClose={() => setIsMultiRolePortalOpen(false)}
        initialRole={multiRoleInitialRole}
        onShowToast={showToast}
        onNavigateToListing={(category, id) => {
          setIsMultiRolePortalOpen(false);
          const mappedCategory = 
            category === 'hall' ? 'halls' :
            category === 'caterer' ? 'caterers' :
            category === 'photographer' ? 'photographers' :
            category === 'decor' ? 'decorations' : (category as any);
          handleFilterChange({ category: mappedCategory });
          if (id) {
            setTimeout(() => {
              const el = document.getElementById(`hall-card-${id}`) || document.getElementById(`caterer-card-${id}`) || document.getElementById(`photo-card-${id}`) || document.getElementById(`decor-card-${id}`);
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          }
        }}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
        onOpenConsultationModal={handleOpenConsultationModal}
        onOpenMultiRolePortal={(role) => {
          setMultiRoleInitialRole(role || 'vendor');
          setIsMultiRolePortalOpen(true);
        }}
      />

      {/* Responsive Mobile Bottom Navigation Bar (Smartphones & Tablets < 768px) */}
      <MobileBottomNav
        activeCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
        bundleItems={bundleItems}
        onOpenBundleDrawer={() => setIsBundleDrawerOpen(true)}
        unreadChatCount={db.getTotalUnreadCount()}
        onOpenChat={() => {
          setChatVendorTarget(null);
          setIsChatModalOpen(true);
        }}
        onOpenMap={() => handleOpenMapWithTarget()}
        onOpenMultiRolePortal={(role) => {
          setMultiRoleInitialRole(role || 'vendor');
          setIsMultiRolePortalOpen(true);
        }}
        onOpenDashboard={() => {
          setDashboardInitialTab('overview');
          setIsDashboardOpen(true);
        }}
        currentUser={currentUser}
      />

      {/* Extra spacer on mobile to prevent content clipping behind bottom navigation bar */}
      <div className="md:hidden h-14 w-full" />

      {/* AI Wedding Budget Planner Modal */}
      <AiWeddingBudgetPlannerModal
        isOpen={isBudgetPlannerOpen}
        onClose={() => setIsBudgetPlannerOpen(false)}
        onSelectPackage={(rec) => {
          showToast(`Applied ${rec.sector} recommendation to wedding plan!`);
          const targetSector = 
            rec.sector.toLowerCase().includes('hall') || rec.sector.toLowerCase().includes('venue') ? 'halls' :
            rec.sector.toLowerCase().includes('cater') || rec.sector.toLowerCase().includes('food') ? 'caterers' :
            rec.sector.toLowerCase().includes('photo') || rec.sector.toLowerCase().includes('cinema') ? 'photographers' : 'decorations';
          handleFilterChange({ category: targetSector });
        }}
      />

      {/* Smart Calendar Sync Modal */}
      <SmartCalendarSyncModal
        isOpen={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
        bookings={currentUser.role === 'admin' ? db.getAllSystemBookings() : db.getBookings(currentUser.id)}
      />

      {/* Bulk Booking Export Modal */}
      <BulkExportModal
        isOpen={isBulkExportOpen}
        onClose={() => setIsBulkExportOpen(false)}
        bookings={currentUser.role === 'admin' ? db.getAllSystemBookings() : db.getBookings(currentUser.id)}
        defaultRole={currentUser.role}
      />

      {/* Vendor Review Highlights Modal */}
      <VendorReviewHighlightsModal
        isOpen={isReviewHighlightsOpen}
        onClose={() => {
          setIsReviewHighlightsOpen(false);
          setReviewHighlightsTarget(null);
        }}
        vendor={reviewHighlightsTarget}
      />

      {/* Confidential Credentials PDF Modal (Restricted to Super Admin) */}
      <CredentialsPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onShowToast={showToast}
        currentUser={currentUser}
      />

      {/* Floating Download Credentials PDF Badge - STRICTLY VISIBLE TO SUPER ADMIN ONLY */}
      {currentUser.role === 'admin' && (
        <button
          type="button"
          onClick={() => setIsPdfModalOpen(true)}
          className="fixed bottom-20 left-4 z-40 hidden md:flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-[#C5A059] border border-[#C5A059]/40 rounded-full text-xs font-bold shadow-xl transition-all hover:scale-105 cursor-pointer"
          title="Download Confidential Platform Credentials (Admin Only PDF)"
        >
          <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Download Credentials (PDF)</span>
        </button>
      )}

    </div>
  );
}
