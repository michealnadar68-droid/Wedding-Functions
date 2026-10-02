import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  Sparkles, 
  FileDown, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BarChart3, 
  PieChart, 
  RefreshCw,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { BookingRecord, UserProfile } from '../../types';
import { db } from '../../services/databaseService';
import { generateVendorAnalyticsInsights, VendorAnalyticsAIInsights } from '../../services/aiService';
import { exportBookingsToCsv } from '../../utils/exportUtils';

interface VendorAnalyticsDashboardProps {
  currentUser?: UserProfile;
  vendorName?: string;
  bookings?: BookingRecord[];
  onOpenCalendar?: () => void;
  onOpenBulkExport?: () => void;
  onShowToast?: (msg: string) => void;
}

export const VendorAnalyticsDashboard: React.FC<VendorAnalyticsDashboardProps> = ({
  currentUser = db.getCurrentUser(),
  vendorName,
  bookings = db.getAllSystemBookings(),
  onOpenCalendar,
  onOpenBulkExport,
  onShowToast
}) => {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [aiInsights, setAiInsights] = useState<VendorAnalyticsAIInsights | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Compute vendor performance metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0), 0);
  const confirmedCount = bookings.filter(b => b.status !== 'Cancelled').length;
  const avgOrderValue = confirmedCount > 0 ? Math.round(totalRevenue / confirmedCount) : 450000;
  const conversionRate = 34.2; // 34.2% inquiry-to-booking rate

  const fetchAiInsights = async () => {
    setIsLoadingAi(true);
    try {
      const insights = await generateVendorAnalyticsInsights({
        vendorName: vendorName || currentUser.name || 'Grand Chola Kalyana Mandapam',
        category: currentUser.role === 'admin' ? 'Elysian Network' : 'Luxury Wedding Partner',
        monthlyRevenue: totalRevenue || 3850000,
        conversionRate,
        totalBookings: confirmedCount || 18
      });
      setAiInsights(insights);
      if (onShowToast) onShowToast('Gemini AI strategic insights updated!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiInsights();
  }, []);

  const handleExportCsv = () => {
    exportBookingsToCsv(bookings, `elysian-vendor-analytics-${Date.now()}.csv`);
    if (onShowToast) onShowToast('Exported vendor performance spreadsheet!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E0D5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#8C6A24] bg-[#FAF8F5] px-2 py-0.5 rounded uppercase tracking-wider border border-[#E5E0D5]">
              Executive Intelligence
            </span>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Active
            </span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1A1A1A] mt-1">
            Vendor Performance & Yield Analytics
          </h2>
          <p className="text-xs text-[#737373]">
            Track revenue velocity, conversion funnels, seasonal demand spikes, and AI pricing optimization.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex bg-[#F9F7F2] p-1 rounded-xl border border-[#E5E0D5]">
            {(['30d', '90d', '1y', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer uppercase ${
                  timeframe === tf
                    ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                    : 'text-[#666666] hover:text-[#1A1A1A]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-[#FAF8F5] hover:bg-[#1A1A1A] hover:text-[#C5A059] text-[#1A1A1A] border border-[#E5E0D5] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Bookings Revenue */}
        <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider">Gross Booking Value</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#C5A059] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-2">
            ₹{totalRevenue > 0 ? totalRevenue.toLocaleString('en-IN') : '38,50,000'}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs previous period</span>
          </div>
        </div>

        {/* Confirmed Celebrations */}
        <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider">Confirmed Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-2">
            {confirmedCount > 0 ? confirmedCount : '24'} <span className="text-xs font-normal text-[#777]">Weddings</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Escrow guaranteed</span>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider">Inquiry Conversion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-2">
            {conversionRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-blue-700 font-bold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top 5% across platform</span>
          </div>
        </div>

        {/* Avg Booking Value */}
        <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider">Average Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1A1A1A] mt-2">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-700 font-bold mt-2">
            <Zap className="w-3.5 h-3.5" />
            <span>High-Value Luxury Tier</span>
          </div>
        </div>

      </div>

      {/* Conversion Funnel & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Conversion Funnel Visualizer (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A]">Inquiry-to-Booking Funnel</h3>
              <p className="text-xs text-[#737373]">Live track of prospective couples navigating your profile and locking dates</p>
            </div>
            <span className="text-xs font-bold text-[#C5A059]">30-Day Velocity</span>
          </div>

          <div className="space-y-3 pt-2">
            {/* Step 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-[#1A1A1A]">
                <span>1. Profile & Portfolio Impressions</span>
                <span className="font-bold">14,280 Views (100%)</span>
              </div>
              <div className="w-full bg-[#F0EBE1] h-3 rounded-full overflow-hidden">
                <div className="bg-[#1A1A1A] h-full rounded-full w-full" />
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-[#1A1A1A]">
                <span>2. Menu & Pricing Package Card Clicks</span>
                <span className="font-bold">5,420 Couples (38.0%)</span>
              </div>
              <div className="w-full bg-[#F0EBE1] h-3 rounded-full overflow-hidden">
                <div className="bg-[#8C6A24] h-full rounded-full" style={{ width: '38%' }} />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-[#1A1A1A]">
                <span>3. Date Inquiries & Live Chat Starts</span>
                <span className="font-bold">1,850 Discussions (12.9%)</span>
              </div>
              <div className="w-full bg-[#F0EBE1] h-3 rounded-full overflow-hidden">
                <div className="bg-[#C5A059] h-full rounded-full" style={{ width: '13%' }} />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 text-[#1A1A1A]">
                <span>4. Locked Bookings with Escrow Token</span>
                <span className="font-bold text-emerald-700">632 Confirmed Nuptials (4.4%)</span>
              </div>
              <div className="w-full bg-[#F0EBE1] h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '4.4%' }} />
              </div>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D5] flex items-center justify-between text-xs text-[#555]">
            <span>💡 <strong>Optimization Tip:</strong> Answering within 15 minutes boosts conversion by 28%.</span>
            {onOpenCalendar && (
              <button
                onClick={onOpenCalendar}
                className="text-[#C5A059] font-bold hover:underline cursor-pointer"
              >
                View Booking Calendar →
              </button>
            )}
          </div>
        </div>

        {/* Top Performing Packages */}
        <div className="bg-white border border-[#E5E0D5] p-5 rounded-2xl shadow-xs space-y-4">
          <div className="border-b border-[#F0EBE1] pb-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#1A1A1A]">Revenue By Package Tier</h3>
            <p className="text-xs text-[#737373]">Most selected packages by couples</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Royal Maharaja Package</span>
                <span className="text-[#C5A059]">₹18.5L (48%)</span>
              </div>
              <p className="text-[11px] text-[#777] mt-0.5">AC Hall + Bridal Suites + 100% DG Set</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Traditional Kalyanam Suite</span>
                <span className="text-[#C5A059]">₹12.0L (31%)</span>
              </div>
              <p className="text-[11px] text-[#777] mt-0.5">Muhurtham + Dining Hall + Kitchen</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Evening Sangeet & Reception</span>
                <span className="text-[#C5A059]">₹8.0L (21%)</span>
              </div>
              <p className="text-[11px] text-[#777] mt-0.5">Stage Lights + Lawn & Lawn Seating</p>
            </div>
          </div>
        </div>

      </div>

      {/* Gemini AI Strategic Growth & Pricing Advisory */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-2xl border border-[#C5A059]/40 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Gemini AI Strategic Yield Advisor
                </h3>
                <span className="bg-[#C5A059] text-[#1A1A1A] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  AI Commercial Engine
                </span>
              </div>
              <p className="text-xs text-[#D5CEBE]">
                Autonomous revenue yield optimization, peak Muhurtham pricing & bundle recommendations
              </p>
            </div>
          </div>

          <button
            onClick={fetchAiInsights}
            disabled={isLoadingAi}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-bold text-[#C5A059] flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>Re-Analyze Yield</span>
          </button>
        </div>

        {aiInsights ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Pricing Optimization */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2.5">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                Peak Pricing & Yield Tactics
              </span>
              <ul className="text-xs text-[#E5E0D5] space-y-2">
                {aiInsights.pricingOptimizationTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#C5A059] font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* High Demand Windows */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2.5">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                Upcoming Surge Windows (2026-27)
              </span>
              <div className="space-y-2">
                {aiInsights.highDemandWindows.map((win, idx) => (
                  <div key={idx} className="bg-white/5 p-2 rounded-lg border border-white/5 text-xs text-[#E5E0D5] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span>{win}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended High-Margin Addons */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2.5">
              <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                Recommended Upsell Add-ons
              </span>
              <ul className="text-xs text-[#E5E0D5] space-y-2">
                {aiInsights.recommendedAddons.map((addon, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{addon}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#888]">
            Generating strategic recommendations with Gemini...
          </div>
        )}
      </div>

    </div>
  );
};
