// Mock Email Notification Service
// Simulates an automated transactional email dispatch engine for booking confirmations

export interface BookingEmailPayload {
  bookingReference: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  serviceTitle: string;
  serviceType: string;
  serviceSubtitle?: string;
  packageTier?: string;
  eventDate: string;
  timeWindow?: string;
  guestCount?: number;
  totalAmount: number;
  depositPaid?: number;
  paymentId?: string;
  location?: string;
  specialRequests?: string;
}

export interface SentEmailRecord {
  id: string;
  sentAt: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  previewSnippet: string;
  bookingReference: string;
  eventDate: string;
  serviceTitle: string;
  serviceType: string;
  packageTier: string;
  totalAmount: number;
  depositPaid: number;
  paymentId: string;
  timeWindow: string;
  guestCount: number;
  status: 'delivered';
  deliveryProvider: string;
  htmlContent: string;
}

const EMAIL_STORAGE_KEY = 'elysian_sent_emails_db';

class MockEmailNotificationService {
  private getStoredEmails(): SentEmailRecord[] {
    try {
      const data = localStorage.getItem(EMAIL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredEmails(emails: SentEmailRecord[]): void {
    try {
      localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save sent emails to localStorage', e);
    }
  }

  /**
   * Simulates sending a formal 'Booking Confirmation' email trigger
   * upon successful reservation and date lock.
   */
  async sendBookingConfirmationEmail(payload: BookingEmailPayload): Promise<SentEmailRecord> {
    // Realistic micro-latency for simulated SMTP / transactional email trigger
    await new Promise((resolve) => setTimeout(resolve, 350));

    const emailId = `mail_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const formattedSentAt = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const targetEmail = payload.recipientEmail?.trim() || 'michealnadar68@gmail.com';
    const clientName = payload.recipientName?.trim() || 'Valued Couple & Family';
    const refId = payload.bookingReference || `RES-${Date.now().toString().slice(-6)}`;
    const formattedDate = payload.eventDate;
    const formattedTotal = `₹${(payload.totalAmount || 0).toLocaleString('en-IN')}`;
    const formattedDeposit = payload.depositPaid ? `₹${payload.depositPaid.toLocaleString('en-IN')}` : formattedTotal;
    const packageTier = payload.packageTier || 'Royal Heritage Tier';
    const timeWindow = payload.timeWindow || 'Full Day Access (Muhurtham & Reception)';
    const guestCount = payload.guestCount || 500;
    const paymentId = payload.paymentId || `pay_rzp_${Math.random().toString(36).substring(2, 9)}`;

    const subject = `💍 Booking Confirmed: ${payload.serviceTitle} on ${formattedDate} [Ref: #${refId}]`;
    const previewSnippet = `Dear ${clientName}, your reservation for ${payload.serviceTitle} on ${formattedDate} has been confirmed & locked in 100% Escrow.`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FDFCFB; border: 1px solid #E5E0D5; border-radius: 16px; overflow: hidden; color: #1A1A1A;">
        <div style="background-color: #1A1A1A; padding: 24px; text-align: center; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #C5A059; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 700;">ELYSIAN WEDLOCK</h1>
          <p style="color: #A8A29E; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px;">Haute Wedding & Celebration Marketplace</p>
        </div>

        <div style="padding: 28px 24px;">
          <div style="display: inline-block; background-color: #EBF5EF; color: #246A42; border: 1px solid #246A42; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; margin-bottom: 16px;">
            ✓ OFFICIAL ESCROW CONFIRMATION
          </div>

          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #1A1A1A;">
            Congratulations, ${clientName}!
          </h2>
          <p style="color: #666666; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
            Your celebration reservation for <strong>${payload.serviceTitle}</strong> has been officially confirmed. The date <strong>${formattedDate}</strong> is now completely locked in our system and cannot be double-booked by any other customer.
          </p>

          <div style="background-color: #F9F7F2; border: 1px solid #E5E0D5; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Booking Reference:</td>
                <td style="padding: 6px 0; text-align: right; font-family: monospace; font-weight: 700; color: #8C6A24;">#${refId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Confirmed Service:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #1A1A1A;">${payload.serviceTitle}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Reserved Event Date:</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #246A42;">${formattedDate} (Locked)</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Time Window:</td>
                <td style="padding: 6px 0; text-align: right; color: #1A1A1A;">${timeWindow}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Guest Capacity:</td>
                <td style="padding: 6px 0; text-align: right; color: #1A1A1A;">${guestCount} Guests</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #888888; font-weight: 600;">Package Tier:</td>
                <td style="padding: 6px 0; text-align: right; color: #1A1A1A;">${packageTier}</td>
              </tr>
              <tr style="border-top: 1px dashed #E5E0D5;">
                <td style="padding: 10px 0 4px 0; color: #888888; font-weight: 600;">Total Quotation:</td>
                <td style="padding: 10px 0 4px 0; text-align: right; font-weight: 700; font-size: 15px; color: #1A1A1A; font-family: monospace;">${formattedTotal}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888888; font-weight: 600;">Deposit Secured:</td>
                <td style="padding: 4px 0; text-align: right; font-weight: 700; color: #246A42; font-family: monospace;">${formattedDeposit}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #888888; font-weight: 600;">Payment Transaction:</td>
                <td style="padding: 4px 0; text-align: right; font-family: monospace; font-size: 11px; color: #666666;">${paymentId}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #F7F3EB; border-left: 4px solid #C5A059; padding: 12px 16px; border-radius: 4px 8px 8px 4px; font-size: 12px; margin-bottom: 24px;">
            <strong style="color: #8C6A24; display: block; margin-bottom: 4px;">🛡️ 100% Escrow Protection</strong>
            <span style="color: #666666;">Your advance payment is held safely in Elysian Wedlock Escrow. Funds will only be released to the vendor following milestone verification on your wedding date.</span>
          </div>

          <div style="text-align: center; padding-top: 8px;">
            <p style="color: #888888; font-size: 11px; margin: 0;">
              Need changes or assistance? Call your Dedicated VIP Concierge: <strong>+1 (800) 844-WEDD</strong> or reply directly to this email.
            </p>
          </div>
        </div>

        <div style="background-color: #F9F7F2; padding: 16px 24px; text-align: center; border-top: 1px solid #E5E0D5; font-size: 11px; color: #888888;">
          © 2026 Elysian Wedlock Luxury Celebrations Ltd. All rights reserved.<br />
          Sent to <strong>${targetEmail}</strong>
        </div>
      </div>
    `;

    const record: SentEmailRecord = {
      id: emailId,
      sentAt: formattedSentAt,
      recipientEmail: targetEmail,
      recipientName: clientName,
      subject,
      previewSnippet,
      bookingReference: refId,
      eventDate: formattedDate,
      serviceTitle: payload.serviceTitle,
      serviceType: payload.serviceType,
      packageTier,
      totalAmount: payload.totalAmount,
      depositPaid: payload.depositPaid || payload.totalAmount,
      paymentId,
      timeWindow,
      guestCount,
      status: 'delivered',
      deliveryProvider: 'Elysian Cloud Transactional Mail Engine (Simulated)',
      htmlContent
    };

    const currentEmails = this.getStoredEmails();
    this.saveStoredEmails([record, ...currentEmails]);

    // Dispatch system-wide event for reactive UI components
    window.dispatchEvent(
      new CustomEvent('elysian_email_sent', {
        detail: record
      })
    );

    return record;
  }

  getSentEmails(): SentEmailRecord[] {
    return this.getStoredEmails();
  }

  getSentEmailByBookingId(bookingReference: string): SentEmailRecord | undefined {
    return this.getStoredEmails().find((e) => e.bookingReference === bookingReference);
  }

  clearSentEmails(): void {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
  }
}

export const mockEmailService = new MockEmailNotificationService();
