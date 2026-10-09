import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ShieldCheck, Printer, Smartphone, MessageSquare, Copy, Check } from 'lucide-react';
import { SentEmailRecord, mockEmailService, SentSmsRecord } from '../services/mockEmailService';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailRecord: SentEmailRecord | null;
  initialTab?: 'email' | 'sms';
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  isOpen,
  onClose,
  emailRecord,
  initialTab = 'email'
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>(initialTab);
  const [copiedSms, setCopiedSms] = useState(false);

  if (!isOpen || !emailRecord) return null;

  const handlePrint = () => {
    window.print();
  };

  const smsRecord: SentSmsRecord | undefined = 
    mockEmailService.getSentSmsByBookingId(emailRecord.bookingReference) ||
    mockEmailService.getSentSms()[0];

  const targetPhone = smsRecord?.recipientPhone || '+91 98200 12345';
  const smsBody = smsRecord?.message || 
    `💍 Elysian Wedlock: Congratulations ${emailRecord.recipientName}! Reservation #${emailRecord.bookingReference} for "${emailRecord.serviceTitle}" on ${emailRecord.eventDate} is officially confirmed & locked in 100% Escrow. Deposit: ₹${emailRecord.depositPaid.toLocaleString('en-IN')}. VIP Concierge: +1 (800) 844-WEDD.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E0D5] overflow-hidden my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Client Header bar */}
        <div className="bg-[#1A1A1A] text-white p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              {activeTab === 'email' ? <Mail className="w-5 h-5 text-[#C5A059]" /> : <Smartphone className="w-5 h-5 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-[#C5A059] tracking-wider">
                  {activeTab === 'email' ? 'Simulated SMTP Mail Delivery' : 'Simulated Mobile SMS Gateway'}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Delivered ({emailRecord.sentAt})
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white truncate max-w-md">
                Booking Confirmation Dispatched
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'email' && (
              <button
                onClick={handlePrint}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Print Email"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Email vs Phone SMS */}
        <div className="bg-[#F9F7F2] px-4 pt-2.5 border-b border-[#E5E0D5] flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'email'
                ? 'bg-white text-[#1A1A1A] border-[#E5E0D5] shadow-xs'
                : 'text-[#666666] border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-amber-600" />
            <span>Email View ({emailRecord.recipientEmail})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-t border-x ${
              activeTab === 'sms'
                ? 'bg-white text-[#1A1A1A] border-[#E5E0D5] shadow-xs'
                : 'text-[#666666] border-transparent hover:text-[#1A1A1A]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phone SMS View (+91 {targetPhone.replace(/^\+91\s*/, '')})</span>
          </button>
        </div>

        {activeTab === 'email' ? (
          <>
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
          </>
        ) : (
          /* Phone SMS Simulator View */
          <div className="p-6 sm:p-8 overflow-y-auto bg-stone-100 flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border-4 border-stone-800 overflow-hidden flex flex-col">
              {/* Smartphone Top Notch & Status */}
              <div className="bg-stone-900 text-white px-4 py-2 flex items-center justify-between text-[11px]">
                <span className="font-bold">{emailRecord.sentAt.slice(0, 5)}</span>
                <div className="w-16 h-3 bg-stone-800 rounded-full" />
                <span className="text-[10px] text-stone-400">5G • 100%</span>
              </div>

              {/* SMS Header */}
              <div className="bg-[#FAF8F5] border-b border-[#E5E0D5] p-3 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-1">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-[#1A1A1A]">ELYSIAN-ESCROW</h4>
                <p className="text-[10px] text-[#666666] font-mono">
                  To: +91 {targetPhone.replace(/^\+91\s*/, '')}
                </p>
              </div>

              {/* Chat Message Bubble Area */}
              <div className="p-4 bg-[#F2EFE9] space-y-3 min-h-[180px] flex flex-col justify-end">
                <div className="text-center">
                  <span className="text-[9px] uppercase font-bold text-[#888888] bg-white/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                    Today • {emailRecord.sentAt}
                  </span>
                </div>

                <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-[#1A1A1A] space-y-1.5 border border-[#E5E0D5]">
                  <p className="leading-relaxed text-[11px]">
                    {smsBody}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[9px] text-[#888888]">
                    <span>Delivered via SMS</span>
                    <span className="text-emerald-700 font-bold">✓✓ Read</span>
                  </div>
                </div>
              </div>

              {/* SMS Footer Action */}
              <div className="p-3 bg-white border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#888888]">Mobile Carrier Verified</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(smsBody);
                    setCopiedSms(true);
                    setTimeout(() => setCopiedSms(false), 2000);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EBE1] text-[#1A1A1A] font-bold text-[10px] border border-[#E5E0D5] flex items-center gap-1 cursor-pointer"
                >
                  {copiedSms ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSms ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E5E0D5] flex items-center justify-between shrink-0 text-xs">
          <span className="text-[#888888] flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#246A42]" />
            Dual notification dispatched to phone no & mail for verified escrow records.
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

