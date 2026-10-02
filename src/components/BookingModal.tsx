import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  Building2, 
  Utensils, 
  Camera, 
  Palette,
  FileText,
  Copy,
  Check,
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';
import { BookingDetails } from '../types';
import { formatINR } from '../utils/formatters';
import { RazorpayPaymentModal } from './RazorpayPaymentModal';
import { generateInvoicePdf } from '../utils/invoicePdfGenerator';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: Partial<BookingDetails> | null;
  onConfirmBooking: (confirmed: BookingDetails) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onConfirmBooking
}) => {
  if (!isOpen || !bookingData) return null;

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: bookingData.eventDate || '2026-09-18',
    timeWindow: bookingData.timeWindow || 'Full Day Grand Access (6 AM - Midnight)',
    guestCount: bookingData.guestCount || 350,
    specialRequests: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedBookingId, setGeneratedBookingId] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [paymentTypeChoice, setPaymentTypeChoice] = useState<'advance' | 'full'>('advance');
  const [razorpaySuccessData, setRazorpaySuccessData] = useState<{
    paymentId: string;
    orderId: string;
    method: string;
    amountPaid: number;
    couponCode?: string;
    discountAmount?: number;
  } | null>(null);

  const basePrice = bookingData.itemPrice || 5000;
  const taxAmount = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + taxAmount;
  const depositRequired = Math.round(totalAmount * 0.20);
  const currentPayableAmount = paymentTypeChoice === 'advance' ? depositRequired : totalAmount;

  const handleOpenRazorpay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.clientPhone || !formData.clientEmail) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }
    setIsRazorpayOpen(true);
  };

  const handlePaymentCompleted = (paymentInfo: {
    paymentId: string;
    orderId: string;
    method: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_qr' | 'razorpay_wallet' | 'pay_at_venue';
    amountPaid: number;
    couponCode?: string;
    discountAmount?: number;
  }) => {
    const newId = `WED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedBookingId(newId);
    setRazorpaySuccessData(paymentInfo);
    setIsRazorpayOpen(false);
    setIsSubmitted(true);

    const completedBooking: BookingDetails & any = {
      id: newId,
      serviceType: bookingData.serviceType || 'hall',
      serviceTitle: bookingData.serviceTitle || 'Wedding Booking',
      serviceSubtitle: bookingData.serviceSubtitle || '',
      itemPrice: basePrice,
      packageTier: bookingData.packageTier,
      eventDate: formData.eventDate,
      timeWindow: formData.timeWindow,
      guestCount: formData.guestCount,
      estimatedTotal: totalAmount - (paymentInfo.discountAmount || 0),
      depositPaid: paymentInfo.amountPaid,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      specialRequests: formData.specialRequests,
      createdAt: new Date().toISOString(),
      paymentId: paymentInfo.paymentId,
      orderId: paymentInfo.orderId,
      paymentMethod: paymentInfo.method,
      couponCode: paymentInfo.couponCode,
      discountAmount: paymentInfo.discountAmount || 0,
      paymentStatus: 'captured',
      paidAt: new Date().toISOString()
    };

    onConfirmBooking(completedBooking);
  };

  const handleDownloadInvoice = () => {
    const discountVal = razorpaySuccessData?.discountAmount || 0;
    const finalTotal = totalAmount - discountVal;
    const paidVal = razorpaySuccessData ? razorpaySuccessData.amountPaid : currentPayableAmount;
    const remaining = Math.max(0, finalTotal - paidVal);

    generateInvoicePdf({
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      orderId: razorpaySuccessData?.orderId || `order_${generatedBookingId}`,
      paymentId: razorpaySuccessData?.paymentId || `pay_${generatedBookingId}`,
      paymentMethod: razorpaySuccessData?.method ? razorpaySuccessData.method.toUpperCase() : 'RAZORPAY SECURE',
      paymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      clientName: formData.clientName || 'Valued Couple',
      clientEmail: formData.clientEmail || 'client@elysianwedlock.com',
      clientPhone: formData.clientPhone || '+91 98200 12345',
      serviceTitle: bookingData.serviceTitle || 'Wedding Celebration Booking',
      serviceType: bookingData.serviceType || 'hall',
      serviceSubtitle: bookingData.serviceSubtitle || bookingData.packageTier,
      eventDate: formData.eventDate,
      timeWindow: formData.timeWindow,
      guestCount: formData.guestCount,
      baseAmount: basePrice,
      taxAmount: taxAmount,
      discountAmount: discountVal,
      couponCode: razorpaySuccessData?.couponCode,
      totalAmount: finalTotal,
      amountPaid: paidVal,
      remainingBalance: remaining,
      paymentType: paymentTypeChoice === 'advance' ? 'advance_deposit' : 'full_payment'
    });
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(generatedBookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const getServiceIcon = () => {
    switch (bookingData.serviceType) {
      case 'hall': return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'caterer': return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'photographer': return <Camera className="w-5 h-5 text-indigo-600" />;
      case 'decor': return <Palette className="w-5 h-5 text-rose-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="booking-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] text-white p-5 sm:p-6 flex items-center justify-between border-b border-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
              {getServiceIcon()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                Official Booking & Date Reservation
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight truncate max-w-md">
                {bookingData.serviceTitle}
              </h3>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <form onSubmit={handleOpenRazorpay} className="p-6 sm:p-8 space-y-6">
            
            {/* Selected Service Summary Banner */}
            <div className="p-4 bg-[#F7F3EB] rounded-xl border border-[#C5A059]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#1A1A1A] block">
                  {bookingData.serviceSubtitle || bookingData.packageTier || 'Standard Package'}
                </span>
                <span className="text-[11px] text-[#666666]">
                  Escrow Protected • 100% Date Guarantee
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#888888] uppercase font-semibold block">Base Quotation</span>
                <span className="text-xl font-extrabold text-[#1A1A1A] font-mono">
                  {formatINR(basePrice)}
                </span>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Event Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  Target Wedding / Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              {/* Time Window */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                  Auspicious Time Slot
                </label>
                <select
                  value={formData.timeWindow}
                  onChange={(e) => setFormData({ ...formData, timeWindow: e.target.value })}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                >
                  <option value="Morning Muhurtham (6 AM - 2 PM)">Morning Muhurtham (6 AM - 2 PM)</option>
                  <option value="Afternoon Soiree (12 PM - 6 PM)">Afternoon Soiree (12 PM - 6 PM)</option>
                  <option value="Evening Gala Reception (4 PM - 12 AM)">Evening Gala Reception (4 PM - 12 AM)</option>
                  <option value="Full Day Grand Access (6 AM - Midnight)">Full Day Grand Access (6 AM - Midnight)</option>
                </select>
              </div>

              {/* Guest Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                  Estimated Guest Count
                </label>
                <input
                  type="number"
                  min="50"
                  max="3000"
                  step="25"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              {/* Package Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  Selected Package Tier
                </label>
                <input
                  type="text"
                  readOnly
                  value={bookingData.packageTier || 'Premium Tier'}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#666666] cursor-not-allowed"
                />
              </div>

            </div>

            {/* Couple / Primary Contact Information */}
            <div className="space-y-3 pt-3 border-t border-[#F0EBE1]">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                Primary Contact Details (Bride / Groom / Planner)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#888888]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Michael & Priya Sharma"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#888888]" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#666666] flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#888888]" /> Email Address (For Instant Confirmation Receipt) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#666666]">
                  Special Notes or Ritual Preferences (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Jain food counters required, bride entry drone filming, 2 dressing rooms..."
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                  className="w-full bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#1A1A1A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] space-y-3 text-xs">
              <div className="flex justify-between text-[#666666]">
                <span>Base Service Package</span>
                <span className="font-mono">{formatINR(basePrice)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>GST & Coordination Charges (5%)</span>
                <span className="font-mono">{formatINR(taxAmount)}</span>
              </div>
              <div className="pt-2 border-t border-[#E5E0D5] flex justify-between font-bold text-sm text-[#1A1A1A]">
                <span>Total Estimated Value</span>
                <span className="font-mono text-[#246A42]">{formatINR(totalAmount)}</span>
              </div>

              {/* Payment Type Toggle */}
              <div className="pt-2 border-t border-[#E5E0D5] space-y-2">
                <span className="text-[11px] font-bold text-[#1A1A1A] block">Choose Razorpay Payment Structure:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentTypeChoice('advance')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentTypeChoice === 'advance'
                        ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                        : 'bg-white text-[#666666] border-[#E5E0D5] hover:border-[#C5A059]'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold text-[#C5A059]">Recommended</span>
                    <span className="block text-xs font-bold text-white">20% Escrow Hold</span>
                    <span className="block font-mono text-[11px] mt-0.5">{formatINR(depositRequired)}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentTypeChoice('full')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentTypeChoice === 'full'
                        ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                        : 'bg-white text-[#666666] border-[#E5E0D5] hover:border-[#C5A059]'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-bold text-emerald-400">Complete</span>
                    <span className="block text-xs font-bold text-white">100% Full Payment</span>
                    <span className="block font-mono text-[11px] mt-0.5">{formatINR(totalAmount)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E5E0D5] text-[#666666] text-xs font-bold hover:bg-[#F9F7F2] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-booking-btn"
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Pay {formatINR(currentPayableAmount)} via Razorpay Gateway</span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </button>
            </div>

          </form>
        ) : (
          /* Confirmation State */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#246A42]/15 text-[#246A42] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#246A42]/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-[#246A42]/15 text-[#246A42] rounded-full text-xs font-bold">
                Date Lock & Razorpay Payment Confirmed
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Congratulations, {formData.clientName}!
              </h3>
              <p className="text-[#666666] text-xs sm:text-sm max-w-md mx-auto">
                Your wedding reservation request for <strong>{bookingData.serviceTitle}</strong> has been secured with verified Razorpay Escrow for <strong>{formData.eventDate}</strong>.
              </p>
            </div>

            {/* Booking Reference & Razorpay Payment ID */}
            <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-[#888888] block">Booking Reference ID</span>
                  <span className="text-base font-bold font-mono text-[#1A1A1A]">{generatedBookingId}</span>
                </div>
                <button
                  onClick={handleCopyBookingId}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] text-xs font-semibold text-[#1A1A1A] cursor-pointer shadow-2xs"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-[#246A42]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {razorpaySuccessData && (
                <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-left text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#8C6A24] block">Razorpay Transaction ID</span>
                    <span className="font-mono font-bold text-[#1A1A1A]">{razorpaySuccessData.paymentId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Paid ₹{razorpaySuccessData.amountPaid.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Summary Details */}
            <div className="p-4 bg-[#F7F3EB] rounded-xl border border-[#C5A059]/40 max-w-md mx-auto text-left text-xs space-y-1.5 text-[#1A1A1A]">
              <div className="flex justify-between">
                <span className="text-[#666666]">Service:</span>
                <span className="font-bold">{bookingData.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Event Date:</span>
                <span className="font-bold">{formData.eventDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Time Window:</span>
                <span>{formData.timeWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Guest Count:</span>
                <span>{formData.guestCount} Guests</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#C5A059]/30 font-bold text-[#1A1A1A]">
                <span>Estimated Total:</span>
                <span className="font-mono text-[#246A42]">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Print Receipt, PDF Download & Close Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Download Tax Invoice (PDF)</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-[#E5E0D5] bg-white hover:bg-[#F9F7F2] text-[#1A1A1A] text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#666666]" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Razorpay Payment Gateway Modal */}
      <RazorpayPaymentModal
        isOpen={isRazorpayOpen}
        onClose={() => setIsRazorpayOpen(false)}
        bookingDetails={{
          serviceTitle: bookingData.serviceTitle,
          serviceSubtitle: bookingData.serviceSubtitle || bookingData.packageTier,
          serviceType: bookingData.serviceType,
          eventDate: formData.eventDate,
          timeWindow: formData.timeWindow,
          guestCount: formData.guestCount,
          basePrice: basePrice,
          taxAmount: taxAmount,
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone
        }}
        payableAmount={currentPayableAmount}
        paymentType={paymentTypeChoice === 'advance' ? 'advance_deposit' : 'full_payment'}
        onPaymentSuccess={handlePaymentCompleted}
      />
    </div>
  );
};
