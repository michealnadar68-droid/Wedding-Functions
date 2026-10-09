// Mock Email and SMS Notification Service
// Simulates automated transactional email & SMS OTP dispatch engine for booking confirmations and security verifications

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
  recipientPhone?: string;
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

export interface SentSmsRecord {
  id: string;
  sentAt: string;
  recipientPhone: string;
  recipientName?: string;
  message: string;
  type: 'otp' | 'booking_confirmation';
  otpCode?: string;
  bookingReference?: string;
  status: 'delivered';
  carrier: string;
}

export interface OtpDispatchPayload {
  recipientPhone: string;
  recipientEmail: string;
  recipientName?: string;
  serviceTitle?: string;
  amount?: number;
  otpCode?: string;
}

export interface OtpDispatchResult {
  otpCode: string;
  smsRecord: SentSmsRecord;
  emailRecord: SentEmailRecord;
}

const EMAIL_STORAGE_KEY = 'elysian_sent_emails_db';
const SMS_STORAGE_KEY = 'elysian_sent_sms_db';
const OTP_STORAGE_KEY = 'elysian_last_otp_state';

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

  private getStoredSms(): SentSmsRecord[] {
    try {
      const data = localStorage.getItem(SMS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveStoredSms(smsList: SentSmsRecord[]): void {
    try {
      localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(smsList.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to save sent SMS to localStorage', e);
    }
  }

  /**
   * Simulates sending a secure 6-digit OTP to BOTH Phone Number (SMS) AND Email
   */
  async sendOtpToPhoneAndEmail(payload: OtpDispatchPayload): Promise<OtpDispatchResult> {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const generatedOtp = payload.otpCode || '492810';
    const now = new Date();
    const formattedSentAt = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const targetPhone = payload.recipientPhone?.trim() || '+91 98200 12345';
    const targetEmail = payload.recipientEmail?.trim() || 'michealnadar68@gmail.com';
    const clientName = payload.recipientName?.trim() || 'Valued Guest';
    const amountStr = payload.amount ? `₹${payload.amount.toLocaleString('en-IN')}` : 'your reservation payment';
    const serviceName = payload.serviceTitle || 'Elysian Wedlock Escrow';

    // 1. Create SMS Record
    const smsId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const smsMessage = `[Elysian Wedlock] Your 2FA security OTP is ${generatedOtp}. Use this code to authorize ${amountStr} for ${serviceName}. Valid for 5 minutes. Do not share.`;
    
    const smsRecord: SentSmsRecord = {
      id: smsId,
      sentAt: formattedSentAt,
      recipientPhone: targetPhone,
      recipientName: clientName,
      message: smsMessage,
      type: 'otp',
      otpCode: generatedOtp,
      status: 'delivered',
      carrier: 'Elysian Secure Telecom Gateway (AirTel/Jio Priority Route)'
    };

    // 2. Create Email Record
    const emailId = `mail_otp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const subject = `🔐 Elysian Security: Your OTP Verification Code is ${generatedOtp}`;
    const previewSnippet = `Your verification code is ${generatedOtp} for ${amountStr} on Elysian Wedlock.`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background-color: #FDFCFB; border: 1px solid #E5E0D5; border-radius: 16px; overflow: hidden; color: #1A1A1A;">
        <div style="background-color: #1A1A1A; padding: 20px; text-align: center; border-bottom: 2px solid #C5A059;">
          <h1 style="color: #C5A059; margin: 0; font-size: 22px; letter-spacing: 2px; font-weight: 700;">ELYSIAN WEDLOCK</h1>
          <p style="color: #A8A29E; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Security & 2FA Bank Authentication</p>
        </div>
        <div style="padding: 28px 24px; text-align: center;">
          <div style="display: inline-block; background-color: #FEF3C7; color: #92400E; border: 1px solid #FCD34D; border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 700; margin-bottom: 16px;">
            ONE-TIME VERIFICATION CODE
          </div>
          <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #1A1A1A;">
            Hello ${clientName},
          </h2>
          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 0 0 20px 0;">
            Use the 6-digit verification code below to authorize your transaction of <strong>${amountStr}</strong> for <strong>${serviceName}</strong>.
          </p>
          <div style="background-color: #1A1A1A; border: 2px solid #C5A059; border-radius: 12px; padding: 18px; margin: 0 auto 20px auto; max-width: 260px;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #C5A059; display: block;">
              ${generatedOtp}
            </span>
            <span style="font-size: 10px; color: #A8A29E; text-transform: uppercase; letter-spacing: 1px; display: block; margin-top: 4px;">
              Valid for 5 minutes
            </span>
          </div>
          <p style="color: #888888; font-size: 11px; margin: 0;">
            This OTP was also dispatched via SMS to <strong>${targetPhone}</strong>.<br />
            If you did not initiate this reservation, please contact our concierge immediately at <strong>+1 (800) 844-WEDD</strong>.
          </p>
        </div>
        <div style="background-color: #F9F7F2; padding: 12px 20px; text-align: center; border-top: 1px solid #E5E0D5; font-size: 11px; color: #888888;">
          Dispatched to <strong>${targetEmail}</strong> & <strong>${targetPhone}</strong>
        </div>
      </div>
    `;

    const emailRecord: SentEmailRecord = {
      id: emailId,
      sentAt: formattedSentAt,
      recipientEmail: targetEmail,
      recipientName: clientName,
      subject,
      previewSnippet,
      bookingReference: 'AUTH-2FA',
      eventDate: now.toISOString().split('T')[0],
      serviceTitle: serviceName,
      serviceType: 'security',
      packageTier: '2FA Auth',
      totalAmount: payload.amount || 0,
      depositPaid: payload.amount || 0,
      paymentId: 'otp_auth',
      timeWindow: 'Immediate',
      guestCount: 0,
      status: 'delivered',
      deliveryProvider: 'Elysian Secure Dispatch Engine (Dual SMS + Email)',
      htmlContent
    };

    // Save and dispatch
    const storedSms = this.getStoredSms();
    this.saveStoredSms([smsRecord, ...storedSms]);

    const storedEmails = this.getStoredEmails();
    this.saveStoredEmails([emailRecord, ...storedEmails]);

    try {
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify({
        otpCode: generatedOtp,
        phone: targetPhone,
        email: targetEmail,
        timestamp: Date.now()
      }));
    } catch {
      // Ignore
    }

    // Trigger window events for reactive notifications
    window.dispatchEvent(new CustomEvent('elysian_otp_sent', { detail: { otpCode: generatedOtp, smsRecord, emailRecord } }));
    window.dispatchEvent(new CustomEvent('elysian_sms_sent', { detail: smsRecord }));
    window.dispatchEvent(new CustomEvent('elysian_email_sent', { detail: emailRecord }));

    return { otpCode: generatedOtp, smsRecord, emailRecord };
  }

  /**
   * Simulates sending a Booking Confirmation SMS to the recipient's phone number
   */
  async sendBookingConfirmationSms(payload: BookingEmailPayload): Promise<SentSmsRecord> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const smsId = `sms_conf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const formattedSentAt = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const targetPhone = payload.recipientPhone?.trim() || '+91 98200 12345';
    const clientName = payload.recipientName?.trim() || 'Valued Couple';
    const refId = payload.bookingReference || `RES-${Date.now().toString().slice(-6)}`;
    const formattedDate = payload.eventDate;
    const formattedDeposit = payload.depositPaid ? `₹${payload.depositPaid.toLocaleString('en-IN')}` : `₹${(payload.totalAmount || 0).toLocaleString('en-IN')}`;

    const smsMessage = `💍 Elysian Wedlock: Congratulations ${clientName}! Reservation #${refId} for "${payload.serviceTitle}" on ${formattedDate} is officially confirmed & locked in 100% Escrow. Deposit: ${formattedDeposit}. VIP Concierge: +1 (800) 844-WEDD.`;

    const smsRecord: SentSmsRecord = {
      id: smsId,
      sentAt: formattedSentAt,
      recipientPhone: targetPhone,
      recipientName: clientName,
      message: smsMessage,
      type: 'booking_confirmation',
      bookingReference: refId,
      status: 'delivered',
      carrier: 'Elysian High-Priority SMS Gateway (India Tier 1 Route)'
    };

    const storedSms = this.getStoredSms();
    this.saveStoredSms([smsRecord, ...storedSms]);

    window.dispatchEvent(new CustomEvent('elysian_sms_sent', { detail: smsRecord }));

    return smsRecord;
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
      recipientPhone: payload.recipientPhone || '+91 98200 12345',
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

  getSentSms(): SentSmsRecord[] {
    return this.getStoredSms();
  }

  getSentSmsByBookingId(bookingReference: string): SentSmsRecord | undefined {
    return this.getStoredSms().find((s) => s.bookingReference === bookingReference);
  }

  getLastDispatchedOtp(): { otpCode: string; phone: string; email: string; timestamp: number } | null {
    try {
      const data = localStorage.getItem(OTP_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clearSentEmails(): void {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
  }

  clearSentSms(): void {
    localStorage.removeItem(SMS_STORAGE_KEY);
  }

  clearAllNotifications(): void {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
    localStorage.removeItem(SMS_STORAGE_KEY);
    localStorage.removeItem(OTP_STORAGE_KEY);
  }
}

export const mockEmailService = new MockEmailNotificationService();
export const mockNotificationService = mockEmailService;
