import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building, 
  Smartphone, 
  Wallet,
  Coins,
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Loader2, 
  ArrowRight,
  Receipt,
  Sparkles,
  Info,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Clock,
  Printer,
  FileDown,
  RotateCcw,
  KeyRound,
  Shield,
  Percent
} from 'lucide-react';
import { BookingRecord } from '../types';
import { 
  loadRazorpayScript, 
  getRazorpayConfig, 
  createRazorpayOrder, 
  verifyRazorpayPayment 
} from '../services/razorpayService';
import { generateInvoicePdf } from '../utils/invoicePdfGenerator';

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: Partial<BookingRecord>;
  payableAmount: number;
  paymentType?: 'advance_deposit' | 'full_payment' | 'pay_at_venue';
  onPaymentSuccess: (paymentInfo: {
    paymentId: string;
    orderId: string;
    method: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_qr' | 'razorpay_wallet' | 'pay_at_venue';
    amountPaid: number;
    couponCode?: string;
    discountAmount?: number;
  }) => void;
}

type PaymentMethodType = 'upi' | 'qr' | 'card' | 'netbanking' | 'wallet' | 'venue_advance' | 'emi';

export const RazorpayPaymentModal: React.FC<RazorpayPaymentModalProps> = ({
  isOpen,
  onClose,
  bookingDetails,
  payableAmount,
  paymentType = 'advance_deposit',
  onPaymentSuccess
}) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethodType>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isOtpStep, setIsOtpStep] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(30);
  
  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Success state
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId: string;
    orderId: string;
    invoiceNumber: string;
    amount: number;
    discountAmount: number;
    timestamp: string;
    method: string;
  } | null>(null);

  // Form states
  const [upiId, setUpiId] = useState<string>('micheal.wedding@okhdfcbank');
  const [cardNumber, setCardNumber] = useState<string>('4532 8765 2341 9012');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('888');
  const [cardHolder, setCardHolder] = useState<string>(bookingDetails.clientName || 'Micheal & Priya Sharma');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState<string>('Paytm Wallet');
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number>(6);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [qrCountdown, setQrCountdown] = useState<number>(300); // 5 mins

  // Gateway config
  const [gatewayConfig, setGatewayConfig] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentSuccessData(null);
      setIsProcessing(false);
      setIsOtpStep(false);
      setEnteredOtp('');
      setOtpTimer(30);
      setQrCountdown(300);
      
      getRazorpayConfig().then(cfg => setGatewayConfig(cfg));
      loadRazorpayScript();
    }
  }, [isOpen]);

  // QR Timer Countdown
  useEffect(() => {
    if (!isOpen || activeMethod !== 'qr' || paymentSuccessData) return;
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeMethod, paymentSuccessData]);

  // OTP Resend Timer
  useEffect(() => {
    if (!isOtpStep || otpTimer <= 0) return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOtpStep, otpTimer]);

  if (!isOpen) return null;

  // Pricing calculations with discount
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const effectivePayableAmount = Math.max(100, payableAmount - discount);

  // Available coupons
  const AVAILABLE_COUPONS = [
    { code: 'ROYALVIVAH', discount: 5000, description: 'Flat ₹5,000 off on luxury wedding dates' },
    { code: 'FOODYWEDLOCK', discount: 3500, description: 'Special celebration discount ₹3,500' },
    { code: 'FIRSTVIVAH', discount: 2500, description: '₹2,500 off for first-time couples' },
    { code: 'SHUBHMUHURTHAM', discount: 1500, description: 'Auspicious Muhurtham date discount ₹1,500' }
  ];

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === code);
    if (found) {
      setAppliedCoupon(found);
      setCouponError(null);
      setCouponInput(code);
    } else {
      setCouponError('Invalid promo code. Try ROYALVIVAH or FOODYWEDLOCK.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('elysian.escrow@razorpay');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Determine Card Brand
   */
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('51') || clean.startsWith('52') || clean.startsWith('55')) return 'Mastercard';
    if (clean.startsWith('60') || clean.startsWith('65')) return 'RuPay';
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    return 'Card';
  };

  /**
   * Step 1: Initiate Payment & Trigger 2FA / Bank Security Verification
   */
  const handleInitiatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsOtpStep(true);
      setOtpTimer(30);
      setEnteredOtp('492810'); // Pre-fill with demo test OTP for instant seamless UX
    }, 800);
  };

  /**
   * Step 2: Verify Simulated OTP & Finalize Payment
   */
  const handleConfirmOtpAndPay = async () => {
    setIsProcessing(true);
    
    setTimeout(async () => {
      const order = await createRazorpayOrder(effectivePayableAmount, bookingDetails);
      const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`;
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      await verifyRazorpayPayment({
        razorpay_order_id: order.orderId,
        razorpay_payment_id: paymentId,
        bookingDetails
      });

      const selectedMethodFormatted: any = 
        activeMethod === 'upi' ? 'razorpay_upi' :
        activeMethod === 'card' ? 'razorpay_card' :
        activeMethod === 'qr' ? 'razorpay_qr' :
        activeMethod === 'wallet' ? 'razorpay_wallet' :
        activeMethod === 'venue_advance' ? 'pay_at_venue' : 'razorpay_netbanking';

      setIsProcessing(false);
      setIsOtpStep(false);

      const successDetails = {
        paymentId,
        orderId: order.orderId,
        invoiceNumber,
        amount: effectivePayableAmount,
        discountAmount: discount,
        timestamp: new Date().toISOString(),
        method: activeMethod === 'venue_advance' ? '20% Token Hold (Venue Settlement)' : activeMethod.toUpperCase()
      };

      setPaymentSuccessData(successDetails);

      onPaymentSuccess({
        paymentId,
        orderId: order.orderId,
        method: selectedMethodFormatted,
        amountPaid: effectivePayableAmount,
        couponCode: appliedCoupon?.code,
        discountAmount: discount
      });
    }, 1200);
  };

  /**
   * Download Official PDF Tax Invoice
   */
  const handleDownloadInvoice = () => {
    if (!paymentSuccessData) return;

    const baseAmount = bookingDetails.basePrice || Math.round(payableAmount * 0.95);
    const taxAmount = bookingDetails.taxAmount || Math.round(baseAmount * 0.05);
    const totalAmount = baseAmount + taxAmount - discount;
    const remainingBalance = Math.max(0, totalAmount - paymentSuccessData.amount);

    generateInvoicePdf({
      invoiceNumber: paymentSuccessData.invoiceNumber,
      orderId: paymentSuccessData.orderId,
      paymentId: paymentSuccessData.paymentId,
      paymentMethod: paymentSuccessData.method,
      paymentDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      clientName: bookingDetails.clientName || 'Valued Couple',
      clientEmail: bookingDetails.clientEmail || 'client@elysianwedlock.com',
      clientPhone: bookingDetails.clientPhone || '+91 98200 12345',
      serviceTitle: bookingDetails.serviceTitle || 'Luxury Celebration Booking',
      serviceType: bookingDetails.serviceType || 'hall',
      serviceSubtitle: bookingDetails.serviceSubtitle,
      eventDate: bookingDetails.eventDate || 'Upcoming',
      timeWindow: bookingDetails.timeWindow,
      guestCount: bookingDetails.guestCount,
      baseAmount,
      taxAmount,
      discountAmount: discount,
      couponCode: appliedCoupon?.code,
      totalAmount,
      amountPaid: paymentSuccessData.amount,
      remainingBalance,
      paymentType: paymentType as any
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#C5A059]/30 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#1A1A1A] p-4 sm:p-5 text-white flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#C5A059] to-[#8C6A24] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-serif-luxury tracking-wide">
                  Elysian Razorpay Gateway
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40">
                  256-Bit Escrow Secured
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Test / Simulator Mode
                </span>
              </div>
              <p className="text-xs text-stone-400">Multi-Channel Payment Gateway • UPI, Cards, NetBanking, QR & Wallets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. SUCCESS SCREEN */}
        {paymentSuccessData ? (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg ring-8 ring-emerald-50 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Authorized & Date Locked
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#1A1A1A] mt-2">
                ₹{paymentSuccessData.amount.toLocaleString('en-IN')} Secured
              </h2>
              <p className="text-xs text-[#666666] max-w-md mx-auto mt-1">
                Your reservation for <strong>{bookingDetails.serviceTitle}</strong> has been secured with official Escrow Protection.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E5E0D5] text-left text-xs space-y-2.5 max-w-lg mx-auto">
              <div className="flex justify-between pb-2 border-b border-[#E5E0D5]">
                <span className="text-[#666666]">Tax Invoice Number:</span>
                <span className="font-mono font-bold text-[#1A1A1A]">{paymentSuccessData.invoiceNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5E0D5]">
                <span className="text-[#666666]">Razorpay Payment ID:</span>
                <span className="font-mono font-bold text-[#8C6A24]">{paymentSuccessData.paymentId}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5E0D5]">
                <span className="text-[#666666]">Razorpay Order ID:</span>
                <span className="font-mono text-[#1A1A1A]">{paymentSuccessData.orderId}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-[#E5E0D5]">
                <span className="text-[#666666]">Payment Channel:</span>
                <span className="font-semibold text-[#1A1A1A]">{paymentSuccessData.method}</span>
              </div>
              {paymentSuccessData.discountAmount > 0 && (
                <div className="flex justify-between pb-2 border-b border-[#E5E0D5] text-emerald-700">
                  <span>Coupon Discount Applied:</span>
                  <span className="font-bold">-₹{paymentSuccessData.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between pb-2 border-b border-[#E5E0D5]">
                <span className="text-[#666666]">Event Date:</span>
                <span className="font-bold text-[#1A1A1A]">{bookingDetails.eventDate || 'Confirmed'}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Escrow Date Hold Guarantee:</span>
                <span>100% Active & Protected</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={handleDownloadInvoice}
                className="px-5 py-3 rounded-xl bg-linear-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Tax Invoice (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 rounded-xl border border-[#E5E0D5] text-[#1A1A1A] hover:bg-[#FAF8F5] font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#1A1A1A] text-[#C5A059] hover:bg-black font-bold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : isOtpStep ? (
          
          /* 2. BANK 3D SECURE / 2FA OTP VERIFICATION STEP */
          <div className="p-6 sm:p-8 space-y-5">
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A]">Bank 3D Secure Authorization</h4>
                  <p className="text-[11px] text-[#666666]">
                    Simulated verification for {activeMethod === 'card' ? 'Visa / Mastercard' : activeMethod === 'upi' || activeMethod === 'qr' ? 'UPI PIN' : selectedBank}
                  </p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-[#1A1A1A] font-mono">
                ₹{effectivePayableAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#E5E0D5] text-center space-y-4 shadow-xs">
              <div className="space-y-1">
                <span className="text-xs text-[#666666] block">
                  Enter the 6-digit verification code sent to your registered mobile number:
                </span>
                <span className="text-xs font-mono font-bold text-[#1A1A1A]">
                  +91 ••••• ••{bookingDetails.clientPhone?.slice(-4) || '3210'}
                </span>
              </div>

              {/* 6-Digit OTP Box */}
              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="492810"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold py-3 bg-[#FAF8F5] border-2 border-[#C5A059] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                />
              </div>

              {/* Demo Helper Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] text-amber-800 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Test Code: <strong>492810</strong> (Pre-filled for instant verification)</span>
              </div>

              {/* Resend Timer */}
              <div className="text-xs text-[#666666] flex items-center justify-center gap-2 pt-1">
                {otpTimer > 0 ? (
                  <span>Resend code in {otpTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOtpTimer(30); setEnteredOtp('492810'); }}
                    className="text-[#C5A059] hover:underline font-bold cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </div>

            {/* OTP Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="px-4 py-3 rounded-xl border border-[#E5E0D5] text-[#666666] hover:bg-[#FAF8F5] text-xs font-bold cursor-pointer"
              >
                Back to Methods
              </button>

              <button
                type="button"
                onClick={handleConfirmOtpAndPay}
                disabled={isProcessing || enteredOtp.length < 4}
                className="flex-1 py-3.5 px-6 rounded-xl bg-linear-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 text-xs font-bold cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Escrow Lock...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Approve & Lock Date (₹{effectivePayableAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (

          /* 3. MULTI-METHOD PAYMENT SELECTION & CHECKOUT (FOODYWEB / ROBUST PATTERN) */
          <div className="p-4 sm:p-6 space-y-4">

            {/* Service & Price Summary Banner */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E5E0D5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6A24] bg-[#F7F3EB] px-2 py-0.5 rounded border border-[#C5A059]/30">
                    {paymentType === 'advance_deposit' ? '20% Escrow Date Hold' : paymentType === 'pay_at_venue' ? 'Advance Token Hold' : '100% Full Payment'}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{bookingDetails.serviceType?.toUpperCase()}</span>
                </div>
                <h4 className="font-serif-luxury text-base font-bold text-[#1A1A1A] mt-0.5 truncate max-w-md">
                  {bookingDetails.serviceTitle || 'Luxury Wedding Reservation'}
                </h4>
                <p className="text-xs text-[#666666]">
                  Target Date: <strong className="text-[#1A1A1A]">{bookingDetails.eventDate || 'Confirmed Date'}</strong> • Client: {bookingDetails.clientName || 'Valued Guest'}
                </p>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5E0D5]">
                <span className="text-[11px] text-[#666666] block">Payable Advance</span>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                  {discount > 0 && (
                    <span className="text-xs line-through text-stone-400 font-mono">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-2xl font-bold font-serif-luxury text-[#1A1A1A]">
                    ₹{effectivePayableAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Coupon Promo Code Box */}
            <div className="p-3 bg-[#FDFCFB] rounded-2xl border border-[#E5E0D5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                  Have a Promo / Coupon Code?
                </span>
                {appliedCoupon && (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    Remove ({appliedCoupon.code})
                  </button>
                )}
              </div>

              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code: ROYALVIVAH"
                    className="flex-1 bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-[#C5A059] text-xs font-bold rounded-xl cursor-pointer transition-all"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>{appliedCoupon.code}</strong> applied — Saved ₹{appliedCoupon.discount.toLocaleString('en-IN')}!</span>
                  </div>
                  <span className="font-bold text-emerald-700">-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Quick Coupon Chips */}
              {!appliedCoupon && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-stone-400">Popular:</span>
                  {AVAILABLE_COUPONS.slice(0, 2).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleApplyCoupon(c.code)}
                      className="px-2 py-0.5 bg-white hover:bg-amber-50 border border-dashed border-[#C5A059] rounded-md text-[10px] font-mono font-bold text-[#8C6A24] cursor-pointer transition-all"
                    >
                      {c.code} (₹{c.discount})
                    </button>
                  ))}
                </div>
              )}

              {couponError && (
                <span className="text-[11px] text-rose-600 block">{couponError}</span>
              )}
            </div>

            {/* Layout: Payment Method Selector & Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Method Sidebar / Tabs (4 Cols) */}
              <div className="md:col-span-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                  Payment Channels
                </span>

                <button
                  type="button"
                  onClick={() => setActiveMethod('upi')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'upi'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">UPI Apps & VPA</span>
                    <span className="text-[10px] font-normal text-stone-400">GPay, PhonePe, Paytm</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod('qr')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'qr'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">Scan UPI QR Code</span>
                    <span className="text-[10px] font-normal text-stone-400">Dynamic Escrow QR</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod('card')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'card'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">Credit / Debit Cards</span>
                    <span className="text-[10px] font-normal text-stone-400">Visa, Master, RuPay</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod('netbanking')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'netbanking'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <Building className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">Net Banking</span>
                    <span className="text-[10px] font-normal text-stone-400">Top Indian Banks</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod('wallet')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'wallet'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">Digital Wallets</span>
                    <span className="text-[10px] font-normal text-stone-400">Paytm, Amazon, PhonePe</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod('venue_advance')}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeMethod === 'venue_advance'
                      ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A] shadow-xs'
                      : 'bg-white text-[#555555] border-[#E5E0D5] hover:border-[#C5A059]'
                  }`}
                >
                  <Coins className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <div className="flex-1 truncate">
                    <span className="block">Pay at Venue (20% Hold)</span>
                    <span className="text-[10px] font-normal text-stone-400">COD / Cash on Event</span>
                  </div>
                </button>

              </div>

              {/* Method Details Pane (8 Cols) */}
              <div className="md:col-span-8 bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E5E0D5] flex flex-col justify-between">
                
                {/* 1. UPI TAB */}
                {activeMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                        Enter UPI ID / Virtual Payment Address (VPA)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full bg-white border border-[#E5E0D5] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                        />
                        <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Verified VPA
                        </span>
                      </div>
                    </div>

                    {/* Quick VPA Suffix Suffixes */}
                    <div>
                      <span className="text-[10px] text-[#666666] block mb-1.5">Fast Bank Handle Suffixes:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['@okhdfcbank', '@ybl', '@paytm', '@okicici', '@ibl', '@axl'].map((sfx) => (
                          <button
                            key={sfx}
                            type="button"
                            onClick={() => {
                              const prefix = upiId.split('@')[0] || 'micheal';
                              setUpiId(`${prefix}${sfx}`);
                            }}
                            className="px-2 py-1 rounded bg-white hover:bg-[#F0ECE1] border border-[#E5E0D5] text-[10px] font-mono text-[#1A1A1A] cursor-pointer"
                          >
                            {sfx}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Direct App Launchers */}
                    <div className="pt-2 border-t border-[#E5E0D5]">
                      <span className="text-[11px] font-semibold text-[#1A1A1A] block mb-2">Or open UPI app directly on phone:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Google Pay', 'PhonePe', 'Paytm UPI'].map((appName) => (
                          <button
                            key={appName}
                            type="button"
                            onClick={handleInitiatePayment}
                            className="p-2 bg-white rounded-xl border border-[#E5E0D5] hover:border-[#C5A059] text-center text-xs font-semibold text-[#1A1A1A] cursor-pointer shadow-2xs transition-all"
                          >
                            {appName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. QR CODE TAB */}
                {activeMethod === 'qr' && (
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl border border-[#E5E0D5] shadow-xs text-center shrink-0">
                      <svg className="w-32 h-32 mx-auto text-[#1A1A1A]" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M0 0h30v30H0V0zm6 6v18h18V6H6zm70-6h24v30H76V0zm6 6v18h12V6H82zM0 70h30v30H0V70zm6 6v18h18V76H6zm40-70h8v14h-8V6zm14 0h14v8H60V6zm-14 20h8v14h-8V26zm20 0h8v8h-8v-8zm-6 14h20v8H60v-8zm-20 6h8v14h-8V46zm14 0h14v8H54v-8zm26 6h14v8H80v-8zm-40 20h8v14h-8V72zm20 0h8v8h-8v-8zm-6 14h20v8H60v-8zm20-6h14v14H80V80z" />
                      </svg>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-amber-700 font-bold mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Expires in {formatTime(qrCountdown)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-center sm:text-left flex-1">
                      <span className="font-bold text-[#1A1A1A] block">Scan with any UPI App</span>
                      <p className="text-[#666666] text-[11px]">
                        Open Google Pay, PhonePe, Paytm, or BHIM to pay <strong>₹{effectivePayableAmount.toLocaleString('en-IN')}</strong> directly.
                      </p>
                      
                      <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                        <span className="font-mono text-[11px] bg-white px-2.5 py-1 rounded border border-[#E5E0D5] text-[#1A1A1A]">
                          elysian.escrow@razorpay
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="p-1 rounded hover:bg-white border border-[#E5E0D5] text-[#666666] cursor-pointer"
                          title="Copy UPI ID"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. CARD TAB */}
                {activeMethod === 'card' && (
                  <div className="space-y-3">
                    
                    {/* Visual Card Preview */}
                    <div className="bg-linear-to-r from-[#1A1A1A] via-[#2C2A28] to-[#1A1A1A] p-3.5 rounded-xl text-white shadow-sm border border-[#C5A059]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]">
                          {getCardBrand(cardNumber)} SECURE
                        </span>
                        <CreditCard className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div className="font-mono text-sm tracking-wider text-white">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end text-[10px] text-stone-300">
                        <div>
                          <span className="block text-[8px] uppercase text-stone-400">Cardholder</span>
                          <span className="font-bold truncate max-w-[140px] block">{cardHolder || 'MICHEAL SHARMA'}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-stone-400">Expires</span>
                          <span className="font-mono font-bold">{cardExpiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 8765 2341 9012"
                          className="w-full bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="08/29"
                            className="w-full bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. NET BANKING TAB */}
                {activeMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#1A1A1A]">Popular Indian Banks</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                            selectedBank === bank
                              ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A]'
                              : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] text-[#666666] mb-1">All Other Banks (30+ Supported)</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-[#E5E0D5] rounded-xl px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra">Kotak Mahindra Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="Union Bank of India">Union Bank of India</option>
                        <option value="Federal Bank">Federal Bank</option>
                        <option value="Yes Bank">Yes Bank</option>
                        <option value="IDBI Bank">IDBI Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. WALLET TAB */}
                {activeMethod === 'wallet' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#1A1A1A]">Select Digital Wallet</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik', 'Airtel Money'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setSelectedWallet(w)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            selectedWallet === w
                              ? 'bg-[#1A1A1A] text-[#C5A059] border-[#1A1A1A]'
                              : 'bg-white text-[#1A1A1A] border-[#E5E0D5] hover:border-[#C5A059]'
                          }`}
                        >
                          <span className="block font-bold">{w}</span>
                          <span className="text-[10px] text-emerald-700">✓ Instant Link</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. PAY AT VENUE / ADVANCE TOKEN TAB */}
                {activeMethod === 'venue_advance' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                      <span className="font-bold text-[#1A1A1A] block">20% Advance Date Lock Guarantee</span>
                      <p className="text-[#666666] text-[11px]">
                        Pay <strong>₹{effectivePayableAmount.toLocaleString('en-IN')}</strong> now as an advance token hold. The remaining balance of the contract is payable directly to the vendor at the venue on the wedding event day.
                      </p>
                    </div>

                    <div className="space-y-1 text-[#555555]">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Date locked exclusively for you across pan-India calendar</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Zero cancellation risk with 100% Escrow Protection</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Remaining payment settled via Cash / Card / Cheque on event day</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Action inside Pane */}
                <div className="pt-4 mt-3 border-t border-[#E5E0D5] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#666666] hidden sm:flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>256-Bit Escrow Protection</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleInitiatePayment}
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-linear-to-r from-[#C5A059] to-[#8C6A24] text-white hover:opacity-95 text-xs font-bold cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Proceed to Pay ₹{effectivePayableAmount.toLocaleString('en-IN')}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
