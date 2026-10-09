import React, { useState } from 'react';
import { Mail, CheckCircle2, X, ExternalLink, ShieldCheck, Calendar, User, DollarSign, Sparkles } from 'lucide-react';
import { SentEmailRecord } from '../services/mockEmailService';

interface EmailConfirmationToastProps {
  emailRecord: SentEmailRecord;
  onDismiss: () => void;
  onOpenEmailPreview?: (record: SentEmailRecord) => void;
}

export const EmailConfirmationToast: React.FC<EmailConfirmationToastProps> = ({
  emailRecord,
  onDismiss,
  onOpenEmailPreview
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      id="email-confirmation-toast"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-md bg-[#1A1A1A] text-white rounded-2xl shadow-2xl border-2 border-[#C5A059] p-4 sm:p-5 animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-md"
      role="alert"
    >
      {/* Toast Top Bar */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8C6A24] flex items-center justify-center text-white shadow-md shrink-0">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                Simulated Email Trigger
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                <CheckCircle2 className="w-2.5 h-2.5" /> Sent
              </span>
            </div>
            <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
              Booking Confirmation Delivered
            </h4>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Recipient info & Subject */}
      <div className="py-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-stone-300">
          <span>Recipient:</span>
          <span className="font-mono font-bold text-emerald-400 truncate max-w-[240px]">
            {emailRecord.recipientEmail}
          </span>
        </div>

        <div className="p-2.5 bg-stone-900/90 rounded-xl border border-stone-800 text-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
            Subject
          </div>
          <p className="font-semibold text-stone-100 text-xs leading-snug line-clamp-2">
            {emailRecord.subject}
          </p>
        </div>
      </div>

      {/* Detailed Reservation Highlights */}
      <div className="grid grid-cols-2 gap-2 py-2 text-[11px]">
        <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-400 flex items-center gap-1 block">
            <Calendar className="w-3 h-3 text-[#C5A059]" /> Reserved Date
          </span>
          <strong className="text-white text-xs block truncate mt-0.5">
            {emailRecord.eventDate}
          </strong>
        </div>

        <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-400 flex items-center gap-1 block">
            <User className="w-3 h-3 text-[#C5A059]" /> Client Name
          </span>
          <strong className="text-white text-xs block truncate mt-0.5">
            {emailRecord.recipientName}
          </strong>
        </div>

        <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-400 flex items-center gap-1 block">
            <Sparkles className="w-3 h-3 text-[#C5A059]" /> Confirmed Ref
          </span>
          <span className="font-mono font-bold text-[#C5A059] text-xs block truncate mt-0.5">
            #{emailRecord.bookingReference}
          </span>
        </div>

        <div className="p-2 bg-stone-900/60 rounded-lg border border-stone-800">
          <span className="text-[10px] text-stone-400 flex items-center gap-1 block">
            <DollarSign className="w-3 h-3 text-emerald-400" /> Total Escrow
          </span>
          <strong className="text-emerald-400 font-mono text-xs block truncate mt-0.5">
            ₹{emailRecord.totalAmount.toLocaleString('en-IN')}
          </strong>
        </div>
      </div>

      {/* Escrow & Delivery Assurance Note */}
      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 pt-1 pb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>100% Escrow deposit confirmed • Date locked against double bookings</span>
      </div>

      {/* Toast Actions */}
      <div className="flex items-center gap-2 pt-1">
        {onOpenEmailPreview && (
          <button
            type="button"
            onClick={() => onOpenEmailPreview(emailRecord)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#8C6A24] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Simulated Email</span>
          </button>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
