import React, { useState, useMemo } from 'react';
import { 
  FileDown, 
  X, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Filter, 
  Search,
  ShieldCheck,
  Building2,
  Utensils,
  Camera,
  Palette
} from 'lucide-react';
import { BookingRecord, AuthRoleType } from '../types';
import { 
  exportBookingsToCsv, 
  exportBookingsToJson, 
  printBookingSummaryReport 
} from '../utils/exportUtils';

interface BulkExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  defaultRole?: AuthRoleType;
  onShowToast?: (msg: string) => void;
}

export const BulkExportModal: React.FC<BulkExportModalProps> = ({
  isOpen,
  onClose,
  bookings,
  defaultRole = 'customer',
  onShowToast
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'json' | 'print'>('csv');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Category check
      if (categoryFilter !== 'all' && b.serviceType !== categoryFilter) {
        return false;
      }
      // Status check
      if (statusFilter !== 'all' && (b.status || 'Confirmed') !== statusFilter) {
        return false;
      }
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (b.serviceTitle || (b as any).vendorName || '').toLowerCase();
        const client = (b.clientName || '').toLowerCase();
        const id = (b.id || '').toLowerCase();
        return title.includes(q) || client.includes(q) || id.includes(q);
      }
      return true;
    });
  }, [bookings, categoryFilter, statusFilter, searchQuery]);

  if (!isOpen) return null;

  const totalValue = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0), 0);

  const handleExecuteExport = () => {
    if (filteredBookings.length === 0) {
      if (onShowToast) onShowToast('No bookings match your current filter.');
      return;
    }

    if (selectedFormat === 'csv') {
      exportBookingsToCsv(filteredBookings, `elysian-bookings-${Date.now()}.csv`);
      if (onShowToast) onShowToast('Downloaded Excel CSV Report!');
    } else if (selectedFormat === 'json') {
      exportBookingsToJson(filteredBookings, `elysian-ledger-${Date.now()}.json`);
      if (onShowToast) onShowToast('Downloaded JSON Ledger File!');
    } else {
      printBookingSummaryReport(filteredBookings, 'Elysian Wedlock - Luxury Booking Statement');
      if (onShowToast) onShowToast('Generated Printable Ledger Document!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCFB] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E0D5] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-5 sm:px-8 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-xl font-bold tracking-wide text-white">
                  Bulk Booking Export & Audit Ledger
                </h2>
                <span className="bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Data Engine
                </span>
              </div>
              <p className="text-xs text-[#D5CEBE]">
                Export itemized bookings in Excel CSV, Machine JSON, or printable luxury audit format
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
          
          {/* Format Selector Cards */}
          <div>
            <label className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider block mb-3">
              1. Choose Export Format
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CSV */}
              <button
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'csv'
                    ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-xs'
                    : 'bg-[#FAF8F5] border-[#E5E0D5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  {selectedFormat === 'csv' && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] mt-2">Excel CSV Spreadsheet</h4>
                <p className="text-[11px] text-[#666666] mt-1">
                  Itemized columns for financial accounting, deposits & balance calculations.
                </p>
              </button>

              {/* JSON */}
              <button
                onClick={() => setSelectedFormat('json')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'json'
                    ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-xs'
                    : 'bg-[#FAF8F5] border-[#E5E0D5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-6 h-6 text-blue-600" />
                  {selectedFormat === 'json' && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] mt-2">Structured JSON Payload</h4>
                <p className="text-[11px] text-[#666666] mt-1">
                  Clean schema format for external ERP, custom CRM sync, or REST APIs.
                </p>
              </button>

              {/* Print / PDF */}
              <button
                onClick={() => setSelectedFormat('print')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedFormat === 'print'
                    ? 'bg-white border-[#C5A059] ring-2 ring-[#C5A059]/20 shadow-xs'
                    : 'bg-[#FAF8F5] border-[#E5E0D5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Printer className="w-6 h-6 text-purple-600" />
                  {selectedFormat === 'print' && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <h4 className="text-xs font-bold text-[#1A1A1A] mt-2">Printable Luxury PDF</h4>
                <p className="text-[11px] text-[#666666] mt-1">
                  Branded Elysian Wedlock watermark report suitable for official client sign-off.
                </p>
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-xs space-y-3">
            <label className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider block">
              2. Filter Dataset ({filteredBookings.length} of {bookings.length} Records)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Service Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A] focus:outline-none"
                >
                  <option value="all">All Services (Halls, Caterers, Photo, Decor)</option>
                  <option value="halls">Marriage Halls</option>
                  <option value="caterers">Caterers & Feasts</option>
                  <option value="photographers">Photographers</option>
                  <option value="decorations">Stage Decor</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Booking Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed Only</option>
                  <option value="pending">Pending Deposit</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-[11px] font-semibold text-[#1A1A1A] mb-1">Search Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search client, vendor, ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A] focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#888888] absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Live Data Preview */}
          <div className="bg-white border border-[#E5E0D5] rounded-xl overflow-hidden shadow-xs">
            <div className="p-3 bg-[#FAF8F5] border-b border-[#E5E0D5] flex items-center justify-between">
              <span className="text-xs font-bold text-[#1A1A1A]">Ledger Preview</span>
              <span className="text-xs font-bold text-[#C5A059]">Total Value: ₹{totalValue.toLocaleString('en-IN')}</span>
            </div>

            <div className="max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#1A1A1A] text-[#D5CEBE] text-[10px] uppercase font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Service / Vendor</th>
                    <th className="p-2.5">Client</th>
                    <th className="p-2.5">Date</th>
                    <th className="p-2.5">Amount</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D5] text-[#333333]">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-xs text-[#888888] italic">
                        No bookings found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF8F5]">
                        <td className="p-2.5 font-mono text-[10px] text-[#666666]">#{b.id.slice(-6)}</td>
                        <td className="p-2.5 font-semibold text-[#1A1A1A]">{b.serviceTitle || (b as any).vendorName || 'Elysian Booking'}</td>
                        <td className="p-2.5">{b.clientName}</td>
                        <td className="p-2.5">{b.eventDate || (b as any).selectedDate || 'Upcoming'}</td>
                        <td className="p-2.5 font-bold">₹{((b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0)).toLocaleString('en-IN')}</td>
                        <td className="p-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            b.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {b.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E5E0D5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#737373]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Certified 256-Bit Escrow Ledger Compliance</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] text-[#1A1A1A] rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteExport}
              disabled={filteredBookings.length === 0}
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              <span>Export {filteredBookings.length} Records ({selectedFormat.toUpperCase()})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
