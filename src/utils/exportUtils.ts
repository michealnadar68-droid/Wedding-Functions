import { BookingRecord } from '../types';

/**
 * Convert Booking Records into Excel-ready CSV format
 */
export function exportBookingsToCsv(bookings: BookingRecord[], filename = 'elysian-bookings-report.csv') {
  if (!bookings || bookings.length === 0) {
    alert('No bookings available to export.');
    return;
  }

  const headers = [
    'Booking ID',
    'Date Placed',
    'Event Date',
    'Time Window',
    'Category',
    'Vendor / Service Title',
    'Client Name',
    'Client Email',
    'Client Phone',
    'Guest Count',
    'Package Tier',
    'Base Amount (INR)',
    'Estimated Total (INR)',
    'Deposit Paid (INR)',
    'Balance Due (INR)',
    'Booking Status',
    'Payment Mode',
    'Special Requests'
  ];

  const escapeCsvField = (field: any): string => {
    if (field === null || field === undefined) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = bookings.map(b => {
    const total = b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || (b as any).itemPrice || 0;
    const deposit = b.depositPaid || (b as any).depositAmount || Math.round(total * 0.25);
    const balance = total - deposit;

    return [
      escapeCsvField(b.id),
      escapeCsvField(b.createdAt ? new Date(b.createdAt).toLocaleDateString('en-IN') : 'N/A'),
      escapeCsvField(b.eventDate || (b as any).selectedDate || 'N/A'),
      escapeCsvField(b.timeWindow || (b as any).selectedTimeWindow || 'Full Day'),
      escapeCsvField(b.serviceType ? b.serviceType.toUpperCase() : 'ALL'),
      escapeCsvField(b.serviceTitle || (b as any).vendorName || 'Elysian Wedding Service'),
      escapeCsvField(b.clientName || 'N/A'),
      escapeCsvField(b.clientEmail || 'N/A'),
      escapeCsvField(b.clientPhone || 'N/A'),
      escapeCsvField(b.guestCount || 'N/A'),
      escapeCsvField(b.packageTier || (b as any).packageName || 'Standard Royal'),
      escapeCsvField(b.basePrice || (b as any).itemPrice || 0),
      escapeCsvField(total),
      escapeCsvField(deposit),
      escapeCsvField(balance),
      escapeCsvField((b.status || 'Confirmed').toUpperCase()),
      escapeCsvField((b as any).paymentMode || 'Net Banking / Escrow UPI'),
      escapeCsvField(b.specialRequests || 'None')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
 * Export Bookings as clean formatted JSON
 */
export function exportBookingsToJson(bookings: BookingRecord[], filename = 'elysian-bookings-ledger.json') {
  if (!bookings || bookings.length === 0) {
    alert('No bookings available to export.');
    return;
  }

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    platform: 'Elysian Wedlock Luxury Booking Engine',
    totalRecords: bookings.length,
    totalRevenueInr: bookings.reduce((sum, b) => sum + (b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0), 0),
    bookings: bookings
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
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
 * Open a luxury printable HTML report / Invoice Summary in a new popup or printable frame
 */
export function printBookingSummaryReport(bookings: BookingRecord[], title = 'Elysian Wedlock - Master Bookings Report') {
  if (!bookings || bookings.length === 0) {
    alert('No bookings to print.');
    return;
  }

  const totalAmount = bookings.reduce((sum, b) => sum + (b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0), 0);
  const totalDeposit = bookings.reduce((sum, b) => sum + (b.depositPaid || (b as any).depositAmount || Math.round((b.totalAmount || b.estimatedTotal || 0) * 0.25)), 0);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate printable report.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap');
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #1A1A1A;
            background: #FFFFFF;
            padding: 40px;
            margin: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #C5A059;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            font-weight: 700;
            color: #1A1A1A;
            letter-spacing: 2px;
          }
          .logo span {
            color: #C5A059;
          }
          .meta {
            text-align: right;
            font-size: 12px;
            color: #666666;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 30px;
          }
          .card {
            background: #FDFBF7;
            border: 1px solid #E5E0D5;
            padding: 16px;
            border-radius: 8px;
          }
          .card-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #8C6A24;
            font-weight: 600;
          }
          .card-value {
            font-size: 22px;
            font-weight: 700;
            margin-top: 6px;
            color: #1A1A1A;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 30px;
          }
          th {
            background: #1A1A1A;
            color: #D5CEBE;
            text-align: left;
            padding: 10px 12px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #E5E0D5;
          }
          tr:nth-child(even) {
            background: #FAF8F5;
          }
          .status {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }
          .status-confirmed { background: #E6F4EA; color: #137333; }
          .status-pending { background: #FEF7E0; color: #B06000; }
          .status-cancelled { background: #FCE8E6; color: #C5221F; }
          .footer {
            border-top: 1px solid #E5E0D5;
            padding-top: 20px;
            font-size: 11px;
            color: #888888;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">ELYSIAN <span>WEDLOCK</span></div>
            <div style="font-size: 12px; color: #737373; margin-top: 4px;">Luxury Celebration Ledger & Verified Itinerary</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div><strong>Platform Concierge:</strong> +1 (800) 844-WEDD</div>
            <div><strong>Status:</strong> Official Audit Ledger</div>
          </div>
        </div>

        <div class="summary-cards">
          <div class="card">
            <div class="card-label">Total Bookings</div>
            <div class="card-value">${bookings.length} Events</div>
          </div>
          <div class="card">
            <div class="card-label">Gross Commitment</div>
            <div class="card-value">₹${totalAmount.toLocaleString('en-IN')}</div>
          </div>
          <div class="card">
            <div class="card-label">Escrow Deposits Realized</div>
            <div class="card-value">₹${totalDeposit.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID & Service</th>
              <th>Client Details</th>
              <th>Event Date & Slot</th>
              <th>Package Tier</th>
              <th>Estimated Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr>
                <td>
                  <strong>${b.serviceTitle || (b as any).vendorName || 'Elysian Service'}</strong><br/>
                  <span style="color: #888; font-size: 10px;">#${b.id} • ${b.serviceType ? b.serviceType.toUpperCase() : 'VENUE'}</span>
                </td>
                <td>
                  ${b.clientName || 'VIP Guest'}<br/>
                  <span style="color: #666; font-size: 11px;">${b.clientPhone || ''}</span>
                </td>
                <td>
                  <strong>${b.eventDate || (b as any).selectedDate || 'Upcoming'}</strong><br/>
                  <span style="color: #666; font-size: 11px;">${b.timeWindow || (b as any).selectedTimeWindow || 'Full Day'}</span>
                </td>
                <td>${b.packageTier || (b as any).packageName || 'Royal Celebration'}</td>
                <td><strong>₹${((b.totalAmount || b.estimatedTotal || b.basePrice || (b as any).estimatedCost || 0)).toLocaleString('en-IN')}</strong></td>
                <td>
                  <span class="status status-${b.status || 'confirmed'}">${b.status || 'confirmed'}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Elysian Wedlock Escrow Guarantee • All bookings backed by 100% verified luxury partner guarantee and replacement policy.</p>
          <p>© 2026 Elysian Wedlock Private Limited. Confidential Client Ledger.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
