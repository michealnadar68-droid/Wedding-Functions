export type ServiceCategory = 'all' | 'halls' | 'caterers' | 'photographers' | 'decorations';

export type BookingStatus = 'Available' | 'Fast Filling' | 'Booked';

export type TimeWindow = 'Morning Muhurtham (6 AM - 2 PM)' | 'Afternoon Soiree (12 PM - 6 PM)' | 'Evening Gala Reception (4 PM - 12 AM)' | 'Full Day Grand Access (6 AM - Midnight)';

export interface PricePackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

export interface MarriageHall {
  id: string;
  name: string;
  tagline: string;
  location: string;
  area: string;
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  distanceMiles: number;
  distanceKm?: number;
  rating: number;
  reviewCount: number;
  capacityMin: number;
  capacityMax: number;
  bookingStatus: BookingStatus;
  availableSlotsLeft?: number;
  basePrice: number;
  pricePackages: PricePackage[];
  availableTimeWindows: TimeWindow[];
  availableDays: string[]; // e.g., ["Weekdays", "Weekends", "Selected Auspicious Dates"]
  amenities: string[];
  suitableOccasions?: string[]; // e.g., ["Weddings", "1st Year Birthday & Janmadin", "Upanayanam & Sacred Thread", "Griha Pravesh", "Seemantham", "Corporate Galas"]
  religiousTraditions?: string[]; // e.g., ["Hindu Traditional", "Muslim Nikah & Walima", "Christian Matrimony & Baptism", "Sikh Anand Karaj", "Jain Shubh Vivah", "Parsi Navjote"]
  imageUrl: string;
  galleryUrls: string[];
  parkingCapacity: number;
  diningCapacity: number;
  acType: 'Centralized HVAC' | 'Air Conditioned' | 'Hybrid Open Air & AC';
  description: string;
  contactPhone: string;
  contactEmail: string;
  featured?: boolean;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  submittedByVendorId?: string;
  submittedByVendorName?: string;
  submittedAt?: string;
  adminReviewedAt?: string;
  adminFeedback?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'Welcome Drinks' | 'Starters & Hors d\'oeuvres' | 'Live Counters & Chaat' | 'Main Entrees' | 'Artisanal Breads & Rice' | 'Signature Desserts & Paan';
  isVeg: boolean;
  dietaryTags: string[]; // e.g. ["Jain Available", "Halal", "Gluten-Free", "Chef's Signature", "Organic"]
  imageUrl?: string;
}

export interface Caterer {
  id: string;
  name: string;
  tagline: string;
  dietaryType: 'Pure Veg' | 'Non-Veg & Mixed';
  cuisineSpecialties: string[];
  rating: number;
  reviewCount: number;
  costPerPlate: number;
  minimumPlates: number;
  location: string;
  area: string;
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  contactPhone: string;
  contactEmail: string;
  contactPerson?: string;
  coordinatorName: string;
  bookingStatus: BookingStatus;
  availableDays: string[];
  suitableOccasions?: string[];
  religiousTraditions?: string[];
  imageUrl: string;
  galleryUrls: string[];
  signatureDishes: MenuItem[];
  packages: {
    name: string;
    pricePerPlate: number;
    description: string;
    inclusions: string[];
  }[];
  description: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  submittedByVendorId?: string;
  submittedByVendorName?: string;
  submittedAt?: string;
  adminReviewedAt?: string;
  adminFeedback?: string;
}

export interface Photographer {
  id: string;
  name: string;
  studioName: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  pricePerDay: number;
  location: string;
  area: string;
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  travelRadiusMiles: number;
  travelRadiusKm?: number;
  specialties: string[]; // e.g. ["1st Birthday & Kids", "Cinematic Drone", "Candid Moments", "Royal Portraits", "Traditional Rites"]
  suitableOccasions?: string[];
  religiousTraditions?: string[];
  experienceYears: number;
  imageUrl: string;
  portfolioImages: {
    url: string;
    title: string;
    caption: string;
  }[];
  bookingStatus: BookingStatus;
  bookedDates: string[]; // YYYY-MM-DD
  fastFillingDates: string[]; // YYYY-MM-DD
  contactPhone: string;
  contactEmail: string;
  deliverables: string[];
  gearSpecs: string[];
  packages: {
    name: string;
    price: number;
    hours: string;
    shooters: number;
    deliverables: string[];
  }[];
  description: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  submittedByVendorId?: string;
  submittedByVendorName?: string;
  submittedAt?: string;
  adminReviewedAt?: string;
  adminFeedback?: string;
}

export interface DecorationTheme {
  id: string;
  name: string;
  themeCategory: '1st Birthday & Kids Wonderland' | 'Sacred Homa & Traditional Mandap' | 'Royal Traditional' | 'Modern Minimalist' | 'Floral Grandeur' | 'Nikah & Walima Drapes' | 'Church Floral & Altar Luxe' | 'Celestial Glasshouse' | 'Bohemian Luxe' | 'Gatsby Art Deco';
  likesCount: number;
  userLiked?: boolean;
  rating: number;
  reviewCount: number;
  price: number;
  location: string;
  area: string;
  city?: string;
  state?: string;
  coordinates?: { lat: number; lng: number };
  suitableOccasions?: string[];
  religiousTraditions?: string[];
  hallSuitability: {
    minCeilingHeightFt: number;
    minStageWidthFt: number;
    indoorOutdoor: 'Indoor Only' | 'Indoor & Outdoor' | 'Lawn & Open Air';
    setupDurationHours: number;
    idealGuestScale: string;
  };
  paletteColors: string[];
  elementsIncluded: string[];
  imageUrl: string;
  galleryUrls: string[];
  bookingStatus: BookingStatus;
  availableDays: string[];
  description: string;
  designerStudio: string;
  contactPhone: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  submittedByVendorId?: string;
  submittedByVendorName?: string;
  submittedAt?: string;
  adminReviewedAt?: string;
  adminFeedback?: string;
}

export interface GlobalFilterState {
  searchQuery: string;
  category: ServiceCategory;
  location: string;
  occasion?: string;
  religiousTradition?: string;
  maxPrice: number;
  minRating: number;
  availabilityStatus: string;
  selectedDate: string;
  dietaryFilter?: 'all' | 'Pure Veg' | 'Non-Veg & Mixed';
  hallTopRatedOnly?: boolean;
  decorSortBy?: 'default' | 'top-rated' | 'most-liked';
}

export interface BookingDetails {
  id: string;
  serviceType: 'hall' | 'caterer' | 'photographer' | 'decor' | 'bundle';
  serviceTitle: string;
  serviceSubtitle: string;
  vendorId?: string;
  vendorName?: string;
  location?: string;
  itemPrice: number;
  packageTier?: string;
  packageName?: string;
  inclusions?: string[];
  eventDate: string;
  selectedDate?: string;
  timeWindow?: string;
  selectedTimeWindow?: string;
  guestCount?: number;
  estimatedTotal: number;
  estimatedCost?: number;
  depositAmount?: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  specialRequests?: string;
  paymentMode?: string;
  createdAt: string;
}

export interface BundleItem {
  type: 'hall' | 'caterer' | 'photographer' | 'decor';
  item: MarriageHall | Caterer | Photographer | DecorationTheme;
  selectedPackage?: string;
  estimatedCost: number;
}

// User & Authentication Types
export type AuthRoleType = 'customer' | 'admin' | 'vendor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: AuthRoleType;
  partnerName?: string;
  phone: string;
  weddingDate?: string;
  occasionType?: string;
  targetBudget?: number;
  avatarUrl?: string;
  location?: string;
  // Vendor specific fields if role === 'vendor'
  vendorType?: 'hall' | 'caterer' | 'photographer' | 'decor';
  vendorBusinessName?: string;
  vendorCity?: string;
  vendorState?: string;
  vendorApproved?: boolean;
  vendorGSTIN?: string;
  vendorManagedListingId?: string;
  createdAt: string;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  vendorId: string;
  vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
  vendorName: string;
  vendorSubtitle: string;
  vendorImage: string;
  rating: number;
  priceFormatted: string;
  location: string;
  savedAt: string;
  notes?: string;
}

export type BookingStatusType = 'Confirmed' | 'Deposit Paid' | 'Under Review' | 'Completed' | 'Cancelled';

export interface BookingRecord {
  id: string;
  referenceId: string;
  userId?: string;
  serviceType: 'hall' | 'caterer' | 'photographer' | 'decor' | 'bundle';
  vendorId?: string;
  vendorName?: string;
  serviceTitle: string;
  serviceSubtitle: string;
  packageTier?: string;
  eventDate: string;
  selectedDate?: string;
  timeWindow?: string;
  guestCount?: number;
  basePrice: number;
  itemPrice?: number;
  taxAmount: number;
  totalAmount: number;
  estimatedTotal?: number;
  depositPaid: number;
  status: BookingStatusType;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  location?: string;
  specialRequests?: string;
  createdAt: string;
  paymentId?: string;
  orderId?: string;
  paymentMethod?: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_qr' | 'escrow_advance';
  paymentStatus?: 'authorized' | 'captured' | 'failed' | 'refunded';
  paidAt?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isTestMode?: boolean;
}

export interface RazorpayPaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  bookingDetails?: Partial<BookingRecord>;
}

// Real-Time Chat & Vendor Messaging Types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: 'user' | 'vendor' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  actionType?: 'date_inquiry' | 'quote_request' | 'menu_request' | 'booking_prompt';
  attachment?: {
    type: 'quote' | 'brochure' | 'date_hold' | 'image';
    title: string;
    description?: string;
    price?: number;
  };
}

export interface Conversation {
  id: string;
  vendorId: string;
  vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
  vendorName: string;
  vendorSubtitle: string;
  vendorAvatar: string;
  vendorContactName: string;
  vendorRole: string; // e.g. "Venue General Manager", "Executive Masterchef", "Lead Cinematographer", "Senior Decor Architect"
  vendorOnline: boolean;
  vendorTyping?: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
  createdAt: string;
}

export interface VendorSubmissionItem {
  id: string;
  category: 'hall' | 'caterer' | 'photographer' | 'decor';
  title: string;
  location: string;
  price: number | string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  imageUrl?: string;
  description?: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  approvalNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  rawItem?: any;
}

