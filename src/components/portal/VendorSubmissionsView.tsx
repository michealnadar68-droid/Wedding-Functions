import React from 'react';
import { 
  Building2, 
  Utensils, 
  Camera, 
  Palette, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  Plus,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { VendorSubmissionItem, UserProfile } from '../../types';

interface VendorSubmissionsViewProps {
  submissions: VendorSubmissionItem[];
  currentUser: UserProfile;
  onNavigateToUpload: () => void;
  onNavigateToListing?: (category: 'halls' | 'caterers' | 'photographers' | 'decorations', id: string) => void;
  onDeleteListing: (category: 'hall' | 'caterer' | 'photographer' | 'decor', id: string, title: string) => void;
  onClosePortal: () => void;
}

export const VendorSubmissionsView: React.FC<VendorSubmissionsViewProps> = ({
  submissions,
  currentUser,
  onNavigateToUpload,
  onNavigateToListing,
  onDeleteListing,
  onClosePortal
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hall':
        return <Building2 className="w-4 h-4 text-[#8C6A24]" />;
      case 'caterer':
        return <Utensils className="w-4 h-4 text-[#246A42]" />;
      case 'photographer':
        return <Camera className="w-4 h-4 text-[#36427D]" />;
      case 'decor':
        return <Palette className="w-4 h-4 text-[#9E3636]" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'hall': return 'Marriage Hall';
      case 'caterer': return 'Catering Service & Menu';
      case 'photographer': return 'Photography & Cinema Studio';
      case 'decor': return 'Decor & Mandap Theme';
      default: return 'Service';
    }
  };

  const getTargetPage = (category: string): 'halls' | 'caterers' | 'photographers' | 'decorations' => {
    switch (category) {
      case 'hall': return 'halls';
      case 'caterer': return 'caterers';
      case 'photographer': return 'photographers';
      case 'decor': return 'decorations';
      default: return 'halls';
    }
  };

  const pendingCount = submissions.filter(s => s.approvalStatus === 'pending').length;
  const approvedCount = submissions.filter(s => s.approvalStatus === 'approved').length;
  const rejectedCount = submissions.filter(s => s.approvalStatus === 'rejected').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Workflow Explanation Banner */}
      <div className="p-5 bg-gradient-to-r from-[#F7F3EB] to-[#FFFBF5] rounded-2xl border border-[#C5A059]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 text-[#8C6A24] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif-luxury font-bold text-sm text-[#1A1A1A]">Admin Verification & Listing Protocol</h4>
            <p className="text-xs text-[#666666] mt-0.5">
              All categories uploaded by vendors require review and permission from the <strong>Master Super Admin Council</strong> before appearing in the public 4 pages.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-[#C5A059] rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Another Category</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
          <span className="text-[10px] uppercase font-bold text-[#888888]">Pending Approval</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#8C6A24] mt-1 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-[#C5A059]" />
            <span>{pendingCount}</span>
          </div>
          <span className="text-[10px] text-[#666666]">Under Review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
          <span className="text-[10px] uppercase font-bold text-[#888888]">Approved & Live</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#246A42] mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-[#246A42]" />
            <span>{approvedCount}</span>
          </div>
          <span className="text-[10px] text-[#246A42] font-semibold">Visible to Couples</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5]">
          <span className="text-[10px] uppercase font-bold text-[#888888]">Revisions Requested</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#9E3636] mt-1 flex items-center gap-1.5">
            <AlertCircle className="w-5 h-5 text-[#9E3636]" />
            <span>{rejectedCount}</span>
          </div>
          <span className="text-[10px] text-[#9E3636]">Action Needed</span>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">
            My Uploaded Categories ({submissions.length})
          </h3>
          <span className="text-xs text-[#888888]">Live Sync with Admin Console</span>
        </div>

        {submissions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-[#E5E0D5] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F7F3EB] text-[#8C6A24] flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-serif-luxury font-bold text-lg text-[#1A1A1A]">No Uploaded Categories Yet</h4>
              <p className="text-xs text-[#666666] max-w-md mx-auto mt-1">
                You haven't uploaded any marriage hall, catering menu, photo studio, or decor theme yet. Click below to submit your first service for Super Admin permission.
              </p>
            </div>
            <button
              onClick={onNavigateToUpload}
              className="px-6 py-3 bg-[#1A1A1A] hover:bg-black text-[#C5A059] rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Submit First Category for Approval</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((item) => (
              <div 
                key={item.id}
                className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E5E0D5] hover:border-[#C5A059] transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#E5E0D5] shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F3EB] text-[#8C6A24] border border-[#C5A059]/30 flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{getCategoryLabel(item.category)}</span>
                      </span>

                      {/* Status Badge */}
                      {item.approvalStatus === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Awaiting Super Admin Approval</span>
                        </span>
                      )}
                      {item.approvalStatus === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved & Published Live</span>
                        </span>
                      )}
                      {item.approvalStatus === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Revision Requested</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif-luxury font-bold text-base text-[#1A1A1A]">{item.title}</h4>
                    <p className="text-xs text-[#666666] flex flex-wrap items-center gap-3">
                      <span>📍 {item.location}</span>
                      <span>💰 ₹{Number(item.price).toLocaleString('en-IN')}</span>
                      <span>📅 Submitted: {new Date(item.submittedAt).toLocaleDateString()}</span>
                    </p>

                    {/* Admin Review Feedback Note */}
                    {item.approvalNotes && (
                      <div className={`mt-2 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                        item.approvalStatus === 'approved' 
                          ? 'bg-[#EBF5EF] text-[#1E5635] border border-[#246A42]/20' 
                          : 'bg-[#FDF0F0] text-[#9E3636] border border-[#9E3636]/20'
                      }`}>
                        <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong>Admin Feedback:</strong> {item.approvalNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#F0EBE1]">
                  {item.approvalStatus === 'approved' && onNavigateToListing && (
                    <button
                      onClick={() => {
                        onNavigateToListing(getTargetPage(item.category), item.id);
                        onClosePortal();
                      }}
                      className="px-3.5 py-2 bg-[#F7F3EB] hover:bg-[#1A1A1A] hover:text-[#C5A059] text-[#8C6A24] border border-[#C5A059]/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Live Listing</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteListing(item.category, item.id, item.title)}
                    className="p-2 text-[#888888] hover:text-[#9E3636] hover:bg-[#FDF0F0] rounded-xl transition-all cursor-pointer"
                    title="Delete Category Submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
