import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  DollarSign, 
  Users, 
  MapPin, 
  Calculator, 
  CheckCircle2, 
  TrendingUp, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  RotateCcw,
  Layers,
  Building2,
  Utensils,
  Camera,
  Palette,
  Music,
  Gift,
  Loader2
} from 'lucide-react';
import { generateWeddingBudgetPlan, BudgetPlanResult, BudgetAllocation } from '../services/aiService';
import { LOCATIONS_LIST } from '../data/mockData';

interface AiWeddingBudgetPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCategoryFilter?: (categoryKey: string) => void;
  onSelectPackage?: (rec: any) => void;
  onShowToast?: (msg: string) => void;
}

export const AiWeddingBudgetPlannerModal: React.FC<AiWeddingBudgetPlannerModalProps> = ({
  isOpen,
  onClose,
  onApplyCategoryFilter,
  onSelectPackage,
  onShowToast
}) => {
  const [budget, setBudget] = useState<number>(2500000); // 25 Lakhs
  const [guests, setGuests] = useState<number>(500);
  const [selectedCity, setSelectedCity] = useState<string>('Chennai');
  const [weddingStyle, setWeddingStyle] = useState<string>('Grand Royal Heritage');
  const [tradition, setTradition] = useState<string>('South Indian Vedic Kalyanam');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<BudgetPlanResult | null>(null);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'insights' | 'checklist'>('breakdown');

  // Trigger calculation on first open or parameter change
  const handleCalculatePlan = async () => {
    setIsLoading(true);
    try {
      const res = await generateWeddingBudgetPlan({
        totalBudget: budget,
        guestCount: guests,
        city: selectedCity,
        weddingStyle: weddingStyle,
        culturalTradition: tradition
      });
      setPlanResult(res);
      if (onShowToast) onShowToast('AI Wedding Budget Plan optimized successfully!');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !planResult) {
      handleCalculatePlan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'venue': return <Building2 className="w-4 h-4 text-[#C5A059]" />;
      case 'catering': return <Utensils className="w-4 h-4 text-[#C5A059]" />;
      case 'photography': return <Camera className="w-4 h-4 text-[#C5A059]" />;
      case 'decor': return <Palette className="w-4 h-4 text-[#C5A059]" />;
      case 'entertainment': return <Music className="w-4 h-4 text-[#C5A059]" />;
      default: return <Gift className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCFB] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E0D5] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-5 sm:px-8 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wide text-white">
                  AI Wedding Budget Strategist
                </h2>
                <span className="bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini 3.7 Intelligence
                </span>
              </div>
              <p className="text-xs text-[#D5CEBE]">
                Dynamic cost allocation, per-guest optimization & verified luxury package matching
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#D5CEBE] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Input Controls Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D5] shadow-xs">
            <h3 className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#C5A059]" />
              Event Parameters & Financial Goals
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Budget Slider / Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#1A1A1A]">Target Budget</label>
                  <span className="font-bold text-[#C5A059]">₹{(budget / 100000).toFixed(1)} Lakhs</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="10000000"
                  step="100000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#888888]">
                  <span>₹5L (Intimate)</span>
                  <span>₹50L (Grand)</span>
                  <span>₹1Cr+ (Royal)</span>
                </div>
              </div>

              {/* Guest Count */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#1A1A1A]">Expected Guests</label>
                  <span className="font-bold text-[#1A1A1A]">{guests} Guests</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2500"
                  step="50"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#888888]">
                  <span>50 (Micro)</span>
                  <span>500 (Standard)</span>
                  <span>2500+ (Grand)</span>
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1A1A1A]">Wedding Zone</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                >
                  {LOCATIONS_LIST.map((loc) => (
                    <option key={loc} value={loc.split('/')[0].trim()}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Celebration Style */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1A1A1A]">Style & Tradition</label>
                <select
                  value={weddingStyle}
                  onChange={(e) => setWeddingStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Grand Royal Heritage">Grand Royal Heritage (Palace / Mandapam)</option>
                  <option value="Traditional Vedic Kalyanam">Traditional Vedic Kalyanam</option>
                  <option value="Modern Luxury Reception">Modern Luxury Reception</option>
                  <option value="Beachfront & Destination">Beachfront & Destination</option>
                  <option value="Intimate Eco-Luxury Nuptials">Intimate Eco-Luxury Nuptials</option>
                  <option value="First Birthday & Sacred Milestone">1st Birthday / Milestone</option>
                </select>
              </div>

            </div>

            {/* Recalculate Button */}
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F0EBE1]">
              <div className="flex items-center gap-2 text-xs text-[#666666]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Includes 18% GST estimate & escrow security buffer</span>
              </div>
              <button
                onClick={handleCalculatePlan}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#2C2A28] text-[#C5A059] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Analyzing Rates with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Recalculate AI Strategy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Strategy Overview Cards */}
          {planResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FAF8F5] border border-[#E5E0D5] p-4 rounded-xl">
                <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider block">Estimated Per-Guest Allocation</span>
                <div className="text-2xl font-bold text-[#1A1A1A] mt-1">
                  ₹{planResult.estimatedCostPerGuest.toLocaleString('en-IN')} <span className="text-xs font-normal text-[#666666]">/ attendee</span>
                </div>
                <p className="text-[11px] text-[#737373] mt-1">
                  Covers dining, hall share, welcome mocktails, and guest hospitality favours.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E5E0D5] p-4 rounded-xl">
                <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider block">Target Financial Tier</span>
                <div className="text-2xl font-bold text-[#C5A059] mt-1">
                  {budget >= 5000000 ? 'Imperial Luxury' : budget >= 2000000 ? 'Royal Prestige' : 'Classic Elegance'}
                </div>
                <p className="text-[11px] text-[#737373] mt-1">
                  Eligible for up to 15% unified package rebate when bundling 3+ services.
                </p>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E5E0D5] p-4 rounded-xl">
                <span className="text-[11px] font-bold text-[#8C6A24] uppercase tracking-wider block">Auspicious Scheduling Tip</span>
                <div className="text-xs font-medium text-[#1A1A1A] mt-1 line-clamp-2">
                  {planResult.auspiciousDateTips}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block mt-1">✓ Muhurtham Ready</span>
              </div>
            </div>
          )}

          {/* Navigation Sub-Tabs */}
          <div className="flex gap-2 border-b border-[#E5E0D5] pb-2">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                  : 'text-[#666666] hover:bg-[#F9F7F2]'
              }`}
            >
              6-Pillar Cost Breakdown
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                  : 'text-[#666666] hover:bg-[#F9F7F2]'
              }`}
            >
              AI Strategic Insights & Savings
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'checklist'
                  ? 'bg-[#1A1A1A] text-[#C5A059] shadow-xs'
                  : 'text-[#666666] hover:bg-[#F9F7F2]'
              }`}
            >
              Vendor Negotiation Checklist
            </button>
          </div>

          {/* Sub-Tab 1: 6-Pillar Breakdown */}
          {activeTab === 'breakdown' && planResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {planResult.allocations.map((alloc) => (
                <div 
                  key={alloc.categoryKey}
                  className="bg-white border border-[#E5E0D5] rounded-xl p-4.5 shadow-2xs hover:border-[#C5A059] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#F9F7F2] border border-[#E5E0D5] flex items-center justify-center">
                        {getCategoryIcon(alloc.categoryKey)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">{alloc.category}</h4>
                        <span className="text-[11px] text-[#888888] font-medium">{alloc.percentage}% of total budget</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1A1A1A]">₹{alloc.allocatedAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Visual Progress bar */}
                  <div className="w-full bg-[#F0EBE1] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-[#C5A059] h-full rounded-full" 
                      style={{ width: `${alloc.percentage * 2}%` }}
                    />
                  </div>

                  {/* Recommended inclusions */}
                  <div className="mt-3 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#F0EBE1] text-[11px] text-[#444444] space-y-1">
                    <span className="text-[10px] font-bold text-[#8C6A24] uppercase block">Recommended Package Features:</span>
                    {alloc.recommendedPackages.map((pkg, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{pkg}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Cost-saving tip */}
                  <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-[#666666]">
                    <Lightbulb className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                    <span><strong>Pro Tip:</strong> {alloc.costSavingTip}</span>
                  </div>

                  {/* Filter Action button */}
                  {onApplyCategoryFilter && (
                    <button
                      onClick={() => {
                        const mapped = 
                          alloc.categoryKey === 'venue' ? 'halls' :
                          alloc.categoryKey === 'catering' ? 'caterers' :
                          alloc.categoryKey === 'photography' ? 'photographers' :
                          alloc.categoryKey === 'decor' ? 'decorations' : 'all';
                        onApplyCategoryFilter(mapped);
                        onClose();
                      }}
                      className="w-full mt-3 py-1.5 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-[#C5A059] text-[#1A1A1A] border border-[#E5E0D5] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Verified {alloc.category.split('&')[0]} in Budget</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sub-Tab 2: Strategic Insights */}
          {activeTab === 'insights' && planResult && (
            <div className="bg-white border border-[#E5E0D5] rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                Gemini AI Optimization Directives
              </h4>

              <div className="space-y-3">
                {planResult.aiStrategicInsights.map((insight, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg text-xs text-[#333333] flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#1A1A1A] text-[#C5A059] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Tab 3: Negotiation Checklist */}
          {activeTab === 'checklist' && planResult && (
            <div className="bg-white border border-[#E5E0D5] rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pre-Booking Verification & Clause Checklist
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {planResult.negotiationChecklist.map((item, idx) => (
                  <div key={idx} className="p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg text-xs text-[#333333] flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E5E0D5] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#737373]">
            Total Allocated: <strong className="text-[#1A1A1A]">₹{budget.toLocaleString('en-IN')}</strong> (100% Balanced)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] text-[#1A1A1A] rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (onShowToast) onShowToast('Budget Strategy saved to your profile!');
                onClose();
              }}
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply to My Wedding</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
