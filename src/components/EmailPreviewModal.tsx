import React from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, Printer, Calendar, User, DollarSign, Clock } from 'lucide-react';
import { SentEmailRecord } from '../services/mockEmailService';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailRecord: SentEmailRecord | null;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  emailRecord
}) => {
  if (!isOpen || !emailRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Client Header bar */}
        <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Mail className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  Simulated SMTP Mail Delivery
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Delivered ({emailRecord.sentAt})
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white truncate max-w-md">
                Booking Confirmation Email
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Print Email"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Meta Envelope Header */}
        <div className="p-4 sm:p-5 bg-[#F9F7F2] border-b border-[#E5E0D5] text-xs space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#666666]">
            <div>
              <strong className="text-[#1A1A1A]">From: </strong>
              <span>concierge@elysianwedlock.com (Elysian Wedlock Automated Reservation Engine)</span>
            </div>
            <span className="font-mono text-[11px] text-[#888888]">{emailRecord.sentAt}</span>
          </div>

          <div className="text-[#666666]">
            <strong className="text-[#1A1A1A]">To: </strong>
            <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {emailRecord.recipientName} &lt;{emailRecord.recipientEmail}&gt;
            </span>
          </div>

          <div className="text-[#1A1A1A] pt-1 border-t border-[#E5E0D5]/70">
            <strong>Subject: </strong>
            <span className="font-semibold text-[#8C6A24]">{emailRecord.subject}</span>
          </div>
        </div>

        {/* Email HTML Body Render */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-stone-100 flex-1">
          <div
            className="shadow-md rounded-xl overflow-hidden bg-[#FDFCFB]"
            dangerouslySetInnerHTML={{ __html: emailRecord.htmlContent }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E5E0D5] flex items-center justify-between shrink-0 text-xs">
          <span className="text-[#888888] flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#246A42]" />
            Simulated email trigger stored for user audit and verification.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-black text-[#C5A059] font-bold text-xs cursor-pointer shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
