import React, { useState } from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  ShieldCheck, 
  Check, 
  X, 
  Clock, 
  Trash2, 
  AlertCircle, 
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { VendorSubmissionItem } from '../../types';

interface AdminApprovalsViewProps {
  pendingListings: VendorSubmissionItem[];
  allVendorListings: VendorSubmissionItem[];
  onApprove: (category: 'hall' | 'caterer' | 'photographer' | 'decor', id: string, title: string) => void;
  onOpenRejectModal: (category: 'hall' | 'caterer' | 'photographer' | 'decor', id: string, title: string) => void;
  onDeleteListing: (category: 'hall' | 'caterer' | 'photographer' | 'decor', id: string, title: string) => void;
  feedbackNotes: { [id: string]: string };
  onUpdateFeedbackNote: (id: string, note: string) => void;
}

export const AdminApprovalsView: React.FC<AdminApprovalsViewProps> = ({
  pendingListings,
  allVendorListings,
  onApprove,
  onOpenRejectModal,
  onDeleteListing,
  feedbackNotes,
  onUpdateFeedbackNote
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hall': return <Building2 className="w-4 h-4 text-[#8C6A24]" />;
      case 'caterer': return <Utensils className="w-4 h-4 text-[#246A42]" />;
      case 'photographer': return <Camera className="w-4 h-4 text-[#36427D]" />;
      case 'decor': return <Palette className="w-4 h-4 text-[#9E3636]" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hall': return 'Marriage Hall / Mandapam';
      case 'caterer': return 'Catering Service & Menu';
      case 'photographer': return 'Photographer & Cinema';
      case 'decor': return 'Mandap & Decor Theme';
      default: return 'Vendor Service';
    }
  };

  const displayedListings = allVendorListings.filter(item => {
    if (filterMode === 'pending') return item.approvalStatus === 'pending';
    if (filterMode === 'approved') return item.approvalStatus === 'approved';
    if (filterMode === 'rejected') return item.approvalStatus === 'rejected';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="p-5 bg-gradient-to-r from-[#1A1A1A] to-[#2C2A28] text-white rounded-3xl border border-[#3E3A36] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#F7F3EB] flex items-center gap-2">
              <span>Master Verification & Approval Council</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#246A42] text-white font-mono font-normal">
                ADMIN AUTHORITY ACTIVE
              </span>
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Review categories uploaded by Pan-India vendors. Grant permission to publish on public pages or request revisions.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-[#C5A059] text-black shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>Pending Approvals</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30">
              {pendingListings.length}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'approved'
                ? 'bg-[#C5A059] text-black shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Live Approved
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#C5A059] text-black shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            All ({allVendorListings.length})
          </button>
        </div>
      </div>

      {/* Verification Queue Listing */}
      {displayedListings.length === 0 ? (
        <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#E5E0D5] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF5EF] text-[#246A42] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">
            {filterMode === 'pending' ? 'Zero Pending Vendor Submissions' : 'No Submissions In This Filter'}
          </h4>
          <p className="text-xs text-[#666666] max-w-md mx-auto">
            {filterMode === 'pending'
              ? 'All vendor categories have been reviewed, verified, and processed.'
              : 'Switch filter to "Pending Approvals" or "All" to view all records.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedListings.map((item) => (
            <div 
              key={item.id}
              className={`p-5 bg-white rounded-3xl border-2 transition-all shadow-xs space-y-4 ${
                item.approvalStatus === 'pending'
                  ? 'border-[#C5A059]/60 shadow-md'
                  : item.approvalStatus === 'approved'
                  ? 'border-[#E5E0D5]'
                  : 'border-[#F0C0C0]'
              }`}
            >
              
              {/* Header row with vendor and category */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F7F3EB] text-[#8C6A24] border border-[#C5A059]/30 flex items-center gap-1.5">
                    {getCategoryIcon(item.category)}
                    <span>{getCategoryLabel(item.category)}</span>
                  </span>

                  {item.approvalStatus === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Permission Requested</span>
                    </span>
                  )}
                  {item.approvalStatus === 'approved' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-700" />
                      <span>Approved Live</span>
                    </span>
                  )}
                  {item.approvalStatus === 'rejected' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 flex items-center gap-1">
                      <X className="w-3 h-3 text-rose-700" />
                      <span>Rejected / Needs Revision</span>
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#888888]">
                  Submitted: {new Date(item.submittedAt).toLocaleString()}
                </div>
              </div>

              {/* Body: Thumbnail, Title, Details */}
              <div className="flex flex-col md:flex-row items-start gap-4">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full md:w-36 h-28 rounded-2xl object-cover border border-[#E5E0D5] shrink-0"
                  />
                )}

                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-serif-luxury text-lg font-bold text-[#1A1A1A]">{item.title}</h4>
                    <p className="text-xs text-[#666666] line-clamp-2 mt-0.5">{item.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-[#F9F7F2] rounded-xl">
                      <span className="text-[10px] text-[#888888] block">📍 Location</span>
                      <strong className="text-[#1A1A1A]">{item.location}</strong>
                    </div>
                    <div className="p-2 bg-[#F9F7F2] rounded-xl">
                      <span className="text-[10px] text-[#888888] block">💰 Base Price / Rate</span>
                      <strong className="text-[#246A42]">₹{Number(item.price).toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="p-2 bg-[#F9F7F2] rounded-xl">
                      <span className="text-[10px] text-[#888888] block">👤 Uploading Vendor</span>
                      <strong className="text-[#1A1A1A]">{item.vendorName}</strong>
                    </div>
                  </div>

                  {item.approvalNotes && (
                    <div className="p-2.5 rounded-xl text-xs bg-[#F7F3EB] text-[#8C6A24] border border-[#C5A059]/20">
                      <strong>Current Council Note:</strong> {item.approvalNotes}
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Review Note Input + Fast Action Buttons */}
              <div className="pt-3 border-t border-[#F0EBE1] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="w-full md:w-1/2">
                  <input 
                    type="text"
                    placeholder="Optional council verification remarks / compliance note..."
                    value={feedbackNotes[item.id] || ''}
                    onChange={(e) => onUpdateFeedbackNote(item.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D5] text-xs bg-[#FAF9F5] focus:bg-white outline-none focus:ring-1 focus:ring-[#C5A059]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {item.approvalStatus !== 'approved' && (
                    <button
                      onClick={() => onApprove(item.category, item.id, item.title)}
                      className="px-4 py-2.5 bg-[#246A42] hover:bg-[#1E5635] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>
                  )}

                  {item.approvalStatus !== 'rejected' && (
                    <button
                      onClick={() => onOpenRejectModal(item.category, item.id, item.title)}
                      className="px-3.5 py-2.5 bg-[#FDF0F0] hover:bg-[#FBE0E0] text-[#9E3636] border border-[#9E3636]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Request Revision</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteListing(item.category, item.id, item.title)}
                    className="p-2 text-[#888888] hover:text-[#9E3636] hover:bg-[#FDF0F0] rounded-xl transition-all cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
