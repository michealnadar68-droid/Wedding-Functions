import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Upload, 
  Eye, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  LogOut, 
  FileText, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Users, 
  Layers, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Briefcase,
  XCircle,
  X,
  Info,
  RefreshCw,
  FileCheck,
  BarChart3,
  FileDown
} from 'lucide-react';
import { 
  AuthRoleType, 
  UserProfile, 
  MarriageHall, 
  Caterer, 
  Photographer, 
  DecorationTheme, 
  MenuItem, 
  PricePackage,
  TimeWindow,
  BookingRecord
} from '../types';
import { db, DEMO_ACCOUNTS } from '../services/databaseService';
import { formatINR, formatPerPlate, formatPerDay } from '../utils/formatters';
import { LOCATIONS_LIST, PAN_INDIA_CITIES } from '../data/mockData';
import { VendorSubmissionsView } from './portal/VendorSubmissionsView';
import { AdminApprovalsView } from './portal/AdminApprovalsView';
import { VendorAnalyticsDashboard } from './portal/VendorAnalyticsDashboard';
import { BulkExportModal } from './BulkExportModal';
import { CredentialsPdfModal } from './CredentialsPdfModal';
import { generateCredentialsPdf } from '../utils/credentialsPdfGenerator';
import { EyeOff, Key } from 'lucide-react';

interface MultiRolePortalPageProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: AuthRoleType;
  onNavigateToListing?: (category: string, id: string) => void;
  onShowToast: (msg: string) => void;
}

export const MultiRolePortalPage: React.FC<MultiRolePortalPageProps> = ({
  isOpen,
  onClose,
  initialRole = 'customer',
  onNavigateToListing,
  onShowToast
}) => {
  // Current active portal tab: 'customer' | 'admin' | 'vendor'
  const [activeTab, setActiveTab] = useState<AuthRoleType>(initialRole);

  // Authenticated User from Database
  const [currentUser, setCurrentUser] = useState<UserProfile>(db.getCurrentUser());

  // Customer Form State
  const [custMode, setCustMode] = useState<'login' | 'signup'>('login');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custOccasion, setCustOccasion] = useState('Weddings & Royal Vivah');
  const [custDate, setCustDate] = useState('2026-11-20');
  const [custBudget, setCustBudget] = useState('2500000');
  const [custCity, setCustCity] = useState('Mumbai');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const handleFillAdminCredentials = () => {
    setAdminEmail('admin@elysianweddings.in');
    setAdminPassword('Admin@Elysian2026!');
    onShowToast('Auto-filled Super Admin credentials 🔑');
  };

  // Vendor Register / Manage State
  const [vendorMode, setVendorMode] = useState<'login' | 'register' | 'workspace'>('login');
  const [vendorSector, setVendorSector] = useState<'hall' | 'caterer' | 'photographer' | 'decor'>('hall');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorPassword, setVendorPassword] = useState('');
  const [vendorBusinessName, setVendorBusinessName] = useState('');
  const [vendorManagerName, setVendorManagerName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorCity, setVendorCity] = useState('Mumbai');
  const [vendorState, setVendorState] = useState('Maharashtra');
  const [vendorGSTIN, setVendorGSTIN] = useState('27AABCS1429B1Z8');

  // --- VENDOR UPLOAD WORKSPACE FORM STATES ---
  // 1. Hall Form State
  const [hallName, setHallName] = useState('');
  const [hallTagline, setHallTagline] = useState('');
  const [hallArea, setHallArea] = useState('');
  const [hallCity, setHallCity] = useState('Mumbai');
  const [hallState, setHallState] = useState('Maharashtra');
  const [hallAddress, setHallAddress] = useState('');
  const [hallMinCap, setHallMinCap] = useState(200);
  const [hallMaxCap, setHallMaxCap] = useState(1500);
  const [hallDiningCap, setHallDiningCap] = useState(600);
  const [hallParkingCap, setHallParkingCap] = useState(250);
  const [hallAcType, setHallAcType] = useState<'Centralized HVAC' | 'Air Conditioned' | 'Hybrid Open Air & AC'>('Centralized HVAC');
  const [hallBasePrice, setHallBasePrice] = useState(250000);
  const [hallImageUrl, setHallImageUrl] = useState('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80');
  const [hallSelectedOccasions, setHallSelectedOccasions] = useState<string[]>([
    'Weddings & Royal Vivah',
    '1st Year Birthday & Janmadin',
    'Upanayanam & Sacred Vedic Rites',
    'Receptions & Sangeet'
  ]);
  const [hallSelectedFaiths, setHallSelectedFaiths] = useState<string[]>([
    'Hindu Vedic & Traditional',
    'Multi-Faith & Secular Celebrations'
  ]);
  const [hallAmenities, setHallAmenities] = useState<string>('Air Conditioned, Valet Parking, Dedicated Bridal Suite, Hawan & Homam Permitted, Backup Power Generator, Sound & Lighting Truss');

  // 2. Caterer Form State
  const [catName, setCatName] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catDietaryType, setCatDietaryType] = useState<'Pure Veg' | 'Non-Veg & Mixed'>('Pure Veg');
  const [catCostPerPlate, setCatCostPerPlate] = useState(1250);
  const [catMinPlates, setCatMinPlates] = useState(200);
  const [catArea, setCatArea] = useState('');
  const [catCity, setCatCity] = useState('Delhi NCR');
  const [catCoordinator, setCatCoordinator] = useState('');
  const [catPhone, setCatPhone] = useState('');
  const [catEmail, setCatEmail] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80');
  const [catSpecialties, setCatSpecialties] = useState('Royal Awadhi, South Indian Satvik Banana Leaf, Live Chaat Bazaar, Artisanal Mithai');
  const [catDishes, setCatDishes] = useState<MenuItem[]>([
    {
      id: 'dish_1',
      name: 'Paneer Lababdar & Zafrani Dum Biryani',
      description: 'Slow-cooked in sealed handis with saffron and authentic spices',
      category: 'Main Entrees',
      isVeg: true,
      dietaryTags: ['Jain Available', 'Chef Special', 'Pure Ghee']
    },
    {
      id: 'dish_2',
      name: 'Banarasi Chaat & Nitrogen Paan Pavilion',
      description: 'Interactive live counter with custom garnishes',
      category: 'Live Counters & Chaat',
      isVeg: true,
      dietaryTags: ['Live Counter', 'Popular']
    }
  ]);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCat, setNewDishCat] = useState<MenuItem['category']>('Main Entrees');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIsVeg, setNewDishIsVeg] = useState(true);

  // 3. Photographer Form State
  const [photoName, setPhotoName] = useState('');
  const [photoStudioName, setPhotoStudioName] = useState('');
  const [photoTagline, setPhotoTagline] = useState('');
  const [photoCity, setPhotoCity] = useState('Bengaluru');
  const [photoState, setPhotoState] = useState('Karnataka');
  const [photoPricePerDay, setPhotoPricePerDay] = useState(85000);
  const [photoExperience, setPhotoExperience] = useState(8);
  const [photoTravelKm, setPhotoTravelKm] = useState(500);
  const [photoPhone, setPhotoPhone] = useState('');
  const [photoEmail, setPhotoEmail] = useState('');
  const [photoImageUrl, setPhotoImageUrl] = useState('https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80');
  const [photoSpecialties, setPhotoSpecialties] = useState('Cinematic 4K Drone, 1st Birthday Milestones, Traditional Vedic Rites, Candid Moments');
  const [photoDeliverables, setPhotoDeliverables] = useState('Full Wedding Film, 90-Sec Same Day Teaser, Premium Leather Album, Raw 4K Footage Drive');
  const [photoGear, setPhotoGear] = useState('Sony FX3 Cinema, Sony A7R V, DJI Mavic 3 Cine Drone, Master G-Master Primes');
  const [photoGallery, setPhotoGallery] = useState<{ url: string; title: string; caption: string }[]>([
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
      title: 'Royal Mandapam Vows',
      caption: 'Sacred saat phere captured in golden hour luminescence'
    },
    {
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80',
      title: 'Ayushya Homam 1st Birthday',
      caption: 'Joyous candid cake smash & family blessings'
    }
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // 4. Decor Form State
  const [decorName, setDecorName] = useState('');
  const [decorStudio, setDecorStudio] = useState('');
  const [decorCategory, setDecorCategory] = useState<DecorationTheme['themeCategory']>('Royal Traditional');
  const [decorCity, setDecorCity] = useState('Jaipur');
  const [decorPrice, setDecorPrice] = useState(185000);
  const [decorMinCeiling, setDecorMinCeiling] = useState(14);
  const [decorMinStageWidth, setDecorMinStageWidth] = useState(25);
  const [decorIndoorOutdoor, setDecorIndoorOutdoor] = useState<'Indoor Only' | 'Indoor & Outdoor' | 'Lawn & Open Air'>('Indoor & Outdoor');
  const [decorColors, setDecorColors] = useState<string>('#C5A059, #8C2424, #FAF5EA, #E5D5BA');
  const [decorElements, setDecorElements] = useState<string>('Grand Carved Mandap Pillars, Fresh Marigold & Jasmine Floral Drapes, Crystal Chandelier Ceiling, Brass Urli Setup');
  const [decorImageUrl, setDecorImageUrl] = useState('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80');

  // Admin Data View State
  const [adminBookings, setAdminBookings] = useState<BookingRecord[]>(db.getAllSystemBookings());
  
  // Vendor Workspace Sub-tabs & Submissions
  const [vendorActiveSubTab, setVendorActiveSubTab] = useState<'upload' | 'my_listings' | 'analytics' | 'profile'>('upload');
  const [vendorSubmissions, setVendorSubmissions] = useState(db.getVendorSubmissions(currentUser.id));
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Admin Portal Sub-tabs & Approvals
  const [adminActiveSubTab, setAdminActiveSubTab] = useState<'pending_approvals' | 'all_listings' | 'escrow'>('pending_approvals');
  const [pendingApprovals, setPendingApprovals] = useState(db.getAllPendingSubmissions());
  const [adminFeedbackNotes, setAdminFeedbackNotes] = useState<Record<string, string>>({});
  const [rejectModalItem, setRejectModalItem] = useState<{ category: 'hall' | 'caterer' | 'photographer' | 'decor'; id: string; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Listen to DB updates
  useEffect(() => {
    db.ensureInitialPendingSubmissions();
    const handleDbUpdate = () => {
      const user = db.getCurrentUser();
      setCurrentUser(user);
      setAdminBookings(db.getAllSystemBookings());
      setVendorSubmissions(db.getVendorSubmissions(user.id));
      setPendingApprovals(db.getAllPendingSubmissions());
    };
    handleDbUpdate();
    window.addEventListener('elysian_db_update', handleDbUpdate);
    return () => window.removeEventListener('elysian_db_update', handleDbUpdate);
  }, [currentUser.id]);

  if (!isOpen) return null;

  // --- AUTH ACTIONS ---
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custEmail) {
      onShowToast('Please provide an email address');
      return;
    }

    if (custMode === 'login') {
      const user = db.login(custEmail, custPassword, 'customer');
      setCurrentUser(user);
      onShowToast(`Welcome back, ${user.name}! 🌟`);
    } else {
      const user = db.registerCustomer({
        name: custName || custEmail.split('@')[0],
        email: custEmail,
        phone: custPhone || '+91 98200 00000',
        occasionType: custOccasion,
        weddingDate: custDate,
        targetBudget: parseInt(custBudget) || 2500000,
        location: custCity
      });
      setCurrentUser(user);
      onShowToast(`Account created successfully! Welcome to Elysian Wedlock.`);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = db.login(adminEmail || 'admin@elysianweddings.in', adminPassword, 'admin');
    setCurrentUser(user);
    onShowToast(`Super Admin Verified: Access Granted to Master Council Console 🛡️`);
  };

  const handleVendorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorBusinessName || !vendorEmail) {
      onShowToast('Please provide your business name and email');
      return;
    }
    const user = db.registerVendor({
      name: vendorManagerName || vendorBusinessName,
      email: vendorEmail,
      phone: vendorPhone || '+91 98000 11111',
      vendorType: vendorSector,
      vendorBusinessName: vendorBusinessName,
      vendorCity: vendorCity,
      vendorState: vendorState,
      vendorGSTIN: vendorGSTIN
    });
    setCurrentUser(user);
    setVendorMode('workspace');
    onShowToast(`Partner Account Registered! You can now upload your venue & service details.`);
  };

  const handleQuickDemoLogin = (demoKey: string) => {
    const user = db.loginAsDemoRole(demoKey);
    setCurrentUser(user);
    if (user.role === 'vendor') {
      setVendorSector(user.vendorType || 'hall');
      setVendorMode('workspace');
    }
    onShowToast(`Switched profile to: ${user.name} (${user.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(db.getCurrentUser());
    onShowToast('Logged out of session');
  };

  // --- ADMIN APPROVAL ACTIONS ---
  const handleApproveListing = (category: 'hall' | 'caterer' | 'photographer' | 'decor', itemId: string, itemTitle: string) => {
    const notes = adminFeedbackNotes[itemId] || 'Approved by Master Verification Council. Verified GSTIN & Venue Compliance.';
    const success = db.approveVendorListing(category, itemId, notes);
    if (success) {
      onShowToast(`✅ Approved & Published "${itemTitle}" live on the Pan-India portal!`);
      setAdminFeedbackNotes(prev => {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      });
    }
  };

  const handleOpenRejectModal = (category: 'hall' | 'caterer' | 'photographer' | 'decor', id: string, title: string) => {
    setRejectModalItem({ category, id, title });
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    const reason = rejectReason.trim() || 'Please update pricing package clarity and upload high-resolution venue images.';
    const success = db.rejectVendorListing(rejectModalItem.category, rejectModalItem.id, reason);
    if (success) {
      onShowToast(`⚠️ Listing "${rejectModalItem.title}" marked as Rejected. Feedback sent to vendor.`);
      setRejectModalItem(null);
      setRejectReason('');
    }
  };

  const handleDeleteListing = (category: 'hall' | 'caterer' | 'photographer' | 'decor', itemId: string, itemTitle: string) => {
    const success = db.deleteVendorListing(category, itemId);
    if (success) {
      onShowToast(`🗑️ Removed listing "${itemTitle}".`);
    }
  };

  // --- VENDOR UPLOAD ACTIONS (SUBMITTED FOR ADMIN APPROVAL) ---
  // 1. Submit Hall for Admin Approval
  const handlePublishHall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallName) {
      onShowToast('Please enter the hall name');
      return;
    }

    const newHall: MarriageHall = {
      id: `custom_hall_${Date.now()}`,
      name: hallName,
      tagline: hallTagline || `Premier Luxury Marriage Hall & Event Convention in ${hallCity}`,
      location: `${hallCity}, ${hallState}`,
      area: hallArea || `${hallCity} Prime Hub`,
      city: hallCity,
      state: hallState,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      distanceMiles: 2.5,
      distanceKm: 4.0,
      rating: 4.95,
      reviewCount: 1,
      capacityMin: Number(hallMinCap),
      capacityMax: Number(hallMaxCap),
      diningCapacity: Number(hallDiningCap),
      parkingCapacity: Number(hallParkingCap),
      acType: hallAcType,
      bookingStatus: 'Available',
      availableSlotsLeft: 6,
      basePrice: Number(hallBasePrice),
      pricePackages: [
        {
          id: `pkg_custom_1`,
          name: 'Standard Auspicious Slot',
          price: Number(hallBasePrice),
          duration: '6 Hours Muhurtham Access',
          features: ['Central AC Hall Access', 'Standard Stage Lighting', 'Bridal Suite Suite', 'Generator Backup']
        },
        {
          id: `pkg_custom_2`,
          name: 'Royal Full-Day Grand Banquet',
          price: Math.round(Number(hallBasePrice) * 1.6),
          duration: 'Full Day Access (6 AM - Midnight)',
          features: ['Exclusive Dual Hall & Lawn', 'VIP Valet Staffing', '2 Dedicated Green Rooms', 'Crystal Stage Lighting Truss'],
          isPopular: true
        }
      ],
      availableTimeWindows: [
        'Morning Muhurtham (6 AM - 2 PM)',
        'Evening Gala Reception (4 PM - 12 AM)',
        'Full Day Grand Access (6 AM - Midnight)'
      ],
      availableDays: ['All Days', 'Weekends & Auspicious Muhurtham Dates'],
      amenities: hallAmenities.split(',').map(s => s.trim()).filter(Boolean),
      suitableOccasions: hallSelectedOccasions,
      religiousTraditions: hallSelectedFaiths,
      imageUrl: hallImageUrl || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [hallImageUrl],
      description: `${hallName} is a verified luxury convention hall in ${hallCity}, ${hallState}. Equipped with ${hallAcType}, accommodating up to ${hallMaxCap} guests with ${hallDiningCap} seated dining capacity. Ideal for weddings, 1st birthdays, Vedic rites, and milestone celebrations.`,
      contactPhone: vendorPhone || '+91 98200 12345',
      contactEmail: vendorEmail || 'contact@venue.com',
      featured: true
    };

    db.submitVendorListing('hall', newHall, currentUser);
    onShowToast(`📋 "${newHall.name}" submitted! Awaiting Super Admin review & approval.`);
    setVendorActiveSubTab('my_listings');
  };

  // 2. Submit Caterer for Admin Approval
  const handlePublishCaterer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) {
      onShowToast('Please enter caterer business name');
      return;
    }

    const newCaterer: Caterer = {
      id: `custom_cat_${Date.now()}`,
      name: catName,
      tagline: catTagline || `Authentic Gourmet ${catDietaryType} Banqueting`,
      dietaryType: catDietaryType,
      cuisineSpecialties: catSpecialties.split(',').map(s => s.trim()).filter(Boolean),
      rating: 4.96,
      reviewCount: 1,
      costPerPlate: Number(catCostPerPlate),
      minimumPlates: Number(catMinPlates),
      location: `${catCity}, India`,
      area: catArea || `${catCity} Central Hub`,
      city: catCity,
      state: 'India',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      contactPhone: catPhone || vendorPhone || '+91 98110 56789',
      contactEmail: catEmail || vendorEmail || 'chef@kitchen.com',
      coordinatorName: catCoordinator || vendorManagerName || 'Executive Masterchef',
      bookingStatus: 'Available',
      availableDays: ['All Auspicious Dates', 'Weekdays & Weekends'],
      suitableOccasions: [
        '1st Year Birthday & Janmadin',
        'Upanayanam & Vedic Rites',
        'Royal Vivah & Receptions',
        'Traditional Banquets'
      ],
      religiousTraditions: [
        'Hindu Traditional & Satvik',
        'Jain Cuisine (Strict Root-Free)',
        'Multi-Faith Grand Banqueting'
      ],
      imageUrl: catImageUrl || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [catImageUrl],
      signatureDishes: catDishes,
      packages: [
        {
          name: 'Classic Festive Feast',
          pricePerPlate: Number(catCostPerPlate),
          description: '35-item traditional spread with welcome mocktails and live counters',
          inclusions: ['4 Starters', '2 Live Chaat Pavilions', '6 Main Entrees', '3 Desserts']
        },
        {
          name: 'Royal Shahi Banquet',
          pricePerPlate: Math.round(Number(catCostPerPlate) * 1.35),
          description: '50-item grand spread with silver service and premium dessert bar',
          inclusions: ['6 Artisanal Starters', '4 Live Counters', '8 Gourmet Mains', '5 Signature Desserts']
        }
      ],
      description: `${catName} is a premier catering kitchen in ${catCity} offering bespoke ${catDietaryType} spreads, live food pavilions, and white-glove dining service.`
    };

    db.submitVendorListing('caterer', newCaterer, currentUser);
    onShowToast(`📋 "${newCaterer.name}" menu submitted! Awaiting Super Admin review & approval.`);
    setVendorActiveSubTab('my_listings');
  };

  // Add Dish to Caterer menu
  const handleAddDish = () => {
    if (!newDishName) return;
    const newDish: MenuItem = {
      id: `dish_${Date.now()}`,
      name: newDishName,
      category: newDishCat,
      description: newDishDesc || 'Freshly prepared specialty dish with signature seasoning',
      isVeg: newDishIsVeg,
      dietaryTags: [newDishIsVeg ? 'Vegetarian' : 'Non-Veg', 'Signature']
    };
    setCatDishes(prev => [...prev, newDish]);
    setNewDishName('');
    setNewDishDesc('');
    onShowToast(`Added "${newDish.name}" to menu preview!`);
  };

  // 3. Submit Photographer for Admin Approval
  const handlePublishPhotographer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoName || !photoStudioName) {
      onShowToast('Please enter lead photographer and studio name');
      return;
    }

    const newPhoto: Photographer = {
      id: `custom_photo_${Date.now()}`,
      name: photoName,
      studioName: photoStudioName,
      tagline: photoTagline || `Award-Winning Cinematography & Milestone Photography in ${photoCity}`,
      rating: 4.98,
      reviewCount: 1,
      pricePerDay: Number(photoPricePerDay),
      location: `${photoCity}, ${photoState}`,
      area: `${photoCity} Metro`,
      city: photoCity,
      state: photoState,
      coordinates: { lat: 12.9716, lng: 77.5946 },
      travelRadiusMiles: Math.round(Number(photoTravelKm) / 1.6),
      specialties: photoSpecialties.split(',').map(s => s.trim()).filter(Boolean),
      suitableOccasions: [
        '1st Year Birthday & Kids Milestones',
        'Sacred Vedic Upanayanams',
        'Weddings & Cinematic Receptions',
        'Pre-Wedding & Post-Wedding'
      ],
      religiousTraditions: [
        'Vedic Traditions',
        'All Cultural & Faith Ceremonies'
      ],
      experienceYears: Number(photoExperience),
      imageUrl: photoImageUrl || 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
      portfolioImages: photoGallery,
      bookingStatus: 'Available',
      bookedDates: ['2026-10-15', '2026-11-04'],
      fastFillingDates: ['2026-09-18', '2026-11-20'],
      contactPhone: photoPhone || vendorPhone || '+91 98450 78901',
      contactEmail: photoEmail || vendorEmail || 'studio@cinema.com',
      deliverables: photoDeliverables.split(',').map(s => s.trim()).filter(Boolean),
      gearSpecs: photoGear.split(',').map(s => s.trim()).filter(Boolean),
      packages: [
        {
          name: 'Full Day Traditional & Candid Coverage',
          price: Number(photoPricePerDay),
          hours: '10 Hours On-Site',
          shooters: 2,
          deliverables: ['Full HD Wedding Film', '300 Edited Photos', 'Raw Footage']
        },
        {
          name: 'Master Diamond 4K Cinema + Dual Drone',
          price: Math.round(Number(photoPricePerDay) * 1.5),
          hours: 'Full Event Coverage',
          shooters: 4,
          deliverables: ['4K Cinematic Trailer', 'Licensed 4K Dual Drone', 'Leather Bound Album', '90-Sec Teaser']
        }
      ],
      description: `${photoStudioName} led by ${photoName} specializes in high-definition wedding storytelling, 1st birthday cinematography, and traditional rituals across ${photoCity} and Pan-India.`
    };

    db.submitVendorListing('photographer', newPhoto, currentUser);
    onShowToast(`📋 "${newPhoto.studioName}" portfolio submitted! Awaiting Super Admin review & approval.`);
    setVendorActiveSubTab('my_listings');
  };

  // Add Portfolio image to photographer
  const handleAddPhotoGalleryShot = () => {
    if (!newPhotoUrl || !newPhotoTitle) return;
    setPhotoGallery(prev => [
      ...prev,
      {
        url: newPhotoUrl,
        title: newPhotoTitle,
        caption: newPhotoCaption || 'High-res signature capture'
      }
    ]);
    setNewPhotoUrl('');
    setNewPhotoTitle('');
    setNewPhotoCaption('');
    onShowToast('Added photo to gallery showcase!');
  };

  // 4. Submit Decor for Admin Approval
  const handlePublishDecor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decorName || !decorStudio) {
      onShowToast('Please enter theme name and designer studio');
      return;
    }

    const newDecor: DecorationTheme = {
      id: `custom_decor_${Date.now()}`,
      name: decorName,
      designerStudio: decorStudio,
      themeCategory: decorCategory,
      likesCount: 24,
      userLiked: false,
      rating: 4.97,
      reviewCount: 1,
      price: Number(decorPrice),
      location: `${decorCity}, India`,
      area: `${decorCity} Grand Studios`,
      city: decorCity,
      state: 'India',
      coordinates: { lat: 26.9124, lng: 75.7873 },
      suitableOccasions: [
        '1st Year Birthday & Kids Wonderland',
        'Sacred Mandap & Upanayanam',
        'Grand Vivah & Reception Stage'
      ],
      religiousTraditions: [
        'Hindu Vedic Traditions',
        'Royal Palace Staging',
        'Multi-Faith Aesthetic'
      ],
      hallSuitability: {
        minCeilingHeightFt: Number(decorMinCeiling),
        minStageWidthFt: Number(decorMinStageWidth),
        indoorOutdoor: decorIndoorOutdoor,
        setupDurationHours: 6,
        idealGuestScale: '200 - 2,000 Guests'
      },
      paletteColors: decorColors.split(',').map(s => s.trim()).filter(Boolean),
      elementsIncluded: decorElements.split(',').map(s => s.trim()).filter(Boolean),
      imageUrl: decorImageUrl || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [decorImageUrl],
      bookingStatus: 'Available',
      availableDays: ['All Days'],
      contactPhone: vendorPhone || '+91 94140 34567',
      description: `${decorName} by ${decorStudio} is a bespoke architectural floral & lighting installation designed for luxury venues in ${decorCity}.`
    };

    db.submitVendorListing('decor', newDecor, currentUser);
    onShowToast(`📋 "${newDecor.name}" staging theme submitted! Awaiting Super Admin review & approval.`);
    setVendorActiveSubTab('my_listings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div 
        id="multi-role-portal-modal"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-4 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Banner */}
        <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 border-b border-[#2C2A28] relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8C6A24] to-[#C5A059] flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-[#C5A059] tracking-widest block">
                  Elysian Wedlock • Unified Platform Authentication
                </span>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Pan-India Celebration & Vendor Portal
                </h1>
              </div>
            </div>

            {/* Current Session status & Close button */}
            <div className="flex items-center gap-3">
              {currentUser.id !== 'guest' ? (
                <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#246A42] animate-pulse" />
                  <span className="text-stone-300">Signed in as:</span>
                  <strong className="text-[#C5A059]">{currentUser.name}</strong>
                  <span className="bg-[#C5A059]/20 text-[#C5A059] px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {currentUser.role}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 text-stone-400 hover:text-rose-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-xs text-stone-400">Guest Mode</span>
              )}

              <button
                id="close-multi-role-portal-btn"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Close Portal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 3 ROLE SWITCHER TABS */}
          <div className="mt-6 grid grid-cols-3 gap-1.5 sm:gap-2 bg-[#262422] p-1 sm:p-1.5 rounded-2xl border border-[#3A3734]">
            
            {/* Tab 1: Customer / Host */}
            <button
              id="role-tab-customer"
              onClick={() => setActiveTab('customer')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#8C6A24] text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">1. Customer / Host</span>
              <span className="sm:hidden text-[11px]">Customer</span>
            </button>

            {/* Tab 2: Vendor / Partner (Halls, Caterers, Photographers, Decor) */}
            <button
              id="role-tab-vendor"
              onClick={() => setActiveTab('vendor')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'vendor'
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#8C6A24] text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">2. Vendor Partner</span>
              <span className="sm:hidden text-[11px]">Vendor</span>
            </button>

            {/* Tab 3: Platform Super-Admin */}
            <button
              id="role-tab-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#8C6A24] text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">3. Super Admin</span>
              <span className="sm:hidden text-[11px]">Admin</span>
            </button>

          </div>

        </div>

        {/* Scrollable Portal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#FDFCFB]">
          
          {/* ========================================================= */}
          {/* PORTAL VIEW 1: CUSTOMER / HOST PORTAL                     */}
          {/* ========================================================= */}
          {activeTab === 'customer' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Quick Demo Login Bar for Customers */}
              <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#C5A059]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#8C6A24]">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span><strong>Quick Host Login:</strong> Sign in instantly with preset demo profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickDemoLogin('customer')}
                    className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-[#C5A059] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Priya & Michael Sharma (Host)
                  </button>
                </div>
              </div>

              {/* Login / Register Card */}
              <div className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4 mb-6">
                  <div>
                    <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A]">
                      {custMode === 'login' ? 'Host & Couple Login' : 'Create New Host Profile'}
                    </h3>
                    <p className="text-xs text-[#666666] mt-0.5">
                      Book marriage halls, gourmet caterers, 1st birthday photographers, and track escrow deposits.
                    </p>
                  </div>

                  <div className="flex bg-[#F9F7F2] p-1 rounded-xl border border-[#E5E0D5]">
                    <button
                      onClick={() => setCustMode('login')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        custMode === 'login' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setCustMode('signup')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                        custMode === 'signup' ? 'bg-[#1A1A1A] text-white shadow-xs' : 'text-[#666666]'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  {custMode === 'signup' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Host / Couple Full Name *</label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="text"
                              required
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              placeholder="e.g. Micheal & Priyadarshini"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Phone / WhatsApp Number *</label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="tel"
                              required
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              placeholder="+91 98200 45678"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Occasion / Milestone</label>
                          <select
                            value={custOccasion}
                            onChange={(e) => setCustOccasion(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none bg-white"
                          >
                            <option>Weddings & Royal Vivah</option>
                            <option>1st Year Birthday & Ayushya Homam</option>
                            <option>Sacred Vedic Upanayanam & Poonal</option>
                            <option>Muslim Nikah & Walima</option>
                            <option>Sikh Anand Karaj</option>
                            <option>Catholic Matrimony & Baptism</option>
                            <option>Milestone Anniversary / Shanti</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Target Event Date</label>
                          <input 
                            type="date"
                            value={custDate}
                            onChange={(e) => setCustDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Target Budget (₹ INR)</label>
                          <input 
                            type="number"
                            value={custBudget}
                            onChange={(e) => setCustBudget(e.target.value)}
                            placeholder="2500000"
                            className="w-full px-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="email"
                          required
                          value={custEmail}
                          onChange={(e) => setCustEmail(e.target.value)}
                          placeholder="host@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Password</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="password"
                          value={custPassword}
                          onChange={(e) => setCustPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1A1A1A] to-black text-[#C5A059] hover:text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 mt-4"
                  >
                    <span>{custMode === 'login' ? 'Sign In as Host' : 'Complete Host Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Host Benefits Grid */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs text-[#666666]">
                <div className="p-3 bg-white rounded-xl border border-[#E5E0D5]">
                  <CheckCircle2 className="w-4 h-4 text-[#246A42] mx-auto mb-1" />
                  <span className="font-bold text-[#1A1A1A] block">100% Escrow Protection</span>
                  <span className="text-[10px]">Secure advances held safely</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5E0D5]">
                  <Sparkles className="w-4 h-4 text-[#C5A059] mx-auto mb-1" />
                  <span className="font-bold text-[#1A1A1A] block">Direct Live Vendor Chat</span>
                  <span className="text-[10px]">Discuss custom menus & dates</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E5E0D5]">
                  <Calendar className="w-4 h-4 text-[#36427D] mx-auto mb-1" />
                  <span className="font-bold text-[#1A1A1A] block">Muhurtham Locking</span>
                  <span className="text-[10px]">Instant calendar availability</span>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* PORTAL VIEW 2: VENDOR / PARTNER REGISTRATION & UPLOADS     */}
          {/* ========================================================= */}
          {activeTab === 'vendor' && (
            <div className="space-y-6">
              
              {/* Partner Quick Demo Switcher */}
              <div className="p-4 bg-[#F7F3EB] rounded-2xl border border-[#C5A059]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#8C6A24]">
                  <Briefcase className="w-4 h-4 text-[#C5A059]" />
                  <span><strong>Demo Partner Logins:</strong> Switch directly to a verified vendor console</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleQuickDemoLogin('vendor_hall')}
                    className="px-2.5 py-1 bg-white hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    🏛️ Grand Elysian Hall
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('vendor_caterer')}
                    className="px-2.5 py-1 bg-white hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    🍲 Shahi Rasoi Caterers
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('vendor_photographer')}
                    className="px-2.5 py-1 bg-white hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    📷 Luminary Studios
                  </button>
                  <button
                    onClick={() => handleQuickDemoLogin('vendor_decor')}
                    className="px-2.5 py-1 bg-white hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    🌸 Kalakriti Decor
                  </button>
                </div>
              </div>

              {/* Vendor Workspace Sub Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D5] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setVendorActiveSubTab('upload')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      vendorActiveSubTab === 'upload'
                        ? 'bg-[#1A1A1A] text-[#C5A059] shadow-sm'
                        : 'bg-white text-[#666666] hover:text-[#1A1A1A] border border-[#E5E0D5]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Listing</span>
                  </button>

                  <button
                    onClick={() => setVendorActiveSubTab('my_listings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      vendorActiveSubTab === 'my_listings'
                        ? 'bg-[#1A1A1A] text-[#C5A059] shadow-sm'
                        : 'bg-white text-[#666666] hover:text-[#1A1A1A] border border-[#E5E0D5]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Submissions & Status</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C5A059] text-black font-bold">
                      {vendorSubmissions.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setVendorActiveSubTab('analytics')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      vendorActiveSubTab === 'analytics'
                        ? 'bg-[#1A1A1A] text-[#C5A059] shadow-sm'
                        : 'bg-white text-[#666666] hover:text-[#1A1A1A] border border-[#E5E0D5]'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>AI Vendor Analytics & Forecasting</span>
                  </button>

                  <button
                    onClick={() => setIsExportModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bulk Booking Export</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8C6A24] bg-[#F7F3EB] px-3 py-1.5 rounded-xl border border-[#C5A059]/30">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Admin Permission Protocol Enabled</span>
                </div>
              </div>

              {/* RENDER CONDITIONAL SUB-TAB VIEW */}
              {vendorActiveSubTab === 'analytics' ? (
                <VendorAnalyticsDashboard vendorName={currentUser.name} />
              ) : vendorActiveSubTab === 'my_listings' ? (
                <VendorSubmissionsView
                  submissions={vendorSubmissions}
                  currentUser={currentUser}
                  onNavigateToUpload={() => setVendorActiveSubTab('upload')}
                  onNavigateToListing={onNavigateToListing}
                  onDeleteListing={handleDeleteListing}
                  onClosePortal={onClose}
                />
              ) : (
                <>
                  {/* Sector Selection Cards (Halls, Caterers, Photographers, Decor) */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                        <span>Select Partner Sector to Register & Upload Listing:</span>
                      </h3>
                      <span className="text-xs text-[#8C6A24] font-semibold">Pan-India Marketplace</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      
                      {/* 1. Marriage Hall */}
                      <div
                        onClick={() => {
                          setVendorSector('hall');
                          setVendorMode('workspace');
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          vendorSector === 'hall'
                            ? 'bg-[#1A1A1A] text-white border-[#C5A059] shadow-md scale-[1.02]'
                            : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            vendorSector === 'hall' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#F7F3EB] text-[#8C6A24]'
                          }`}>
                            <Building2 className="w-5 h-5" />
                          </div>
                          {vendorSector === 'hall' && <Check className="w-4 h-4 text-[#C5A059]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Marriage Hall Owner</h4>
                          <p className={`text-[11px] mt-0.5 line-clamp-2 ${vendorSector === 'hall' ? 'text-stone-300' : 'text-[#666666]'}`}>
                            Upload location, capacity, dining hall, AC format & pricing tiers.
                          </p>
                        </div>
                      </div>

                      {/* 2. Caterer */}
                      <div
                        onClick={() => {
                          setVendorSector('caterer');
                          setVendorMode('workspace');
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          vendorSector === 'caterer'
                            ? 'bg-[#1A1A1A] text-white border-[#C5A059] shadow-md scale-[1.02]'
                            : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            vendorSector === 'caterer' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#EBF5EF] text-[#246A42]'
                          }`}>
                            <Utensils className="w-5 h-5" />
                          </div>
                          {vendorSector === 'caterer' && <Check className="w-4 h-4 text-[#C5A059]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Gourmet Caterer</h4>
                          <p className={`text-[11px] mt-0.5 line-clamp-2 ${vendorSector === 'caterer' ? 'text-stone-300' : 'text-[#666666]'}`}>
                            Upload Pure Veg / Satvik menus, live counters, per plate rates & tasting brochures.
                          </p>
                        </div>
                      </div>

                      {/* 3. Photographer */}
                      <div
                        onClick={() => {
                          setVendorSector('photographer');
                          setVendorMode('workspace');
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          vendorSector === 'photographer'
                            ? 'bg-[#1A1A1A] text-white border-[#C5A059] shadow-md scale-[1.02]'
                            : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            vendorSector === 'photographer' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#EDEFF8] text-[#36427D]'
                          }`}>
                            <Camera className="w-5 h-5" />
                          </div>
                          {vendorSector === 'photographer' && <Check className="w-4 h-4 text-[#C5A059]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Photographer / Cinema</h4>
                          <p className={`text-[11px] mt-0.5 line-clamp-2 ${vendorSector === 'photographer' ? 'text-stone-300' : 'text-[#666666]'}`}>
                            Upload portfolio galleries, drone specs, per day pricing & live calendar dates.
                          </p>
                        </div>
                      </div>

                      {/* 4. Decor */}
                      <div
                        onClick={() => {
                          setVendorSector('decor');
                          setVendorMode('workspace');
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          vendorSector === 'decor'
                            ? 'bg-[#1A1A1A] text-white border-[#C5A059] shadow-md scale-[1.02]'
                            : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            vendorSector === 'decor' ? 'bg-[#C5A059]/20 text-[#C5A059]' : 'bg-[#FDF0F0] text-[#9E3636]'
                          }`}>
                            <Palette className="w-5 h-5" />
                          </div>
                          {vendorSector === 'decor' && <Check className="w-4 h-4 text-[#C5A059]" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">Decor & Mandap Team</h4>
                          <p className={`text-[11px] mt-0.5 line-clamp-2 ${vendorSector === 'decor' ? 'text-stone-300' : 'text-[#666666]'}`}>
                            Upload mandap themes, 1st birthday backdrops, color palettes & staging specs.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

              {/* DYNAMIC VENDOR UPLOAD WORKSPACE ACCORDING TO SELECTED SECTOR */}
              <div className="bg-white rounded-3xl border border-[#E5E0D5] p-6 sm:p-8 shadow-xs">
                
                {/* ------------------------------------------------------------- */}
                {/* 1. MARRIAGE HALL UPLOAD WORKSPACE                             */}
                {/* ------------------------------------------------------------- */}
                {vendorSector === 'hall' && (
                  <form onSubmit={handlePublishHall} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                      <div>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#8C6A24]" />
                          <span>Publish Marriage Hall / Mandapam Profile & Location</span>
                        </h3>
                        <p className="text-xs text-[#666666] mt-0.5">
                          Specify Pan-India address, capacity numbers, pricing packages, AC setup, and auspicious occasion suitability.
                        </p>
                      </div>
                      <span className="text-[11px] bg-[#F7F3EB] text-[#8C6A24] px-3 py-1 rounded-full border border-[#C5A059]/30 font-bold">
                        Sector: Halls & Venues
                      </span>
                    </div>

                    {/* Basic Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Marriage Hall / Convention Name *</label>
                        <input 
                          type="text"
                          required
                          value={hallName}
                          onChange={(e) => setHallName(e.target.value)}
                          placeholder="e.g. The Maharaja Royal Palace & Convention"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Tagline / Highlight</label>
                        <input 
                          type="text"
                          value={hallTagline}
                          onChange={(e) => setHallTagline(e.target.value)}
                          placeholder="e.g. Crystal Chandelier Staging & 1,500 Seater Dining Lawn"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>
                    </div>

                    {/* Location & Pan-India City Selection */}
                    <div className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                        <MapPin className="w-4 h-4 text-[#C5A059]" />
                        <span>Pan-India Location & Address Details (A to Z Hubs):</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#666666] mb-1">Select City (Pan-India) *</label>
                          <select
                            value={hallCity}
                            onChange={(e) => setHallCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white focus:ring-1 focus:ring-[#C5A059] outline-none"
                          >
                            {PAN_INDIA_CITIES.map((c) => (
                              <option key={c.city} value={c.city}>{c.city} ({c.state})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#666666] mb-1">Area / Sector / Beach Road *</label>
                          <input 
                            type="text"
                            required
                            value={hallArea}
                            onChange={(e) => setHallArea(e.target.value)}
                            placeholder="e.g. ECR Beach Road / Bandra West"
                            className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white focus:ring-1 focus:ring-[#C5A059] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#666666] mb-1">State</label>
                          <input 
                            type="text"
                            value={hallState}
                            onChange={(e) => setHallState(e.target.value)}
                            placeholder="Maharashtra / Tamil Nadu"
                            className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white focus:ring-1 focus:ring-[#C5A059] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Capacities & AC Format */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Guest Capacity (Max) *</label>
                        <input 
                          type="number"
                          required
                          value={hallMaxCap}
                          onChange={(e) => setHallMaxCap(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Dining Capacity (Seated) *</label>
                        <input 
                          type="number"
                          required
                          value={hallDiningCap}
                          onChange={(e) => setHallDiningCap(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Valet Parking Slots *</label>
                        <input 
                          type="number"
                          required
                          value={hallParkingCap}
                          onChange={(e) => setHallParkingCap(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none focus:ring-1 focus:ring-[#C5A059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">AC Format *</label>
                        <select
                          value={hallAcType}
                          onChange={(e) => setHallAcType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white outline-none focus:ring-1 focus:ring-[#C5A059]"
                        >
                          <option>Centralized HVAC</option>
                          <option>Air Conditioned</option>
                          <option>Hybrid Open Air & AC</option>
                        </select>
                      </div>
                    </div>

                    {/* Pricing & Image URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Base Rental Price (₹ INR) *</label>
                        <input 
                          type="number"
                          required
                          value={hallBasePrice}
                          onChange={(e) => setHallBasePrice(Number(e.target.value))}
                          placeholder="250000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs font-mono font-bold focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">High-Res Venue Photo URL</label>
                        <input 
                          type="url"
                          value={hallImageUrl}
                          onChange={(e) => setHallImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>
                    </div>

                    {/* Amenities list */}
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Amenities Included (comma-separated)</label>
                      <input 
                        type="text"
                        value={hallAmenities}
                        onChange={(e) => setHallAmenities(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                      />
                    </div>

                    {/* Publish Hall Button */}
                    <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                      <div className="text-xs text-[#246A42] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Instant Pan-India Map & Search Integration</span>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Publish Marriage Hall Listing</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 2. CATERER UPLOAD WORKSPACE WITH DISH & MENU BUILDER          */}
                {/* ------------------------------------------------------------- */}
                {vendorSector === 'caterer' && (
                  <form onSubmit={handlePublishCaterer} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                      <div>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                          <Utensils className="w-5 h-5 text-[#246A42]" />
                          <span>Publish Caterer Profile & Interactive Signature Menu</span>
                        </h3>
                        <p className="text-xs text-[#666666] mt-0.5">
                          Add live chaat counters, Satvik / Pure Veg / Jain items, per plate pricing, and tasting courses.
                        </p>
                      </div>
                      <span className="text-[11px] bg-[#EBF5EF] text-[#246A42] px-3 py-1 rounded-full border border-[#246A42]/30 font-bold">
                        Sector: Caterers & Banquets
                      </span>
                    </div>

                    {/* Basic details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Catering Company / Kitchen Name *</label>
                        <input 
                          type="text"
                          required
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          placeholder="e.g. Royal Shahi Rasoi Gourmet Banquet"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs focus:ring-1 focus:ring-[#C5A059] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Dietary Specialization *</label>
                        <select
                          value={catDietaryType}
                          onChange={(e) => setCatDietaryType(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs bg-white focus:ring-1 focus:ring-[#C5A059] outline-none font-bold"
                        >
                          <option>Pure Veg</option>
                          <option>Non-Veg & Mixed</option>
                        </select>
                      </div>
                    </div>

                    {/* Rates & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Cost Per Plate (₹ INR) *</label>
                        <input 
                          type="number"
                          required
                          value={catCostPerPlate}
                          onChange={(e) => setCatCostPerPlate(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Min. Plates Required *</label>
                        <input 
                          type="number"
                          required
                          value={catMinPlates}
                          onChange={(e) => setCatMinPlates(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs font-mono outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">City Hub *</label>
                        <select
                          value={catCity}
                          onChange={(e) => setCatCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white outline-none"
                        >
                          {PAN_INDIA_CITIES.map(c => (
                            <option key={c.city} value={c.city}>{c.city}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Head Chef / Liaison Name *</label>
                        <input 
                          type="text"
                          required
                          value={catCoordinator}
                          onChange={(e) => setCatCoordinator(e.target.value)}
                          placeholder="e.g. Masterchef Anand Mehrotra"
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Cuisine specialties */}
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Cuisine Specialties (comma-separated)</label>
                      <input 
                        type="text"
                        value={catSpecialties}
                        onChange={(e) => setCatSpecialties(e.target.value)}
                        placeholder="Awadhi, South Indian Satvik, Live Chaat, Continental"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                      />
                    </div>

                    {/* INTERACTIVE MENU ITEM & COURSE BUILDER */}
                    <div className="p-4 bg-[#F7F3EB]/60 rounded-2xl border border-[#C5A059]/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#C5A059]" />
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            Interactive Menu Items & Signature Courses ({catDishes.length} Items Listed):
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8C6A24] font-semibold">Customers can view dishes in modal</span>
                      </div>

                      {/* Current dishes list */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {catDishes.map((dish, dIdx) => (
                          <div key={dish.id || dIdx} className="p-2.5 bg-white rounded-xl border border-[#E5E0D5] flex items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                <strong className="text-[#1A1A1A]">{dish.name}</strong>
                                <span className="text-[10px] bg-[#F7F3EB] text-[#8C6A24] px-1.5 py-0.5 rounded font-mono">
                                  {dish.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">{dish.description}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setCatDishes(prev => prev.filter((_, i) => i !== dIdx))}
                              className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                              title="Delete Dish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add new dish form row */}
                      <div className="pt-2 border-t border-[#E5E0D5] grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input 
                          type="text"
                          value={newDishName}
                          onChange={(e) => setNewDishName(e.target.value)}
                          placeholder="New Dish Name (e.g. Saffron Rasmalai)"
                          className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        />
                        <select
                          value={newDishCat}
                          onChange={(e) => setNewDishCat(e.target.value as any)}
                          className="px-2 py-2 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        >
                          <option>Welcome Drinks</option>
                          <option>Starters & Hors d'oeuvres</option>
                          <option>Live Counters & Chaat</option>
                          <option>Main Entrees</option>
                          <option>Artisanal Breads & Rice</option>
                          <option>Signature Desserts & Paan</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleAddDish}
                          className="px-3 py-2 bg-[#246A42] hover:bg-[#1b5333] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Menu</span>
                        </button>
                      </div>
                    </div>

                    {/* Publish Caterer Button */}
                    <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                      <span className="text-xs text-[#246A42] font-semibold">Includes Instant Menu Brochure & Per-Plate Calculator</span>
                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Publish Caterer & Menu</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 3. PHOTOGRAPHER UPLOAD WORKSPACE                              */}
                {/* ------------------------------------------------------------- */}
                {vendorSector === 'photographer' && (
                  <form onSubmit={handlePublishPhotographer} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                      <div>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                          <Camera className="w-5 h-5 text-[#36427D]" />
                          <span>Publish Photography Studio Portfolio & Availability</span>
                        </h3>
                        <p className="text-xs text-[#666666] mt-0.5">
                          Upload high-res portfolio shots, drone gear, per-day rates, and 1st birthday / wedding specialties.
                        </p>
                      </div>
                      <span className="text-[11px] bg-[#EDEFF8] text-[#36427D] px-3 py-1 rounded-full border border-[#36427D]/30 font-bold">
                        Sector: Cinematography & Studios
                      </span>
                    </div>

                    {/* Basic details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Studio / Brand Name *</label>
                        <input 
                          type="text"
                          required
                          value={photoStudioName}
                          onChange={(e) => setPhotoStudioName(e.target.value)}
                          placeholder="e.g. Luminary Cine Studios"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Lead Cinematographer / Artist Name *</label>
                        <input 
                          type="text"
                          required
                          value={photoName}
                          onChange={(e) => setPhotoName(e.target.value)}
                          placeholder="e.g. Arjun Verma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Rates, Experience, City */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Price Per Day (₹ INR) *</label>
                        <input 
                          type="number"
                          required
                          value={photoPricePerDay}
                          onChange={(e) => setPhotoPricePerDay(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Years of Experience *</label>
                        <input 
                          type="number"
                          required
                          value={photoExperience}
                          onChange={(e) => setPhotoExperience(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Base City *</label>
                        <select
                          value={photoCity}
                          onChange={(e) => setPhotoCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white outline-none"
                        >
                          {PAN_INDIA_CITIES.map(c => (
                            <option key={c.city} value={c.city}>{c.city}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Travel Radius (Km)</label>
                        <input 
                          type="number"
                          value={photoTravelKm}
                          onChange={(e) => setPhotoTravelKm(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* Specialties & Gear */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Specialties & Occasions</label>
                        <input 
                          type="text"
                          value={photoSpecialties}
                          onChange={(e) => setPhotoSpecialties(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Camera & Drone Gear Specs</label>
                        <input 
                          type="text"
                          value={photoGear}
                          onChange={(e) => setPhotoGear(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    {/* PORTFOLIO SHOTS MANAGER */}
                    <div className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-3">
                      <span className="text-xs font-bold text-[#1A1A1A] block">
                        Portfolio Gallery Shots Showcase ({photoGallery.length} Photos Added):
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {photoGallery.map((shot, sIdx) => (
                          <div key={sIdx} className="relative rounded-xl overflow-hidden border border-[#E5E0D5] group aspect-4/3">
                            <img src={shot.url} alt={shot.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[10px]">
                              <span className="font-bold truncate">{shot.title}</span>
                              <button
                                type="button"
                                onClick={() => setPhotoGallery(prev => prev.filter((_, i) => i !== sIdx))}
                                className="text-rose-300 hover:text-rose-500 self-end p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add photo shot row */}
                      <div className="pt-2 border-t border-[#E5E0D5] grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input 
                          type="url"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          placeholder="Photo Image URL"
                          className="px-3 py-2 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        />
                        <input 
                          type="text"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          placeholder="Shot Title (e.g. 1st Birthday Cake Smash)"
                          className="px-3 py-2 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoGalleryShot}
                          className="px-3 py-2 bg-[#36427D] hover:bg-[#283262] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Shot to Gallery</span>
                        </button>
                      </div>
                    </div>

                    {/* Publish Photographer Button */}
                    <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                      <span className="text-xs text-[#36427D] font-semibold">Includes Interactive Date Availability Calendar</span>
                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Publish Studio Portfolio</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ------------------------------------------------------------- */}
                {/* 4. DECOR TEAM UPLOAD WORKSPACE                                */}
                {/* ------------------------------------------------------------- */}
                {vendorSector === 'decor' && (
                  <form onSubmit={handlePublishDecor} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
                      <div>
                        <h3 className="font-serif-luxury text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                          <Palette className="w-5 h-5 text-[#9E3636]" />
                          <span>Publish Custom Mandap & Stage Decor Theme</span>
                        </h3>
                        <p className="text-xs text-[#666666] mt-0.5">
                          Upload 1st birthday wonderland backdrops, Vedic mandapams, color palettes, and stage specs.
                        </p>
                      </div>
                      <span className="text-[11px] bg-[#FDF0F0] text-[#9E3636] px-3 py-1 rounded-full border border-[#9E3636]/30 font-bold">
                        Sector: Floral & Mandap Decor
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Theme Title *</label>
                        <input 
                          type="text"
                          required
                          value={decorName}
                          onChange={(e) => setDecorName(e.target.value)}
                          placeholder="e.g. Royal Rajwada Palace Mandap"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Design Studio *</label>
                        <input 
                          type="text"
                          required
                          value={decorStudio}
                          onChange={(e) => setDecorStudio(e.target.value)}
                          placeholder="e.g. Kalakriti Luxury Events"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Theme Category *</label>
                        <select
                          value={decorCategory}
                          onChange={(e) => setDecorCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white outline-none font-bold"
                        >
                          <option>Royal Traditional</option>
                          <option>1st Birthday & Kids Wonderland</option>
                          <option>Sacred Homa & Traditional Mandap</option>
                          <option>Floral Grandeur</option>
                          <option>Nikah & Walima Drapes</option>
                          <option>Church Floral & Altar Luxe</option>
                          <option>Modern Minimalist</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">Package Price (₹ INR) *</label>
                        <input 
                          type="number"
                          required
                          value={decorPrice}
                          onChange={(e) => setDecorPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs font-mono font-bold outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#1A1A1A] mb-1">City Hub *</label>
                        <select
                          value={decorCity}
                          onChange={(e) => setDecorCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-white outline-none"
                        >
                          {PAN_INDIA_CITIES.map(c => (
                            <option key={c.city} value={c.city}>{c.city}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hall suitability specs */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5]">
                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] mb-1">Min. Ceiling Height (ft)</label>
                        <input 
                          type="number"
                          value={decorMinCeiling}
                          onChange={(e) => setDecorMinCeiling(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] mb-1">Min. Stage Width (ft)</label>
                        <input 
                          type="number"
                          value={decorMinStageWidth}
                          onChange={(e) => setDecorMinStageWidth(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#666666] mb-1">Format</label>
                        <select
                          value={decorIndoorOutdoor}
                          onChange={(e) => setDecorIndoorOutdoor(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5E0D5] text-xs bg-white"
                        >
                          <option>Indoor & Outdoor</option>
                          <option>Indoor Only</option>
                          <option>Lawn & Open Air</option>
                        </select>
                      </div>
                    </div>

                    {/* Palette & Image */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Palette Hex Colors (comma-separated)</label>
                        <input 
                          type="text"
                          value={decorColors}
                          onChange={(e) => setDecorColors(e.target.value)}
                          placeholder="#C5A059, #8C2424, #FAF5EA"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Staging Image URL</label>
                        <input 
                          type="url"
                          value={decorImageUrl}
                          onChange={(e) => setDecorImageUrl(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Elements Included (comma-separated)</label>
                      <input 
                        type="text"
                        value={decorElements}
                        onChange={(e) => setDecorElements(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D5] text-xs outline-none"
                      />
                    </div>

                    {/* Publish Decor Button */}
                    <div className="pt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                      <span className="text-xs text-[#9E3636] font-semibold">Includes Interactive Couple Likes & Rating System</span>
                      <button
                        type="submit"
                        className="px-6 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Publish Decor Theme</span>
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </>
          )}

            </div>
          )}

          {/* ========================================================= */}
          {/* PORTAL VIEW 3: SUPER ADMIN CONSOLE                        */}
          {/* ========================================================= */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              
              {/* Admin Sign In or Dashboard */}
              {currentUser.role !== 'admin' ? (
                <div className="max-w-xl mx-auto space-y-5">
                  
                  {/* Super Admin Login Card */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E0D5] shadow-md space-y-5">
                    
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center mx-auto shadow-md border border-[#C5A059]/30">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1A1A1A] text-[#C5A059] text-[10px] font-bold uppercase tracking-wider border border-[#C5A059]/30">
                        <span>Master Operations Portal</span>
                        <span>•</span>
                        <span className="text-emerald-400">Restricted Console</span>
                      </div>
                      <h3 className="font-serif-luxury text-2xl font-bold text-[#1A1A1A]">Super Admin Verification Console</h3>
                      <p className="text-xs text-[#666666] max-w-md mx-auto">
                        Access the master platform council to verify vendor submissions, audit escrow ledgers, and manage Pan-India operations.
                      </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Super Admin User ID / Email *</label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            required
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            placeholder="Enter administrator email..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E0D5] text-xs text-[#1A1A1A] focus:ring-1 focus:ring-[#C5A059] outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A1A1A] mb-1">Council Password *</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type={showAdminPass ? "text" : "password"}
                            required
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E5E0D5] text-xs text-[#1A1A1A] focus:ring-1 focus:ring-[#C5A059] outline-none bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPass(!showAdminPass)}
                            className="p-1 text-[#888888] hover:text-[#1A1A1A] absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            title={showAdminPass ? "Hide Password" : "Show Password"}
                          >
                            {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-[#C5A059] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign In as Super Admin (Council Console)</span>
                      </button>

                      {/* Quick Auto-Fill Demo Helper */}
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={handleFillAdminCredentials}
                          className="text-[#8C6A24] hover:text-[#1A1A1A] font-semibold text-[11px] underline cursor-pointer"
                        >
                          Auto-fill demo admin credentials
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickDemoLogin('admin')}
                          className="text-[#8C6A24] hover:text-[#1A1A1A] font-semibold text-[11px] underline cursor-pointer"
                        >
                          Instant bypass
                        </button>
                      </div>
                    </form>

                  </div>

                  {/* Security Notice Card */}
                  <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D5] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
                    <div className="text-xs text-[#666666]">
                      <strong className="text-[#1A1A1A] block font-bold">Confidential Access Controls</strong>
                      <span>All platform credentials and customer privacy data are protected. Verified administrators can download the credentials PDF from within the Super Admin Console.</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Admin Stats Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
                      <span className="text-[10px] uppercase font-bold text-[#888888]">Pending Approvals</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#8C6A24] mt-1 flex items-center gap-1.5">
                        <Clock className="w-5 h-5 text-[#C5A059]" />
                        <span>{pendingApprovals.length}</span>
                      </div>
                      <span className="text-[11px] text-[#8C6A24] font-semibold">Vendor Submissions</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
                      <span className="text-[10px] uppercase font-bold text-[#888888]">Active Bookings</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] mt-1">
                        {adminBookings.length} Reservations
                      </div>
                      <span className="text-[11px] text-[#C5A059] font-semibold">100% Escrow Active</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
                      <span className="text-[10px] uppercase font-bold text-[#888888]">Total Escrow Managed</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#246A42] mt-1 font-mono">
                        {formatINR(adminBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) * 83)}
                      </div>
                      <span className="text-[11px] text-[#666666]">Protected Advances</span>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
                      <span className="text-[10px] uppercase font-bold text-[#888888]">Platform Status</span>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#246A42] mt-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#246A42] animate-pulse" />
                        <span>Live Online</span>
                      </div>
                      <span className="text-[11px] text-[#888888]">Pan-India Node Synced</span>
                    </div>
                  </div>

                  {/* MASTER VENDOR VERIFICATION & PERMISSION QUEUE */}
                  <AdminApprovalsView
                    pendingListings={pendingApprovals}
                    allVendorListings={db.getAllVendorSubmissions()}
                    onApprove={handleApproveListing}
                    onOpenRejectModal={handleOpenRejectModal}
                    onDeleteListing={handleDeleteListing}
                    feedbackNotes={adminFeedbackNotes}
                    onUpdateFeedbackNote={(id, note) => setAdminFeedbackNotes(prev => ({ ...prev, [id]: note }))}
                  />

                  {/* System Bookings Ledger */}
                  <div className="bg-white rounded-2xl border border-[#E5E0D5] p-5 sm:p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif-luxury text-base font-bold text-[#1A1A1A]">Master Bookings & Escrow Registry</h4>
                        <p className="text-xs text-[#666666]">Review customer reservations, approve date locks, and verify advances.</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => setIsPdfModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-black text-[#C5A059] border border-[#C5A059]/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                          title="Download Confidential Access Keys (PDF)"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Download Credentials (PDF)</span>
                        </button>
                        <button
                          onClick={() => setIsExportModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Export Master Ledger</span>
                        </button>
                        <span className="text-xs font-bold text-[#8C6A24] bg-[#F7F3EB] px-3 py-1.5 rounded-lg border border-[#C5A059]/30">
                          {adminBookings.length} Records
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E5E0D5] text-[#888888] uppercase text-[10px]">
                            <th className="pb-3">Ref ID</th>
                            <th className="pb-3">Client & Occasion</th>
                            <th className="pb-3">Vendor / Service</th>
                            <th className="pb-3">Event Date</th>
                            <th className="pb-3">Total Value</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0EBE1]">
                          {adminBookings.map((b) => (
                            <tr key={b.id || b.referenceId} className="hover:bg-[#FDFCFB]">
                              <td className="py-3 font-mono font-bold text-[#8C6A24]">{b.referenceId}</td>
                              <td className="py-3">
                                <strong className="text-[#1A1A1A] block">{b.clientName}</strong>
                                <span className="text-[10px] text-[#666666]">{b.clientPhone}</span>
                              </td>
                              <td className="py-3 font-medium text-[#1A1A1A]">
                                {b.serviceTitle}
                                <span className="block text-[10px] text-[#888888]">{b.serviceSubtitle}</span>
                              </td>
                              <td className="py-3">{b.eventDate}</td>
                              <td className="py-3 font-mono font-bold text-[#246A42]">
                                {formatINR(b.totalAmount * 83)}
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  b.status === 'Confirmed' ? 'bg-[#EBF5EF] text-[#246A42]' : 'bg-[#F7F3EB] text-[#8C6A24]'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => {
                                    const nextStatus = b.status === 'Deposit Paid' ? 'Confirmed' : 'Deposit Paid';
                                    db.updateSystemBookingStatus(b.id, nextStatus as any);
                                    onShowToast(`Updated status of ${b.referenceId} to ${nextStatus}`);
                                  }}
                                  className="px-2.5 py-1 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                  Toggle Status
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Reject / Revision Request Modal Dialog */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-[#E5E0D5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#9E3636]">
                <AlertCircle className="w-5 h-5" />
                <h4 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">Request Listing Revision</h4>
              </div>
              <button 
                onClick={() => setRejectModalItem(null)}
                className="p-1 text-[#888888] hover:text-black rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#666666]">
              Please state why <strong>"{rejectModalItem.title}"</strong> needs revision so the vendor can update their details and re-submit for permission.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Please provide a higher resolution banquet photo and clarify whether air conditioning is included in the base tariff..."
              className="w-full p-3 rounded-xl border border-[#E5E0D5] text-xs outline-none focus:ring-1 focus:ring-[#9E3636] focus:border-[#9E3636]"
            />

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EBE1]">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-[#666666] hover:bg-[#F9F7F2] rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-[#9E3636] hover:bg-[#852828] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Send Revision Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Booking Ledger Export Modal */}
      <BulkExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        bookings={adminBookings}
        defaultRole={currentUser.role}
      />

      {/* Confidential Credentials PDF Export Modal (Restricted to Super Admin) */}
      <CredentialsPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onShowToast={onShowToast}
        currentUser={currentUser}
      />

    </div>
  );
};

