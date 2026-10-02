import { BookingRecord, BookingDetails } from '../types';

export interface CalendarEventData {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  timeWindow?: string; // e.g. "Morning Muhurtham (6:00 AM - 12:00 PM)" or "Full Day (8:00 AM - 11:00 PM)"
  vendorName?: string;
  vendorPhone?: string;
  referenceId?: string;
}

export interface MuhurthamDate {
  date: string; // YYYY-MM-DD
  title: string;
  tithi: string;
  nakshatra: string;
  favorableFor: string;
  lagnam: string;
}

// Auspicious Hindu / Pan-Indian Muhurtham Dates 2026-2027
export const AUSPICIOUS_MUHURTHAM_DATES: MuhurthamDate[] = [
  { date: '2026-09-04', title: 'Shukla Trayodashi Muhurtham', tithi: 'Shukla Trayodashi', nakshatra: 'Rohini', favorableFor: 'Grand Weddings, Kalyana Mandapam', lagnam: 'Simha (7:15 AM - 8:45 AM)' },
  { date: '2026-09-18', title: 'Panchami Swati Muhurtham', tithi: 'Shukla Panchami', nakshatra: 'Swati', favorableFor: 'Vedic Rites & Royal Feasts', lagnam: 'Kanya (6:30 AM - 7:45 AM)' },
  { date: '2026-10-09', title: 'Navami Anuradha Auspicious Day', tithi: 'Shukla Navami', nakshatra: 'Anuradha', favorableFor: 'Beach & Palace Weddings', lagnam: 'Vrischika (8:00 AM - 9:30 AM)' },
  { date: '2026-10-24', title: 'Vijaya Dashami Royal Muhurtham', tithi: 'Dashami (Dussehra)', nakshatra: 'Shravana', favorableFor: 'All Milestone Celebrations', lagnam: 'Dhanu (9:15 AM - 10:45 AM)' },
  { date: '2026-11-06', title: 'Dev Uthani Ekadashi Muhurtham', tithi: 'Prabodhini Ekadashi', nakshatra: 'Uttara Ashadha', favorableFor: 'Winter Wedding Season Opener', lagnam: 'Makar (6:45 AM - 8:15 AM)' },
  { date: '2026-11-20', title: 'Karthigai Deepam Muhurtham', tithi: 'Purnima', nakshatra: 'Krittika', favorableFor: 'South Indian & North Indian Weddings', lagnam: 'Kumbha (7:30 AM - 9:00 AM)' },
  { date: '2026-12-04', title: 'Margashirsha Shukla Muhurtham', tithi: 'Shukla Saptami', nakshatra: 'Revati', favorableFor: 'Grand Palace Receptions', lagnam: 'Meena (8:00 AM - 9:30 AM)' },
  { date: '2026-12-18', title: 'Gita Jayanti Holy Muhurtham', tithi: 'Ekadashi', nakshatra: 'Bharani', favorableFor: 'Traditional Vedic Rituals', lagnam: 'Mesha (6:15 AM - 7:45 AM)' },
  { date: '2027-01-22', title: 'Thai Pongal Auspicious Month', tithi: 'Shukla Chaturthi', nakshatra: 'Uttara Phalguni', favorableFor: 'New Year Grand Weddings', lagnam: 'Rishabha (7:00 AM - 8:30 AM)' },
  { date: '2027-02-12', title: 'Vasant Panchami Muhurtham', tithi: 'Shukla Panchami', nakshatra: 'Ashwini', favorableFor: 'Spring Luxury Nuptials', lagnam: 'Mithuna (8:30 AM - 10:00 AM)' },
  { date: '2027-02-26', title: 'Maha Shivratri Blessings Muhurtham', tithi: 'Trayodashi', nakshatra: 'Mrigashira', favorableFor: 'Kalyanam & First Birthdays', lagnam: 'Karka (6:30 AM - 8:00 AM)' }
];

/**
 * Generate a 1-click Google Calendar Event Link
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const parseDateToIso = (dateStr: string, isEnd = false): string => {
    try {
      const cleanDate = dateStr.split('T')[0];
      const [year, month, day] = cleanDate.split('-');
      if (!year || !month || !day) return '20260901T090000Z';
      
      const startTime = isEnd ? '220000Z' : '090000Z';
      return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}T${startTime}`;
    } catch {
      return '20260901T090000Z';
    }
  };

  const startIso = parseDateToIso(event.startDate, false);
  const endIso = parseDateToIso(event.endDate || event.startDate, true);

  const title = encodeURIComponent(`Elysian Wedding: ${event.title}`);
  const details = encodeURIComponent(
    `${event.description}\n\n` +
    `• Service/Vendor: ${event.vendorName || 'Elysian Partner'}\n` +
    `• Contact: ${event.vendorPhone || '+1 (800) 844-WEDD'}\n` +
    `• Time Slot: ${event.timeWindow || 'Full Day Wedding Event'}\n` +
    `• Reference ID: ${event.referenceId || 'ELYSIAN-BK-2026'}\n\n` +
    `Managed with Elysian Wedlock Luxury Booking Engine`
  );
  const location = encodeURIComponent(event.location || 'India');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&sf=true&output=xml`;
}

/**
 * Generate iCal / Apple Calendar / Outlook .ics content string
 */
export function generateIcsContent(events: CalendarEventData[]): string {
  const formatIcsDate = (dateStr: string, isEnd = false): string => {
    try {
      const cleanDate = dateStr.split('T')[0];
      const [year, month, day] = cleanDate.split('-');
      const hour = isEnd ? '220000' : '090000';
      return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}T${hour}Z`;
    } catch {
      return '20260901T090000Z';
    }
  };

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let icsString = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elysian Wedlock//Wedding Calendar Sync 2.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Elysian Luxury Wedding Itinerary',
    'X-WR-TIMEZONE:Asia/Kolkata'
  ].join('\r\n');

  events.forEach((ev, idx) => {
    const uid = `elysian-${ev.referenceId || Date.now()}-${idx}@elysianwedlock.com`;
    const dtStart = formatIcsDate(ev.startDate, false);
    const dtEnd = formatIcsDate(ev.endDate || ev.startDate, true);

    const cleanSummary = (ev.title || 'Wedding Celebration').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const cleanLocation = (ev.location || 'India').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const cleanDesc = (
      `${ev.description}\\n\\n` +
      `Vendor: ${ev.vendorName || 'Elysian Verified Vendor'}\\n` +
      `Phone: ${ev.vendorPhone || '+1 (800) 844-WEDD'}\\n` +
      `Slot: ${ev.timeWindow || 'Full Event'}\\n` +
      `Ref: ${ev.referenceId || 'ELYSIAN'}`
    ).replace(/,/g, '\\,').replace(/;/g, '\\;');

    icsString += '\r\n' + [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:Elysian Wedding: ${cleanSummary}`,
      `DESCRIPTION:${cleanDesc}`,
      `LOCATION:${cleanLocation}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'DESCRIPTION:Reminder: Elysian Wedding Event Tomorrow',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  });

  icsString += '\r\nEND:VCALENDAR';
  return icsString;
}

/**
 * Trigger file download of .ics calendar file in the browser
 */
export function downloadIcsFile(events: CalendarEventData[] | CalendarEventData, filename = 'elysian-wedding-calendar.ics') {
  const eventList = Array.isArray(events) ? events : [events];
  const content = generateIcsContent(eventList);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert BookingRecord or BookingDetails to CalendarEventData
 */
export function bookingToCalendarEvent(booking: BookingRecord | BookingDetails): CalendarEventData {
  const eventDate = (booking as any).selectedDate || booking.eventDate || new Date().toISOString().split('T')[0];
  const title = (booking as any).serviceTitle || (booking as any).vendorName || 'Wedding Service';
  const location = (booking as any).location || 'Luxury Venue';
  const timeWindow = (booking as any).selectedTimeWindow || (booking as any).timeWindow || 'Full Day';
  const vendorName = (booking as any).vendorName || (booking as any).serviceTitle || 'Elysian Partner';
  const vendorPhone = (booking as any).clientPhone || '+1 (800) 844-WEDD';
  const referenceId = (booking as any).id || `ELYSIAN-${Date.now()}`;

  return {
    title,
    description: `Confirmed Elysian Wedlock booking for ${(booking as any).clientName || 'VIP Couple'}. Estimated: ₹${((booking as any).estimatedTotal || (booking as any).estimatedCost || 0).toLocaleString('en-IN')}`,
    location,
    startDate: eventDate,
    endDate: eventDate,
    timeWindow,
    vendorName,
    vendorPhone,
    referenceId
  };
}

/**
 * Check if a date collides with existing bookings or blocked dates
 */
export function checkSlotCollision(
  targetDate: string,
  existingBookings: BookingRecord[],
  blockedDates: string[] = []
): { hasCollision: boolean; reason?: string } {
  const cleanTarget = targetDate.split('T')[0];

  // Check blocked dates
  if (blockedDates.includes(cleanTarget)) {
    return { hasCollision: true, reason: 'Date is marked as blocked / unavailable by the vendor.' };
  }

  // Check existing confirmed bookings
  const conflicting = existingBookings.find(b => {
    const bDate = (b.selectedDate || b.eventDate || '').split('T')[0];
    return bDate === cleanTarget && b.status !== 'Cancelled';
  });

  if (conflicting) {
    return { 
      hasCollision: true, 
      reason: `Already booked for ${(conflicting as any).serviceTitle || 'another client'} (${conflicting.clientName}).` 
    };
  }

  return { hasCollision: false };
}
