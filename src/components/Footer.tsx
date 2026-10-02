import React, { useState } from 'react';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  Heart,
  Building2,
  Utensils,
  Camera,
  Palette,
  Briefcase,
  UserCheck
} from 'lucide-react';
import { ServiceCategory, AuthRoleType } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ServiceCategory) => void;
  onOpenConsultationModal: () => void;
  onOpenMultiRolePortal?: (role?: AuthRoleType) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenConsultationModal,
  onOpenMultiRolePortal
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How does the Live Booking Status & Auspicious Date Hold work?',
      a: 'When you select an available date and submit a booking request, our system locks the slot with the venue or vendor with 100% Escrow Price Protection. A dedicated Elysian Wedding Concierge immediately verifies venue logistics and confirms your booking within 2 hours.'
    },
    {
      q: 'Can I schedule a venue tour or food tasting session before paying?',
      a: 'Yes! Both Marriage Halls and Caterers support complimentary in-person site visits and chef tasting sessions for prospective couples. Simply use the "Book Tasting" or "Book Now / Check Dates" action button to request your preferred date.'
    },
    {
      q: 'Are the Caterers certified for Pure Vegetarian / Jain / Halal dietary needs?',
      a: 'All our "Pure Veg" partners use 100% dedicated sanctified kitchens with separate vessels, strictly adhering to Sattvic and Jain dietary rules. Our "Non-Veg & Mixed" kitchens maintain strictly separated preparation zones and certified Halal sourcing.'
    },
    {
      q: 'What is included in the All-in-One Wedding Package Discount?',
      a: 'When you bundle 3 or more services together (e.g. Marriage Hall + Caterer + Photographer + Decor), you automatically receive an exclusive 10% bundle discount across all services, plus a complimentary dedicated Day-Of Wedding Coordinator.'
    }
  ];

  return (
    <footer className="bg-[#1A1A1A] text-stone-300 border-t border-black/40">
      
      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block mb-1">
            Frequently Asked Questions
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Everything You Need for Peace of Mind
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-stone-300 leading-relaxed border-t border-white/10 pt-2 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059] flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight">
                  ELYSIAN WEDLOCK
                </span>
                <p className="text-[10px] tracking-widest text-[#C5A059] uppercase font-semibold">
                  Haute Wedding Booking
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              The nation's most trusted luxury wedding ecosystem. Connecting discerning families with verified grand ballrooms, pure veg & mixed gourmet feasts, cinematic visual storytellers, and bespoke stagecraft.
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Verified Vendor Network • 100% Escrow Protection</span>
            </div>
          </div>

          {/* Quick Sectors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Wedding Sectors
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button 
                  onClick={() => onSelectCategory('halls')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  Marriage Halls & Ballrooms Near Me
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('caterers')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                  Pure Veg & Gourmet Caterers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('photographers')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  Cinematographers & 4K Drone Visuals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('decorations')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  Custom Mandap & Stage Themes
                </button>
              </li>
            </ul>
          </div>

          {/* Operating Zones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Prime Wedding Zones
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Beverly Hills & Westside Estates</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Heritage Palace & Fort District</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Uptown Bayfront & Harbors</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Central Grand Avenue & Metro</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Vineyard Hills & Tuscan Estates</li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#C5A059]" /> Lakeside Valley & Botanical Resorts</li>
            </ul>
          </div>

          {/* VIP Concierge Desk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              VIP Wedding Concierge
            </h4>
            <p className="text-xs text-stone-400">
              Need assistance booking multiple venues or customizing a royal destination wedding?
            </p>

            <div className="space-y-2 text-xs">
              <a 
                href="tel:+18008449333" 
                className="flex items-center gap-2 font-bold text-[#C5A059] hover:text-[#C5A059]/80 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+1 (800) 844-WEDD</span>
              </a>
              <a 
                href="mailto:concierge@elysianwedlock.com" 
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>concierge@elysianwedlock.com</span>
              </a>
            </div>

            <button
              onClick={onOpenConsultationModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#8C6A24] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              Request Free Consultation
            </button>

            {onOpenMultiRolePortal && (
              <div className="pt-2 border-t border-white/10 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  3-Role Portals & Uploads
                </div>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <button
                    onClick={() => onOpenMultiRolePortal('vendor')}
                    className="text-stone-300 hover:text-[#C5A059] underline cursor-pointer"
                  >
                    Vendor Listing & Menu Upload
                  </button>
                  <span className="text-stone-600">•</span>
                  <button
                    onClick={() => onOpenMultiRolePortal('admin')}
                    className="text-stone-300 hover:text-[#C5A059] underline cursor-pointer"
                  >
                    Admin Console
                  </button>
                  <span className="text-stone-600">•</span>
                  <button
                    onClick={() => onOpenMultiRolePortal('customer')}
                    className="text-stone-300 hover:text-[#C5A059] underline cursor-pointer"
                  >
                    Customer Sign In
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Elysian Wedlock Platform Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Escrow Protected</span>
            <span>•</span>
            <span>Vendor Verification Standards</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
