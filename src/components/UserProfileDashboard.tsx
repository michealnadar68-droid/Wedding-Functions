import React, { useState, useEffect } from 'react';
import { 
  X, User, Heart, Calendar, DollarSign, CheckCircle2, 
  MessageSquare, Trash2, Printer, ArrowRight,
  ShieldCheck, Sparkles, Building2, Utensils, Camera, Palette, ExternalLink,
  FileDown, Download
} from 'lucide-react';
import { db } from '../services/databaseService';
import { UserProfile, FavoriteItem, BookingRecord, Conversation } from '../types';
import { formatINR } from '../utils/formatters';
import { generateGoogleCalendarUrl, downloadIcsFile, bookingToCalendarEvent } from '../utils/calendarSync';
import { generateInvoicePdf } from '../utils/invoicePdfGenerator';

interface UserProfileDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'overview' | 'favorites' | 'bookings' | 'messages' | 'settings';
  onOpenChatWithVendor?: (vendor: {
    vendorId: string;
    vendorType: 'hall' | 'caterer' | 'photographer' | 'decor';
    vendorName: string;
    vendorSubtitle: string;
    vendorAvatar: string;
  }) => void;
  onBookVendorDirect?: (item: FavoriteItem) => void;
  onBookFavoriteVendor?: (item: FavoriteItem) => void;
  onBookFavorite?: (item: FavoriteItem) => void;
  onNavigateToSector?: (category: 'all' | 'halls' | 'caterers' | 'photographers' | 'decorations') => void;
  onOpenBudgetPlanner?: () => void;
  onOpenSmartCalendar?: () => void;
  onOpenCalendarSync?: () => void;
  onOpenBulkExport?: () => void;
}

export const UserProfileDashboard: React.FC<UserProfileDashboardProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
  onOpenChatWithVendor,
  onBookVendorDirect,
  onBookFavoriteVendor,
  onBookFavorite,
  onNavigateToSector,
  onOpenBudgetPlanner,
  onOpenSmartCalendar,
  onOpenCalendarSync,
  onOpenBulkExport
}) => {
  const triggerCalendar = onOpenCalendarSync || onOpenSmartCalendar;
  const [user, setUser] = useState<UserProfile>(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'bookings' | 'messages' | 'settings'>(initialTab);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [favCategoryFilter, setFavCategoryFilter] = useState<'all' | 'hall' | 'caterer' | 'photographer' | 'decor'>('all');
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<BookingRecord | null>(null);

  // Settings form state
  const [editName, setEditName] = useState('');
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editWeddingDate, setEditWeddingDate] = useState('');
  const [editTargetBudget, setEditTargetBudget] = useState(2500000);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const loadData = () => {
    const currentUser = db.getCurrentUser();
    setUser(currentUser);
    setFavorites(db.getFavorites(currentUser.id));
    setBookings(db.getBookings(currentUser.id));
    setConversations(db.getConversations());

    setEditName(currentUser.name);
    setEditPartnerName(currentUser.partnerName || '');
    setEditPhone(currentUser.phone);
    setEditEmail(currentUser.email);
    setEditWeddingDate(currentUser.weddingDate || '2026-11-18');
    setEditTargetBudget(currentUser.targetBudget || 2500000);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleDbUpdate = () => {
      loadData();
    };
    window.addEventListener('elysian_db_update', handleDbUpdate);
    return () => window.removeEventListener('elysian_db_update', handleDbUpdate);
  }, []);

  if (!isOpen) return null;

  // Calculate budget statistics
  const totalBookedAmount = bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.totalAmount : 0), 0);
  const totalDepositsPaid = bookings.reduce((sum, b) => sum + (b.status !== 'Cancelled' ? b.depositPaid : 0), 0);
  const targetBudget = user.targetBudget || 2500000;
  const budgetPercentage = Math.min(Math.round((totalBookedAmount / targetBudget) * 100), 100);

  // Calculate Days Remaining
  const calculateDaysRemaining = () => {
    if (!user.weddingDate) return null;
    const target = new Date(user.weddingDate).getTime();
    const today = new Date().getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  const handleRemoveFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.removeFavorite(id);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateUserProfile({
      name: editName,
      partnerName: editPartnerName,
      phone: editPhone,
      email: editEmail,
      weddingDate: editWeddingDate,
      targetBudget: editTargetBudget,
    });
    setUser(updated);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 2500);
  };

  const handlePrintReceipt = (booking: BookingRecord) => {
    setSelectedReceiptBooking(booking);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const filteredFavorites = favCategoryFilter === 'all'
    ? favorites
    : favorites.filter(f => f.vendorType === favCategoryFilter);

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'hall': return <Building2 className="w-4 h-4 text-[#C5A059]" />;
      case 'caterer': return <Utensils className="w-4 h-4 text-[#246A42]" />;
      case 'photographer': return <Camera className="w-4 h-4 text-[#2A4365]" />;
      case 'decor': return <Palette className="w-4 h-4 text-[#8C2424]" />;
      default: return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="user-dashboard-container"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dashboard Top Banner */}
        <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 relative shrink-0 border-b border-black/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C5A059] shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#C5A059] text-white flex items-center justify-center font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#246A42] border-2 border-[#1A1A1A] rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider px-2 py-0.5 rounded-md bg-white/10 border border-white/10">
                    VIP Client Portal
                  </span>
                  {daysRemaining !== null && (
                    <span className="text-[10px] font-bold text-stone-300">
                      • {daysRemaining} Days to Wedding
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {user.name}
                </h2>
                <p className="text-xs text-stone-300">
                  {user.email} {user.phone && `• ${user.phone}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Wedding Date</span>
                <strong className="text-sm text-[#C5A059] font-mono">
                  {user.weddingDate || 'Set Target Date'}
                </strong>
              </div>

              <button
                id="close-user-dashboard-btn"
                onClick={onClose}
                className="p-2.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer self-start sm:self-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Saved Wishlist</span>
              <strong className="text-lg text-white font-mono">{favorites.length} Vendors</strong>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Confirmed Bookings</span>
              <strong className="text-lg text-[#C5A059] font-mono">{bookings.length} Services</strong>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Committed Budget</span>
              <strong className="text-lg text-white font-mono">${totalBookedAmount.toLocaleString()}</strong>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Escrow Deposits Paid</span>
              <strong className="text-lg text-[#246A42] font-mono">${totalDepositsPaid.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="bg-[#F9F7F2] border-b border-[#E5E0D5] px-6 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            Planning Overview
          </button>

          <button
            id="tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#8C2424]" />
            <span>Saved Wishlist ({favorites.length})</span>
          </button>

          <button
            id="tab-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Booking History ({bookings.length})</span>
          </button>

          <button
            id="tab-messages"
            onClick={() => setActiveTab('messages')}
            className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#2A4365]" />
            <span>Vendor Chats ({conversations.length})</span>
          </button>

          <button
            id="tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#C5A059] text-[#1A1A1A]'
                : 'border-transparent text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Wedding Settings</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Budget Progress Meter */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#F9F7F2] border border-[#E5E0D5] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                      Wedding Budget Tracker & Allocation
                    </h3>
                    <p className="text-xs text-[#666666]">
                      Target Budget: <strong>{formatINR(targetBudget)}</strong> • Committed: <strong>{formatINR(totalBookedAmount)}</strong>
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#8C6A24] bg-[#F7F3EB] px-3 py-1 rounded-full border border-[#C5A059]/30 font-mono">
                    {budgetPercentage}% Budget Committed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#E5E0D5] h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#C5A059] h-full rounded-full transition-all duration-500"
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-[#666666]">
                  <span>₹0</span>
                  <span>Remaining Available: {formatINR(Math.max(targetBudget - totalBookedAmount, 0))}</span>
                  <span>{formatINR(targetBudget)}</span>
                </div>
              </div>

              {/* Quick AI & Planning Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {onOpenBudgetPlanner && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBudgetPlanner();
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <Sparkles className="w-5 h-5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] bg-[#C5A059] text-[#1A1A1A] font-bold px-1.5 py-0.5 rounded">AI Powered</span>
                    </div>
                    <strong className="text-xs text-[#1A1A1A] block mt-2">AI Budget Strategist</strong>
                    <p className="text-[11px] text-[#737373] mt-0.5">Dynamic 6-pillar cost allocator & savings optimizer</p>
                  </button>
                )}

                {onOpenSmartCalendar && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSmartCalendar();
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <Calendar className="w-5 h-5 text-[#C5A059] group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] bg-[#FAF8F5] text-[#8C6A24] font-bold px-1.5 py-0.5 rounded border border-[#E5E0D5]">iCal Sync</span>
                    </div>
                    <strong className="text-xs text-[#1A1A1A] block mt-2">Smart Calendar & Muhurtham</strong>
                    <p className="text-[11px] text-[#737373] mt-0.5">Google Cal sync, auspicious dates & slot protection</p>
                  </button>
                )}

                {onOpenBulkExport && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBulkExport();
                    }}
                    className="p-3.5 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-left transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <FileDown className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">CSV / PDF</span>
                    </div>
                    <strong className="text-xs text-[#1A1A1A] block mt-2">Bulk Export & Ledger</strong>
                    <p className="text-[11px] text-[#737373] mt-0.5">Download full booking accounts & audit statements</p>
                  </button>
                )}
              </div>

              {/* 4 Pillars Status Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  4-Sector Wedding Checklist Status
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { type: 'hall', label: 'Marriage Hall', icon: <Building2 className="w-4 h-4 text-[#C5A059]" /> },
                    { type: 'caterer', label: 'Banquet Catering', icon: <Utensils className="w-4 h-4 text-[#246A42]" /> },
                    { type: 'photographer', label: '4K Cinematography', icon: <Camera className="w-4 h-4 text-[#2A4365]" /> },
                    { type: 'decor', label: 'Mandap & Stage Decor', icon: <Palette className="w-4 h-4 text-[#8C2424]" /> },
                  ].map((sec) => {
                    const bookedItem = bookings.find(b => b.serviceType === sec.type || (b.serviceType === 'bundle' && b.serviceTitle.toLowerCase().includes(sec.type)));
                    return (
                      <div 
                        key={sec.type}
                        className={`p-4 rounded-xl border transition-all ${
                          bookedItem 
                            ? 'bg-[#F7F3EB] border-[#C5A059]/50 shadow-2xs' 
                            : 'bg-white border-[#E5E0D5]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="p-2 rounded-lg bg-white border border-[#E5E0D5]">
                            {sec.icon}
                          </div>
                          {bookedItem ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#246A42] bg-[#246A42]/10 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" /> Locked
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-[#888888] bg-[#F9F7F2] px-2 py-0.5 rounded-md">
                              Pending
                            </span>
                          )}
                        </div>
                        <strong className="text-xs text-[#1A1A1A] block">{sec.label}</strong>
                        <p className="text-[11px] text-[#666666] truncate mt-0.5">
                          {bookedItem ? bookedItem.serviceTitle : 'Not yet selected'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Bookings Quick Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Recent Date Reservations
                  </h4>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs font-bold text-[#8C6A24] hover:text-[#1A1A1A] cursor-pointer flex items-center gap-1"
                  >
                    <span>View All ({bookings.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-8 text-center bg-[#F9F7F2] rounded-xl border border-[#E5E0D5]">
                    <p className="text-xs text-[#666666]">No active reservations yet. Browse halls and caterers to lock your date!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 2).map((b) => (
                      <div key={b.id} className="p-4 rounded-xl bg-white border border-[#E5E0D5] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-[#F9F7F2] border border-[#E5E0D5]">
                            {getCategoryIcon(b.serviceType)}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-[#888888] block">Ref: {b.referenceId}</span>
                            <strong className="text-xs font-bold text-[#1A1A1A] block">{b.serviceTitle}</strong>
                            <span className="text-[11px] text-[#666666]">
                              {b.eventDate} • {b.guestCount ? `${b.guestCount} Guests` : b.packageTier}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#1A1A1A] block">
                            {formatINR(b.totalAmount)}
                          </span>
                          <span className="inline-block text-[10px] font-bold text-[#246A42] bg-[#246A42]/10 px-2 py-0.5 rounded-md mt-0.5">
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: FAVORITES / WISHLIST */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              
              {/* Category Filter Chips */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-[#F9F7F2] p-1.5 rounded-xl border border-[#E5E0D5]">
                  {(['all', 'hall', 'caterer', 'photographer', 'decor'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFavCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        favCategoryFilter === cat
                          ? 'bg-[#1A1A1A] text-white shadow-xs'
                          : 'text-[#666666] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {cat === 'all' ? 'All Saved' : cat === 'hall' ? 'Halls' : cat === 'caterer' ? 'Catering' : cat === 'photographer' ? 'Photo' : 'Decor'}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-[#666666]">
                  Showing <strong>{filteredFavorites.length}</strong> saved items
                </span>
              </div>

              {filteredFavorites.length === 0 ? (
                <div className="p-12 text-center bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-3">
                  <Heart className="w-12 h-12 text-[#CCCCCC] mx-auto" />
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A]">Your Wishlist is Empty</h4>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    Click the heart icon on any Marriage Hall, Gourmet Caterer, Photographer, or Mandap theme to save them to your private list.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (onNavigateToSector) onNavigateToSector('all');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A1A1A] text-[#C5A059] text-xs font-bold cursor-pointer"
                  >
                    <span>Explore All Vendors</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFavorites.map((fav) => (
                    <div
                      key={fav.id}
                      className="p-4 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] transition-all flex flex-col justify-between gap-4 shadow-2xs group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={fav.vendorImage}
                          alt={fav.vendorName}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#E5E0D5]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#8C6A24] bg-[#F7F3EB] px-2 py-0.5 rounded border border-[#C5A059]/30">
                              {fav.vendorType.toUpperCase()}
                            </span>
                            <button
                              onClick={(e) => handleRemoveFavorite(fav.id, e)}
                              className="text-[#888888] hover:text-[#8C2424] p-1 rounded-lg hover:bg-[#F9F7F2] transition-colors cursor-pointer"
                              title="Remove from favorites"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <strong className="text-sm font-bold text-[#1A1A1A] block truncate mt-1">
                            {fav.vendorName}
                          </strong>
                          <span className="text-xs text-[#666666] block truncate">
                            {fav.vendorSubtitle || fav.location}
                          </span>

                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="font-mono font-bold text-[#1A1A1A]">{fav.priceFormatted}</span>
                            <span className="text-[#888888]">•</span>
                            <span className="font-semibold text-[#8C6A24]">★ {fav.rating.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#F0EBE1]">
                        <button
                          onClick={() => {
                            onClose();
                            if (onOpenChatWithVendor) {
                              onOpenChatWithVendor({
                                vendorId: fav.vendorId,
                                vendorType: fav.vendorType,
                                vendorName: fav.vendorName,
                                vendorSubtitle: fav.vendorSubtitle,
                                vendorAvatar: fav.vendorImage,
                              });
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#F9F7F2] hover:bg-[#F7F3EB] text-[#1A1A1A] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#E5E0D5] cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#2A4365]" />
                          <span>Chat</span>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            if (onBookVendorDirect) {
                              onBookVendorDirect(fav);
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>Book</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKINGS & RECEIPTS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                    Confirmed Date Holds & Contracts
                  </h3>
                  <span className="text-xs text-[#666666]">
                    100% Escrow Deposit Protection
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {onOpenSmartCalendar && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSmartCalendar();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Smart Calendar</span>
                    </button>
                  )}

                  {onOpenBulkExport && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBulkExport();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bulk Export ({bookings.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-3">
                  <Calendar className="w-12 h-12 text-[#CCCCCC] mx-auto" />
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A]">No Bookings Recorded</h4>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    When you reserve a Marriage Hall, Caterer, or Photographer, your official booking reference will be listed here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E0D5] space-y-4 shadow-2xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE1]">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#1A1A1A]">
                              Ref #{booking.referenceId}
                            </span>
                            <span className="text-[10px] font-bold text-[#246A42] bg-[#246A42]/10 px-2 py-0.5 rounded">
                              {booking.status}
                            </span>
                          </div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] mt-0.5">
                            {booking.serviceTitle}
                          </h4>
                          <span className="text-xs text-[#666666]">
                            {booking.serviceSubtitle || booking.packageTier}
                          </span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-[#888888] uppercase block">Total Quotation</span>
                          <strong className="text-base font-mono font-extrabold text-[#1A1A1A]">
                            {formatINR(booking.totalAmount)}
                          </strong>
                          <span className="text-[11px] text-[#8C6A24] block font-semibold">
                            Deposit Paid: {formatINR(booking.depositPaid)}
                          </span>
                        </div>
                      </div>

                      {/* Event Details Matrix */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#F9F7F2] p-3.5 rounded-xl border border-[#E5E0D5]">
                        <div>
                          <span className="text-[#888888] block text-[10px]">Reserved Date:</span>
                          <strong className="text-[#1A1A1A]">{booking.eventDate}</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block text-[10px]">Auspicious Window:</span>
                          <strong className="text-[#1A1A1A] truncate block">{booking.timeWindow || 'Full Day'}</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block text-[10px]">Guest Scale:</span>
                          <strong className="text-[#1A1A1A]">{booking.guestCount ? `${booking.guestCount} Guests` : 'Standard'}</strong>
                        </div>
                        <div>
                          <span className="text-[#888888] block text-[10px]">Primary Contact:</span>
                          <strong className="text-[#1A1A1A] truncate block">{booking.clientName}</strong>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="text-xs text-[#666666] bg-[#F7F3EB] p-3 rounded-xl border border-[#C5A059]/30">
                          <strong className="text-[#1A1A1A]">Special Preferences: </strong>
                          {booking.specialRequests}
                        </div>
                      )}

                      {booking.paymentId && (
                        <div className="flex items-center justify-between text-xs bg-[#FAF8F5] px-3.5 py-2.5 rounded-xl border border-[#E5E0D5]">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[#666666]">Razorpay Escrow Ref:</span>
                            <span className="font-mono font-bold text-[#1A1A1A]">{booking.paymentId}</span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified Capture
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#246A42]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>100% Escrow Protected Reservation</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={generateGoogleCalendarUrl(bookingToCalendarEvent(booking))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Add booking reminder to Google Calendar"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Google Cal</span>
                          </a>

                          <button
                            onClick={() => downloadIcsFile(bookingToCalendarEvent(booking))}
                            className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] text-[#1A1A1A] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Download Apple / Outlook .ICS calendar event"
                          >
                            <Download className="w-3.5 h-3.5 text-[#888888]" />
                            <span>.ICS</span>
                          </button>

                          <button
                            onClick={() => {
                              const base = Math.round(booking.totalAmount * 0.95);
                              const tax = booking.totalAmount - base;
                              generateInvoicePdf({
                                invoiceNumber: `INV-${new Date(booking.createdAt).getFullYear()}-${booking.referenceId.replace(/[^0-9]/g, '').slice(-4) || '8291'}`,
                                orderId: booking.orderId || `order_${booking.id}`,
                                paymentId: booking.paymentId || `pay_${booking.referenceId}`,
                                paymentMethod: (booking.paymentMethod || 'RAZORPAY SECURE').toUpperCase(),
                                paymentDate: new Date(booking.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                                clientName: booking.clientName || user.name,
                                clientEmail: booking.clientEmail || user.email,
                                clientPhone: booking.clientPhone || user.phone,
                                serviceTitle: booking.serviceTitle,
                                serviceType: booking.serviceType,
                                serviceSubtitle: booking.serviceSubtitle,
                                eventDate: booking.eventDate,
                                timeWindow: booking.timeWindow,
                                guestCount: booking.guestCount,
                                baseAmount: base,
                                taxAmount: tax,
                                totalAmount: booking.totalAmount,
                                amountPaid: booking.depositPaid,
                                remainingBalance: Math.max(0, booking.totalAmount - booking.depositPaid),
                                paymentType: booking.depositPaid < booking.totalAmount ? 'advance_deposit' : 'full_payment'
                              });
                            }}
                            className="px-3 py-2 rounded-xl bg-linear-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            title="Download official Tax Invoice & Receipt PDF"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Invoice (PDF)</span>
                          </button>

                          <button
                            onClick={() => handlePrintReceipt(booking)}
                            className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] text-[#1A1A1A] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#666666]" />
                            <span>Print</span>
                          </button>

                          {booking.vendorId && (
                            <button
                              onClick={() => {
                                onClose();
                                if (onOpenChatWithVendor) {
                                  onOpenChatWithVendor({
                                    vendorId: booking.vendorId!,
                                    vendorType: booking.serviceType === 'bundle' ? 'hall' : booking.serviceType,
                                    vendorName: booking.serviceTitle,
                                    vendorSubtitle: booking.serviceSubtitle,
                                    vendorAvatar: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=150&q=80',
                                  });
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                              <span>Message</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONVERSATIONS */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A]">
                  Direct Vendor Messages
                </h3>
                <span className="text-xs text-[#666666]">
                  Real-time vendor response system
                </span>
              </div>

              {conversations.length === 0 ? (
                <div className="p-12 text-center bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-3">
                  <MessageSquare className="w-12 h-12 text-[#CCCCCC] mx-auto" />
                  <h4 className="font-serif text-base font-bold text-[#1A1A1A]">No Active Chat Threads</h4>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    Click "Chat with Vendor" on any hall, catering, or photography listing to speak directly with their concierge team.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        onClose();
                        if (onOpenChatWithVendor) {
                          onOpenChatWithVendor({
                            vendorId: conv.vendorId,
                            vendorType: conv.vendorType,
                            vendorName: conv.vendorName,
                            vendorSubtitle: conv.vendorSubtitle,
                            vendorAvatar: conv.vendorAvatar,
                          });
                        }
                      }}
                      className="p-4 rounded-xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] transition-all flex items-center justify-between gap-4 cursor-pointer shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <img
                            src={conv.vendorAvatar}
                            alt={conv.vendorName}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D5]"
                            referrerPolicy="no-referrer"
                          />
                          {conv.vendorOnline && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#246A42] border-2 border-white rounded-full" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-[#1A1A1A] truncate group-hover:text-[#8C6A24]">
                              {conv.vendorName}
                            </strong>
                            <span className="text-[10px] text-[#888888]">• {conv.vendorRole}</span>
                          </div>
                          <p className="text-xs text-[#666666] truncate mt-0.5">
                            {conv.lastMessage || 'Click to open conversation'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] text-[#888888]">{conv.lastMessageTime || 'Today'}</span>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 bg-[#8C2424] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                        <ExternalLink className="w-4 h-4 text-[#888888] group-hover:text-[#1A1A1A]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                  Wedding Profile & Planner Settings
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  Update your contact details and target wedding budget to tailor vendor recommendations.
                </p>
              </div>

              {saveSuccessMsg && (
                <div className="p-3 bg-[#246A42]/15 border border-[#246A42]/30 text-[#246A42] text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C5A059]" /> Primary Contact / Couple Names *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#C5A059]" /> Partner Name
                    </label>
                    <input
                      type="text"
                      value={editPartnerName}
                      onChange={(e) => setEditPartnerName(e.target.value)}
                      className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" /> Target Wedding Date
                    </label>
                    <input
                      type="date"
                      value={editWeddingDate}
                      onChange={(e) => setEditWeddingDate(e.target.value)}
                      className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A]">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1A1A1A]">Target Budget (₹)</label>
                    <input
                      type="number"
                      step="50000"
                      value={editTargetBudget}
                      onChange={(e) => setEditTargetBudget(Number(e.target.value))}
                      className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile & Budget Changes</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Hidden Print Form */}
        {selectedReceiptBooking && (
          <div className="hidden print:block fixed inset-0 bg-white p-8 text-black z-50">
            <h1 className="text-2xl font-bold font-serif">ELYSIAN WEDLOCK OFFICIAL BOOKING RECEIPT</h1>
            <p className="text-sm">Reference #{selectedReceiptBooking.referenceId}</p>
            <hr className="my-4" />
            <p>Service: {selectedReceiptBooking.serviceTitle}</p>
            <p>Date: {selectedReceiptBooking.eventDate}</p>
            <p>Client: {selectedReceiptBooking.clientName}</p>
            <p>Total Estimated: {formatINR(selectedReceiptBooking.totalAmount)}</p>
            <p>Deposit Paid: {formatINR(selectedReceiptBooking.depositPaid)} (Status: {selectedReceiptBooking.status})</p>
          </div>
        )}
      </div>
    </div>
  );
};
