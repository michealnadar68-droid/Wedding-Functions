import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  FileCheck,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { generateCredentialsPdf } from '../utils/credentialsPdfGenerator';
import { db } from '../services/databaseService';
import { UserProfile } from '../types';

interface CredentialsPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  currentUser?: UserProfile;
}

export const CredentialsPdfModal: React.FC<CredentialsPdfModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  currentUser = db.getCurrentUser()
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'admin';

  const handleDownload = () => {
    if (!isAdmin) {
      onShowToast('Access Denied: Only Super-Admin can download confidential credentials.');
      return;
    }

    setIsGenerating(true);
    try {
      generateCredentialsPdf();
      setIsDownloaded(true);
      onShowToast('Official credentials PDF downloaded successfully! 📄');
    } catch (err) {
      console.error(err);
      onShowToast('Could not generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="credentials-pdf-modal"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1A1A1A] text-white p-6 relative border-b border-[#2C2A28]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C5A059] to-[#8C6A24] text-white flex items-center justify-center shadow-lg ring-2 ring-[#C5A059]/30">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] px-2 py-0.5 bg-[#C5A059]/10 rounded border border-[#C5A059]/30">
                  Confidential Export
                </span>
                <h2 className="font-serif-luxury text-xl font-bold text-white mt-1">
                  Download Access Keys PDF
                </h2>
                <p className="text-stone-300 text-xs mt-0.5">
                  Secure offline document containing all platform login IDs & passwords.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-[#FDFCFB]">
          
          {/* Security Notice / Admin Authorization State */}
          {isAdmin ? (
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D5] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="text-xs text-[#555555] space-y-1">
                <strong className="text-[#1A1A1A] block font-bold">Confidential Super-Admin Registry</strong>
                <p>
                  In compliance with security & privacy standards, platform credentials and private customer records are protected. As an authorized Super-Admin, you can download this complete access key registry.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <strong className="block font-bold">Super-Admin Authorization Required</strong>
                <p>
                  Master credentials and passwords are restricted to Platform Super-Administrators only. Please sign in to the Super-Admin verification console to access this file.
                </p>
              </div>
            </div>
          )}

          {/* Accounts Included Overview */}
          <div className="bg-white p-4 rounded-2xl border border-[#E5E0D5] space-y-3 shadow-2xs">
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-wider block">
              Profiles Included in PDF (8 Accounts):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
                <span className="font-bold text-[#1A1A1A]">Super-Admin Console</span>
              </div>
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="font-bold text-[#1A1A1A]">3 Host / Couple Clients</span>
              </div>
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span className="font-bold text-[#1A1A1A]">Marriage Hall Partners</span>
              </div>
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span className="font-bold text-[#1A1A1A]">Gourmet Banquet Caterers</span>
              </div>
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span className="font-bold text-[#1A1A1A]">4K Cine Studios & Drone</span>
              </div>
              <div className="p-2 bg-[#F9F7F2] rounded-xl flex items-center gap-2 border border-[#E5E0D5]/60">
                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                <span className="font-bold text-[#1A1A1A]">Royal Mandap & Decor</span>
              </div>
            </div>
          </div>

          {/* Action Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating || !isAdmin}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] hover:text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-[#C5A059]" />
                <span>Generating Confidential PDF...</span>
              </>
            ) : !isAdmin ? (
              <>
                <Lock className="w-4 h-4 text-stone-400" />
                <span>Admin Restricted (Sign in as Admin to Download)</span>
              </>
            ) : isDownloaded ? (
              <>
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Download Again (Elysian_Wedlock_Confidential_Credentials.pdf)</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Official Credentials PDF (Admin Only)</span>
              </>
            )}
          </button>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9F7F2] border-t border-[#E5E0D5] flex items-center justify-between text-xs text-[#888888]">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Encrypted format for evaluation</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-[#E5E0D5] hover:bg-stone-100 text-[#1A1A1A] font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
