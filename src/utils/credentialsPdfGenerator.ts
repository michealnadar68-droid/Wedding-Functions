import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ALL_WEBSITE_CREDENTIALS } from '../data/credentialsData';

export function generateCredentialsPdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Premium Header Banner
  doc.setFillColor(26, 26, 26); // #1A1A1A
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold Accent Strip
  doc.setFillColor(197, 160, 89); // #C5A059
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Brand Header Text
  doc.setTextColor(197, 160, 89);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ELYSIAN WEDLOCK', 14, 16);

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('CONFIDENTIAL CREDENTIALS REGISTRY & ACCESS KEYS', 14, 23);

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}  |  Classification: Restricted Master Access`, 14, 30);
  doc.text('Notice: Passwords are protected and must only be accessed by authorized platform evaluators.', 14, 35);

  // Table Data Preparation
  const tableRows = ALL_WEBSITE_CREDENTIALS.map((acc, index) => {
    return [
      (index + 1).toString(),
      `${acc.roleLabel}\n(${acc.role.toUpperCase()})`,
      `${acc.name}\n${acc.businessName ? `• ${acc.businessName}` : `• ${acc.location}`}`,
      acc.email,
      acc.password,
      acc.altPassword || 'admin123',
      acc.permissions.slice(0, 2).map(p => `• ${p}`).join('\n')
    ];
  });

  // Render Table
  autoTable(doc, {
    startY: 48,
    head: [['#', 'Role / Category', 'Account Name & Unit', 'User ID / Email', 'Primary Password', 'Quick Key', 'Permissions & Capabilities']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [26, 26, 26],
      textColor: [197, 160, 89],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 30, 30],
      cellPadding: 2.5,
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: [250, 248, 245],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' },
      2: { cellWidth: 38 },
      3: { cellWidth: 36, fontStyle: 'bold' },
      4: { cellWidth: 26, fontStyle: 'bold', textColor: [158, 54, 54] },
      5: { cellWidth: 16, fontStyle: 'italic', textColor: [100, 100, 100] },
      6: { cellWidth: 'auto' },
    },
    margin: { top: 48, left: 10, right: 10, bottom: 20 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(245, 240, 230);
      doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

      doc.setFontSize(7.5);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text('Elysian Wedlock • Royal Vivah & Pan-India Wedding Directory • All Rights Reserved', 14, pageHeight - 5);
      doc.text(`Page ${data.pageNumber} of ${doc.getNumberOfPages()}`, pageWidth - 25, pageHeight - 5);
    }
  });

  // Save the PDF
  doc.save('Elysian_Wedlock_Confidential_Credentials.pdf');
}
