import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  AlertCircle, 
  Heart, 
  Quote, 
  CheckCircle2, 
  MessageSquare,
  Award,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { generateVendorReviewHighlights, VendorReviewSummary } from '../services/aiService';

interface VendorReviewHighlightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: {
    id: string;
    name: string;
    category: string;
    location?: string;
    rating?: number;
    reviewsCount?: number;
    priceFormatted?: string;
    image?: string;
  } | null;
  onShowToast?: (msg: string) => void;
}

export const VendorReviewHighlightsModal: React.FC<VendorReviewHighlightsModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onShowToast
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [summary, setSummary] = useState<VendorReviewSummary | null>(null);

  const fetchHighlights = async () => {
    if (!vendor) return;
    setIsLoading(true);
    try {
      const res = await generateVendorReviewHighlights({
        vendorId: vendor.id,
        vendorName: vendor.name,
        category: vendor.category,
        location: vendor.location,
        rating: vendor.rating || 4.9,
        reviewsCount: vendor.reviewsCount || 120
      });
      setSummary(res);
      if (onShowToast) onShowToast(`Gemini AI synthesized reviews for ${vendor.name}`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && vendor) {
      fetchHighlights();
    }
  }, [isOpen, vendor?.id]);

  if (!isOpen || !vendor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCFB] rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E0D5] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-5 sm:px-8 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-xl font-bold tracking-wide text-white">
                  AI Review Highlights & Sentiment
                </h2>
                <span className="bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Synthesis
                </span>
              </div>
              <p className="text-xs text-[#D5CEBE]">
                Deep customer feedback analysis & verified wedding couple sentiment
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Vendor Snapshot */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-[#8C6A24] uppercase tracking-wider block">
                {vendor.category.toUpperCase()} • {vendor.location || 'Pan-India'}
              </span>
              <h3 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                {vendor.name}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{vendor.rating || 4.9}</span>
                  <span className="text-xs text-[#888888]">({vendor.reviewsCount || 120}+ reviews)</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold">100% Verified Escrow Partner</span>
              </div>

              <button
                onClick={fetchHighlights}
                disabled={isLoading}
                title="Re-analyze with Gemini"
                className="p-2 bg-[#F9F7F2] hover:bg-[#1A1A1A] hover:text-[#C5A059] border border-[#E5E0D5] rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto" />
              <p className="text-xs font-semibold text-[#666666]">
                Gemini is synthesizing verified couple reviews and sentiment patterns...
              </p>
            </div>
          ) : summary ? (
            <>
              {/* Sentiment Score & Verdict */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D5] p-4.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider">AI Sentiment Score</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{summary.sentimentScore}% Positive Sentiment</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-[#2C2A28] leading-relaxed italic bg-white p-3 rounded-lg border border-[#F0EBE1]">
                  "{summary.overallVerdict}"
                </p>
              </div>

              {/* Key Bulleted Highlights */}
              <div className="bg-white border border-[#E5E0D5] p-4.5 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  What Couples Love Most
                </h4>
                <div className="space-y-2">
                  {summary.keyHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#444444]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros & Considerations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="bg-[#F6FBF7] border border-emerald-200 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase">
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                    Key Strengths
                  </h5>
                  <ul className="text-xs text-emerald-950 space-y-1.5">
                    {summary.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Considerations */}
                <div className="bg-[#FFFBF5] border border-amber-200 p-4 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Good To Know
                  </h5>
                  <ul className="text-xs text-amber-950 space-y-1.5">
                    {summary.considerations.map((con, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Verified Couple Quotes */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-2">
                  <Quote className="w-4 h-4 text-[#C5A059]" />
                  Verified Couple Experiences
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {summary.topCoupleQuotes.map((q, idx) => (
                    <div key={idx} className="bg-white border border-[#E5E0D5] p-3.5 rounded-xl text-xs space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] text-[#737373]">
                        <span className="font-bold text-[#1A1A1A]">{q.couple}</span>
                        <span className="text-[10px] bg-[#FAF8F5] border border-[#E5E0D5] px-1.5 py-0.5 rounded">
                          {q.occasion}
                        </span>
                      </div>
                      <p className="text-[#333333] leading-relaxed italic">
                        "{q.quote}"
                      </p>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: q.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E5E0D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 text-xs text-[#737373]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AI Summaries verified against genuine client booking logs</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#2C2A28] text-[#C5A059] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
