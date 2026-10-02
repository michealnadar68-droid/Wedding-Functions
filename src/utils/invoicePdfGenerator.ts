import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  invoiceNumber: string;
  orderId: string;
  paymentId: string;
  paymentMethod: string;
  paymentDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceTitle: string;
  serviceType: string;
  serviceSubtitle?: string;
  eventDate: string;
  timeWindow?: string;
  guestCount?: number;
  baseAmount: number;
  taxAmount: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount: number;
  amountPaid: number;
  remainingBalance: number;
  paymentType: 'advance_deposit' | 'full_payment' | 'pay_at_venue';
}

/**
 * Generate a luxury Tax Invoice & Booking Payment Receipt PDF
 */
export function generateInvoicePdf(data: InvoiceData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Colors
  const darkBg: [number, number, number] = [26, 26, 26]; // #1A1A1A
  const goldAccent: [number, number, number] = [197, 160, 89]; // #C5A059
  const textDark: [number, number, number] = [40, 40, 40];
  const textMuted: [number, number, number] = [110, 110, 110];

  // Header Banner
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent bar
  doc.setFillColor(...goldAccent);
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Brand Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('ELYSIAN WEDLOCK', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(197, 160, 89);
  doc.text('ROYAL VIVAH & LUXURY CELEBRATION DIRECTORY', 14, 25);
  doc.setTextColor(200, 200, 200);
  doc.text('256-Bit Escrow Secured • Pan-India Verified Venues & Vendors', 14, 31);

  // Invoice Title on Right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TAX INVOICE & RECEIPT', pageWidth - 14, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(197, 160, 89);
  doc.text(`INVOICE: ${data.invoiceNumber}`, pageWidth - 14, 24, { align: 'right' });
  doc.setTextColor(220, 220, 220);
  doc.text(`DATE: ${data.paymentDate || new Date().toLocaleDateString('en-IN')}`, pageWidth - 14, 30, { align: 'right' });
  doc.text(`STATUS: PAYMENT AUTHORIZED`, pageWidth - 14, 36, { align: 'right' });

  // Bill To & Vendor Info Section
  let yPos = 54;

  // Bill To Box
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, yPos, (pageWidth - 34) / 2, 38, 3, 3, 'F');
  doc.setDrawColor(229, 224, 213);
  doc.roundedRect(14, yPos, (pageWidth - 34) / 2, 38, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...goldAccent);
  doc.text('CLIENT / RESERVATION HOLDER', 19, yPos + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkBg);
  doc.text(data.clientName || 'Valued Couple / Host', 19, yPos + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text(`Email: ${data.clientEmail || 'N/A'}`, 19, yPos + 20);
  doc.text(`Phone: ${data.clientPhone || 'N/A'}`, 19, yPos + 26);
  doc.text(`Event Date: ${data.eventDate || 'Confirmed'}`, 19, yPos + 32);

  // Escrow & Payment Details Box
  const rightBoxX = 14 + (pageWidth - 34) / 2 + 6;
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(rightBoxX, yPos, (pageWidth - 34) / 2, 38, 3, 3, 'F');
  doc.setDrawColor(229, 224, 213);
  doc.roundedRect(rightBoxX, yPos, (pageWidth - 34) / 2, 38, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...goldAccent);
  doc.text('ESCROW & PAYMENT DETAILS', rightBoxX + 5, yPos + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text(`Razorpay Payment ID:`, rightBoxX + 5, yPos + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.paymentId, rightBoxX + 5 + 40, yPos + 14);

  doc.setFont('helvetica', 'normal');
  doc.text(`Razorpay Order ID:`, rightBoxX + 5, yPos + 20);
  doc.setFont('helvetica', 'bold');
  doc.text(data.orderId, rightBoxX + 5 + 40, yPos + 20);

  doc.setFont('helvetica', 'normal');
  doc.text(`Payment Method:`, rightBoxX + 5, yPos + 26);
  doc.setFont('helvetica', 'bold');
  doc.text(data.paymentMethod.toUpperCase(), rightBoxX + 5 + 40, yPos + 26);

  doc.setFont('helvetica', 'normal');
  doc.text(`Escrow Guarantee:`, rightBoxX + 5, yPos + 32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 106, 66);
  doc.text('100% Date Protection Active', rightBoxX + 5 + 40, yPos + 32);

  // Line items table
  yPos += 45;

  const tableBody = [
    [
      `1`,
      `${data.serviceTitle}\nCategory: ${data.serviceType.toUpperCase()} ${data.serviceSubtitle ? '• ' + data.serviceSubtitle : ''}\nEvent Window: ${data.timeWindow || 'Full Day Access'}${data.guestCount ? ` • ${data.guestCount} Guests` : ''}`,
      `₹${data.baseAmount.toLocaleString('en-IN')}`,
      `1`,
      `₹${data.baseAmount.toLocaleString('en-IN')}`
    ]
  ];

  if (data.discountAmount && data.discountAmount > 0) {
    tableBody.push([
      `2`,
      `Promotional Coupon Discount (${data.couponCode || 'APPLIED'})`,
      `-₹${data.discountAmount.toLocaleString('en-IN')}`,
      `1`,
      `-₹${data.discountAmount.toLocaleString('en-IN')}`
    ]);
  }

  tableBody.push([
    `${tableBody.length + 1}`,
    `GST & Royal Vivah Concierge Coordination (5%)`,
    `₹${data.taxAmount.toLocaleString('en-IN')}`,
    `1`,
    `₹${data.taxAmount.toLocaleString('en-IN')}`
  ]);

  tableBody.push([
    `${tableBody.length + 1}`,
    `Elysian Escrow Guarantee & Advance Date Protection`,
    `FREE`,
    `1`,
    `₹0`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Service Description / Package Details', 'Rate', 'Qty', 'Amount (INR)']],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: darkBg,
      textColor: goldAccent,
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    bodyStyles: {
      textColor: textDark,
      fontSize: 8,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 26, halign: 'right' },
      3: { cellWidth: 12, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // Financial Totals Summary Box
  const summaryBoxWidth = 85;
  const summaryBoxX = pageWidth - 14 - summaryBoxWidth;

  doc.setFillColor(250, 248, 245);
  doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, 48, 2, 2, 'F');
  doc.setDrawColor(229, 224, 213);
  doc.roundedRect(summaryBoxX, finalY, summaryBoxWidth, 48, 2, 2, 'S');

  let rowY = finalY + 7;
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text('Gross Total Value:', summaryBoxX + 5, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(`₹${(data.baseAmount + data.taxAmount).toLocaleString('en-IN')}`, pageWidth - 19, rowY, { align: 'right' });

  if (data.discountAmount && data.discountAmount > 0) {
    rowY += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(36, 106, 66);
    doc.text(`Coupon Savings (${data.couponCode}):`, summaryBoxX + 5, rowY);
    doc.setFont('helvetica', 'bold');
    doc.text(`-₹${data.discountAmount.toLocaleString('en-IN')}`, pageWidth - 19, rowY, { align: 'right' });
  }

  rowY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Net Estimated Booking Value:', summaryBoxX + 5, rowY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text(`₹${data.totalAmount.toLocaleString('en-IN')}`, pageWidth - 19, rowY, { align: 'right' });

  rowY += 7;
  doc.setDrawColor(229, 224, 213);
  doc.line(summaryBoxX + 4, rowY - 2, pageWidth - 18, rowY - 2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 106, 66);
  doc.text('AMOUNT PAID TODAY (CAPTURED):', summaryBoxX + 5, rowY + 2);
  doc.setFontSize(9.5);
  doc.text(`₹${data.amountPaid.toLocaleString('en-IN')}`, pageWidth - 19, rowY + 2, { align: 'right' });

  rowY += 8;
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text('Remaining Due on Event Day:', summaryBoxX + 5, rowY + 2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(197, 160, 89);
  doc.text(`₹${data.remainingBalance.toLocaleString('en-IN')}`, pageWidth - 19, rowY + 2, { align: 'right' });

  // Security & Escrow Guarantee Seal
  const sealBoxWidth = pageWidth - 34 - summaryBoxWidth;
  doc.setFillColor(250, 248, 245);
  doc.roundedRect(14, finalY, sealBoxWidth, 48, 2, 2, 'F');
  doc.setDrawColor(229, 224, 213);
  doc.roundedRect(14, finalY, sealBoxWidth, 48, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...goldAccent);
  doc.text('🛡️ ELYSIAN ESCROW HOLD GUARANTEE', 19, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textDark);
  doc.text('• Your booking advance is locked securely in third-party escrow.', 19, finalY + 16);
  doc.text('• Payout is released to the verified vendor only on milestone day.', 19, finalY + 23);
  doc.text('• 100% refund guarantee applies in accordance with cancellation policy.', 19, finalY + 30);
  doc.text('• For assistance: concierge@elysianwedlock.com | +91 98200 12345', 19, finalY + 37);

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text('This is an electronically generated official tax invoice and payment authorization receipt. No physical signature is required.', 14, pageHeight - 12);
  doc.text('Elysian Wedlock Escrow Services Private Limited • GSTIN: 27AABCE1234F1Z8', pageWidth - 14, pageHeight - 12, { align: 'right' });

  // Save the PDF
  const filename = `Invoice_${data.invoiceNumber}_ElysianWedlock.pdf`;
  doc.save(filename);
}
