import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  X, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Utensils,
  Camera,
  Palette
} from 'lucide-react';
import { BookingRecord, UserProfile } from '../types';
import { db } from '../services/databaseService';
import { 
  AUSPICIOUS_MUHURTHAM_DATES, 
  generateGoogleCalendarUrl, 
  downloadIcsFile, 
  bookingToCalendarEvent,
  checkSlotCollision 
} from '../utils/calendarSync';

interface SmartCalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  currentUser?: UserProfile;
  onShowToast?: (msg: string) => void;
}

export const SmartCalendarSyncModal: React.FC<SmartCalendarSyncModalProps> = ({
  isOpen,
  onClose,
  bookings,
  currentUser = db.getCurrentUser(),
  onShowToast
}) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0); // 0 = Sept 2026, 1 = Oct 2026, etc.
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [newBlockDate, setNewBlockDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'muhurtham' | 'manage'>('calendar');

  if (!isOpen) return null;

  const months = [
    { label: 'September 2026', year: 2026, month: 8, days: 30, startDay: 2 }, // Tuesday
    { label: 'October 2026', year: 2026, month: 9, days: 31, startDay: 4 },   // Thursday
    { label: 'November 2026', year: 2026, month: 10, days: 30, startDay: 0 }, // Sunday
    { label: 'December 2026', year: 2026, month: 11, days: 31, startDay: 2 }, // Tuesday
    { label: 'January 2027', year: 2027, month: 0, days: 31, startDay: 5 },   // Friday
    { label: 'February 2027', year: 2027, month: 1, days: 28, startDay: 1 }   // Monday
  ];

  const currentMonth = months[selectedMonthIndex] || months[0];

  const handleExportAllIcs = () => {
    if (bookings.length === 0) {
      if (onShowToast) onShowToast('No bookings to export.');
      return;
    }
    const events = bookings.map(b => bookingToCalendarEvent(b));
    downloadIcsFile(events, `elysian-wedding-itinerary-${currentUser.name.replace(/\s+/g, '_')}.ics`);
    if (onShowToast) onShowToast('Downloaded luxury wedding itinerary (.ics)!');
  };

  const handleToggleBlockDate = (dateStr: string) => {
    if (blockedDates.includes(dateStr)) {
      setBlockedDates(blockedDates.filter(d => d !== dateStr));
      if (onShowToast) onShowToast(`Unlocked date: ${dateStr}`);
    } else {
      setBlockedDates([...blockedDates, dateStr]);
      if (onShowToast) onShowToast(`Blocked date: ${dateStr}`);
    }
  };

  // Helper to find bookings for a specific day
  const getBookingsForDay = (dayNum: number) => {
    const dayStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return bookings.filter(b => {
      const bDate = (b.selectedDate || b.eventDate || '').split('T')[0];
      return bDate === dayStr;
    });
  };

  // Helper to find auspicious muhurtham for a specific day
  const getMuhurthamForDay = (dayNum: number) => {
    const dayStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return AUSPICIOUS_MUHURTHAM_DATES.find(m => m.date === dayStr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFCFB] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-[#E5E0D5] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-5 sm:px-8 flex items-center justify-between border-b border-[#C5A059]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wide text-white">
                  Smart Calendar & Muhurtham Sync
                </h2>
                <span className="bg-[#C5A059] text-[#1A1A1A] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  iCal + Google Sync
                </span>
              </div>
              <p className="text-xs text-[#D5CEBE]">
                1-click calendar sync, auspicious Muhurtham dates & slot collision protection
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'calendar' ? 'bg-[#1A1A1A] text-[#C5A059]' : 'text-[#666666] hover:bg-[#F9F7F2]'
                }`}
              >
                Interactive Calendar Grid
              </button>
              <button
                onClick={() => setActiveTab('muhurtham')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'muhurtham' ? 'bg-[#1A1A1A] text-[#C5A059]' : 'text-[#666666] hover:bg-[#F9F7F2]'
                }`}
              >
                Muhurtham Dates 2026-27 ({AUSPICIOUS_MUHURTHAM_DATES.length})
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'manage' ? 'bg-[#1A1A1A] text-[#C5A059]' : 'text-[#666666] hover:bg-[#F9F7F2]'
                }`}
              >
                Slot Blocker & Conflict Check
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAllIcs}
                className="px-3.5 py-1.5 rounded-lg bg-[#C5A059] hover:bg-[#B38F46] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Master .ICS Itinerary</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Calendar Grid View */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              
              {/* Month Switcher */}
              <div className="flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D5]">
                <button
                  disabled={selectedMonthIndex === 0}
                  onClick={() => setSelectedMonthIndex(prev => prev - 1)}
                  className="p-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#1A1A1A]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1A1A1A]">
                    {currentMonth.label}
                  </h3>
                  <span className="text-[11px] text-[#8C6A24] font-semibold">
                    Auspicious Vedic Calendar & Confirmed Slots
                  </span>
                </div>

                <button
                  disabled={selectedMonthIndex === months.length - 1}
                  onClick={() => setSelectedMonthIndex(prev => prev + 1)}
                  className="p-1.5 rounded-lg bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#1A1A1A]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-bold text-[#888888] uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Empty offset padding cells */}
                {Array.from({ length: currentMonth.startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[85px] bg-[#F9F7F2]/40 rounded-xl border border-transparent" />
                ))}

                {/* Day numbers */}
                {Array.from({ length: currentMonth.days }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const dayBookings = getBookingsForDay(dayNum);
                  const muhurtham = getMuhurthamForDay(dayNum);
                  const isBlocked = blockedDates.includes(dayStr);

                  return (
                    <div
                      key={`day-${dayNum}`}
                      className={`min-h-[85px] p-1.5 rounded-xl border transition-all flex flex-col justify-between ${
                        dayBookings.length > 0
                          ? 'bg-amber-50/80 border-[#C5A059] shadow-xs'
                          : isBlocked
                          ? 'bg-rose-50/80 border-rose-300'
                          : muhurtham
                          ? 'bg-[#FDFBF7] border-[#C5A059]/40 hover:border-[#C5A059]'
                          : 'bg-white border-[#E5E0D5] hover:border-[#CCCCCC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${
                          dayBookings.length > 0 ? 'text-[#C5A059]' : 'text-[#1A1A1A]'
                        }`}>
                          {dayNum}
                        </span>
                        {muhurtham && (
                          <span title={muhurtham.title} className="text-[#C5A059]">
                            <Sparkles className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      {/* Content Badges */}
                      <div className="space-y-1 my-1">
                        {dayBookings.map((b, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#1A1A1A] text-[#C5A059] text-[9px] font-bold p-1 rounded leading-tight truncate"
                            title={`${b.serviceTitle} (${b.clientName})`}
                          >
                            ✓ {b.serviceTitle || (b as any).vendorName || 'Booked'}
                          </div>
                        ))}

                        {muhurtham && dayBookings.length === 0 && (
                          <div className="bg-[#FAF8F5] text-[#8C6A24] border border-[#C5A059]/30 text-[9px] font-semibold px-1 py-0.5 rounded leading-tight truncate">
                            🌟 {muhurtham.nakshatra}
                          </div>
                        )}

                        {isBlocked && (
                          <div className="bg-rose-600 text-white text-[9px] font-bold px-1 py-0.5 rounded leading-tight text-center">
                            Blocked
                          </div>
                        )}
                      </div>

                      {/* Quick Action */}
                      <div className="text-right">
                        {dayBookings.length > 0 ? (
                          <a
                            href={generateGoogleCalendarUrl(bookingToCalendarEvent(dayBookings[0]))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-[#C5A059] hover:underline font-bold inline-flex items-center gap-0.5"
                          >
                            <span>Google</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <button
                            onClick={() => handleToggleBlockDate(dayStr)}
                            className="text-[9px] text-[#888888] hover:text-[#1A1A1A] font-medium cursor-pointer"
                          >
                            {isBlocked ? 'Unlock' : '+ Block'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#666666] pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-100 border border-[#C5A059]" />
                  <span>Confirmed Booking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#FDFBF7] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
                    <Sparkles className="w-2 h-2" />
                  </span>
                  <span>Auspicious Muhurtham Day</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300" />
                  <span>Vendor Blocked Date</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Muhurtham Dates Directory */}
          {activeTab === 'muhurtham' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {AUSPICIOUS_MUHURTHAM_DATES.map((m, idx) => (
                  <div key={idx} className="bg-white border border-[#E5E0D5] hover:border-[#C5A059] p-4 rounded-xl shadow-2xs space-y-2 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#8C6A24] uppercase tracking-wider block">
                          {new Date(m.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <h4 className="text-xs font-bold text-[#1A1A1A]">{m.title}</h4>
                      </div>
                      <span className="bg-[#FAF8F5] text-[#C5A059] border border-[#C5A059]/40 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {m.lagnam.split('(')[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#555555] bg-[#F9F7F2] p-2.5 rounded-lg border border-[#F0EBE1]">
                      <div><strong>Tithi:</strong> {m.tithi}</div>
                      <div><strong>Nakshatra:</strong> {m.nakshatra}</div>
                      <div className="col-span-2"><strong>Auspicious Timing:</strong> {m.lagnam}</div>
                      <div className="col-span-2 text-[#8C6A24]"><strong>Best For:</strong> {m.favorableFor}</div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Muhurtham: ${m.title}`)}&dates=${m.date.replace(/-/g, '')}T090000Z/${m.date.replace(/-/g, '')}T180000Z&details=${encodeURIComponent(`Auspicious Vedic Muhurtham: ${m.tithi}, Nakshatra: ${m.nakshatra}\nLagnam: ${m.lagnam}\nFavorable for: ${m.favorableFor}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-[#C5A059] text-xs font-bold flex items-center gap-1 hover:bg-[#2C2A28]"
                      >
                        <span>Add to Google Cal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Slot Blocker & Collision Protection */}
          {activeTab === 'manage' && (
            <div className="bg-white border border-[#E5E0D5] p-5 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-[#8C6A24] uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Slot Collision & Availability Engine
              </h4>
              <p className="text-xs text-[#666666]">
                Vendors can block holiday dates, family functions, or external venue bookings. Elysian automatically blocks conflicting customer inquiries for these slots.
              </p>

              <div className="flex gap-2 max-w-md">
                <input
                  type="date"
                  value={newBlockDate}
                  onChange={(e) => setNewBlockDate(e.target.value)}
                  className="px-3 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#1A1A1A]"
                />
                <button
                  onClick={() => {
                    if (newBlockDate) {
                      handleToggleBlockDate(newBlockDate);
                      setNewBlockDate('');
                    }
                  }}
                  className="px-4 py-2 bg-[#1A1A1A] text-[#C5A059] rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#2C2A28]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Block Date</span>
                </button>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#1A1A1A] block mb-2">
                  Currently Blocked Dates ({blockedDates.length}):
                </span>
                {blockedDates.length === 0 ? (
                  <p className="text-xs text-[#888888] italic">No dates blocked. All dates open for inquiries.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((date) => (
                      <span
                        key={date}
                        className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      >
                        <span>{date}</span>
                        <button
                          onClick={() => handleToggleBlockDate(date)}
                          className="hover:text-rose-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#E5E0D5] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#737373]">
            Managing Itinerary for: <strong className="text-[#1A1A1A]">{currentUser.name}</strong> ({bookings.length} Confirmed Events)
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E5E0D5] hover:bg-[#F9F7F2] text-[#1A1A1A] rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleExportAllIcs}
              className="px-5 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download iCal / Apple Calendar</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
