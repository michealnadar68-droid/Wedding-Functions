import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  ShieldCheck, 
  DollarSign,
  Plus
} from 'lucide-react';
import { BundleItem, ServiceCategory } from '../types';
import { formatINR } from '../utils/formatters';

interface WeddingBundleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BundleItem[];
  onRemoveItem: (index: number) => void;
  onClearBundle: () => void;
  onCheckoutBundle: (totalCost: number, items: BundleItem[]) => void;
  onNavigateToSector: (sector: ServiceCategory) => void;
}

export const WeddingBundleDrawer: React.FC<WeddingBundleDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearBundle,
  onCheckoutBundle,
  onNavigateToSector
}) => {
  if (!isOpen) return null;

  const rawTotal = items.reduce((sum, item) => sum + item.estimatedCost, 0);
  const bundleDiscount = items.length >= 3 ? Math.round(rawTotal * 0.10) : 0;
  const finalTotal = rawTotal - bundleDiscount;

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'hall': return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'caterer': return <Utensils className="w-4 h-4 text-emerald-600" />;
      case 'photographer': return <Camera className="w-4 h-4 text-indigo-600" />;
      case 'decor': return <Palette className="w-4 h-4 text-rose-600" />;
      default: return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const hasHall = items.some(i => i.type === 'hall');
  const hasCaterer = items.some(i => i.type === 'caterer');
  const hasPhotographer = items.some(i => i.type === 'photographer');
  const hasDecor = items.some(i => i.type === 'decor');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E5E0D5]">
          
          {/* Top Drawer Header */}
          <div className="p-6 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-black/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider block">
                  Wedding Package Builder
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  My Dream Wedding Plan
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Selected Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Checklist of 4 Core Pillars */}
            <div className="p-4 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] space-y-2">
              <span className="text-xs font-bold text-[#1A1A1A] block">4-Sector Wedding Checklist:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => { onClose(); onNavigateToSector('halls'); }}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    hasHall ? 'bg-[#F7F3EB] border-[#C5A059] text-[#8C6A24] font-bold' : 'bg-white border-[#E5E0D5] text-[#666666] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{hasHall ? '✓ Marriage Hall' : '+ Add Hall'}</span>
                </button>

                <button
                  onClick={() => { onClose(); onNavigateToSector('caterers'); }}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    hasCaterer ? 'bg-[#246A42]/10 border-[#246A42] text-[#246A42] font-bold' : 'bg-white border-[#E5E0D5] text-[#666666] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{hasCaterer ? '✓ Catering' : '+ Add Caterer'}</span>
                </button>

                <button
                  onClick={() => { onClose(); onNavigateToSector('photographers'); }}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    hasPhotographer ? 'bg-[#2A4365]/10 border-[#2A4365] text-[#2A4365] font-bold' : 'bg-white border-[#E5E0D5] text-[#666666] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{hasPhotographer ? '✓ Photography' : '+ Add Camera'}</span>
                </button>

                <button
                  onClick={() => { onClose(); onNavigateToSector('decorations'); }}
                  className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    hasDecor ? 'bg-[#8C2424]/10 border-[#8C2424] text-[#8C2424] font-bold' : 'bg-white border-[#E5E0D5] text-[#666666] hover:bg-[#F9F7F2]'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{hasDecor ? '✓ Stage Decor' : '+ Add Decor'}</span>
                </button>
              </div>

              {items.length >= 3 && (
                <div className="mt-2 text-[11px] bg-[#F7F3EB] text-[#8C6A24] p-2 rounded-lg font-bold flex items-center gap-1.5 border border-[#C5A059]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6A24]" />
                  <span>10% All-in-One Multi-Service Discount Unlocked!</span>
                </div>
              )}
            </div>

            {/* List of Included Items */}
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#CCCCCC] mx-auto" />
                <p className="text-sm font-bold text-[#1A1A1A]">Your Package is Empty</p>
                <p className="text-xs text-[#888888] max-w-xs mx-auto">
                  Browse any hall, caterer, photographer, or decor theme and click "Add to Package" to bundle them together!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1A]">Included Services ({items.length})</span>
                  <button
                    onClick={onClearBundle}
                    className="text-[#888888] hover:text-[#8C2424] font-semibold cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((bItem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#F9F7F2] border border-[#E5E0D5] flex items-start justify-between gap-3 group hover:border-[#C5A059] transition-all"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-white border border-[#E5E0D5] shrink-0">
                        {getItemIcon(bItem.type)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A] leading-tight">
                          {bItem.item.name}
                        </h4>
                        <span className="text-[11px] text-[#666666] block truncate max-w-[180px]">
                          {bItem.selectedPackage || bItem.item.location}
                        </span>
                        <span className="text-xs font-extrabold text-[#1A1A1A] font-mono mt-1 block">
                          {formatINR(bItem.estimatedCost)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="p-1.5 text-[#888888] hover:text-[#8C2424] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Remove from package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Drawer Bottom: Financial Totals & All-in-One Checkout */}
          <div className="p-6 bg-[#F9F7F2] border-t border-[#E5E0D5] space-y-4">
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#666666]">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-mono">{formatINR(rawTotal)}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-[#246A42] font-bold">
                  <span>10% All-in-One Savings</span>
                  <span className="font-mono">-{formatINR(bundleDiscount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#E5E0D5] flex justify-between text-base font-extrabold text-[#1A1A1A]">
                <span>Estimated Package Budget:</span>
                <span className="font-mono text-[#246A42]">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              onClick={() => onCheckoutBundle(finalTotal, items)}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all ${
                items.length === 0
                  ? 'bg-[#E5E0D5] text-[#888888] cursor-not-allowed'
                  : 'bg-[#1A1A1A] hover:bg-black text-[#C5A059] cursor-pointer'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Proceed with Wedding Package ({formatINR(finalTotal)})</span>
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
