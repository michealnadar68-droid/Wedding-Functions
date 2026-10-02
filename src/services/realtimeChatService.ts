import { db } from './databaseService';
import { ChatMessage } from '../types';

export type SocketStatus = 'connected' | 'connecting' | 'disconnected';

type MessageCallback = (message: ChatMessage) => void;
type StatusCallback = (status: SocketStatus) => void;

class RealtimeChatService {
  private status: SocketStatus = 'connected';
  private messageListeners: Set<MessageCallback> = new Set();
  private statusListeners: Set<StatusCallback> = new Set();
  private typingTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('elysian_chat_channel');
        this.channel.onmessage = (event) => {
          if (event.data?.type === 'NEW_MESSAGE') {
            this.notifyMessageListeners(event.data.message);
          }
        };
      } catch {
        // broadcastchannel fallback
      }
    }
  }

  getStatus(): SocketStatus {
    return this.status;
  }

  subscribeStatus(cb: StatusCallback): () => void {
    this.statusListeners.add(cb);
    cb(this.status);
    return () => this.statusListeners.delete(cb);
  }

  subscribeMessages(cb: MessageCallback): () => void {
    this.messageListeners.add(cb);
    return () => this.messageListeners.delete(cb);
  }

  private notifyMessageListeners(message: ChatMessage) {
    this.messageListeners.forEach((cb) => cb(message));
  }

  private notifyStatusListeners(status: SocketStatus) {
    this.status = status;
    this.statusListeners.forEach((cb) => cb(status));
  }

  // Send message from user and simulate real-time vendor acknowledgment + smart reply
  async sendUserMessage(conversationId: string, text: string): Promise<ChatMessage> {
    // 1. Record user message immediately
    const userMsg = db.sendMessage(conversationId, text, 'user');
    this.notifyMessageListeners(userMsg);

    if (this.channel) {
      this.channel.postMessage({ type: 'NEW_MESSAGE', message: userMsg });
    }

    // 2. Clear any existing typing timeout for this conversation
    if (this.typingTimeouts.has(conversationId)) {
      clearTimeout(this.typingTimeouts.get(conversationId)!);
    }

    // 3. Trigger simulated vendor typing indicator after a short delay
    const typingTimer = setTimeout(() => {
      db.setVendorTyping(conversationId, true);

      // 4. Generate context-aware vendor reply after 1.5 - 2.8s
      const replyDelay = 1600 + Math.random() * 1200;
      setTimeout(() => {
        db.setVendorTyping(conversationId, false);
        const replyText = this.generateVendorSmartResponse(conversationId, text);
        const vendorMsg = db.sendMessage(conversationId, replyText, 'vendor');
        this.notifyMessageListeners(vendorMsg);

        if (this.channel) {
          this.channel.postMessage({ type: 'NEW_MESSAGE', message: vendorMsg });
        }
      }, replyDelay);
    }, 600);

    this.typingTimeouts.set(conversationId, typingTimer);
    return userMsg;
  }

  // Smart context-aware vendor responses
  private generateVendorSmartResponse(conversationId: string, query: string): string {
    const convs = db.getConversations();
    const conv = convs.find((c) => c.id === conversationId);
    const q = query.toLowerCase();

    const vendorType = conv?.vendorType || 'hall';
    const vendorName = conv?.vendorName || 'Our Team';
    const contact = conv?.vendorContactName || 'Our Concierge';

    // Pricing & Quote inquiries
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('package') || q.includes('quote') || q.includes('discount')) {
      if (vendorType === 'hall') {
        return `Hello! ${vendorName} offers customized tiers starting at $8,500 for standard ballroom sessions, and up to $14,000 for our all-inclusive Royal Grand Banquet package (including lighting, green rooms & fountain courtyard access). Would you like me to reserve an itemized quotation for your estimated guest count?`;
      }
      if (vendorType === 'caterer') {
        return `Our multi-course banquet spreads range from $38 to $54 per plate, complete with live gourmet counters, signature desserts, and complimentary cutlery/silver service. If you have dietary preferences like strict Jain, Halal, or Vegan, we customize every menu at no extra fee!`;
      }
      if (vendorType === 'photographer') {
        return `Our packages begin at $2,400 for standard 8-hour single shooter coverage, up to $5,200 for our Master Diamond tier (3 cinematographers, 4K dual drone team, same-day teaser film & flush-mount Italian leather albums). Shall I share a PDF sample gallery?`;
      }
      return `Our custom decoration themes range between $4,500 and $9,500 including royal mandap structure, imported exotic florals, LED stage wash, and entrance arches. Everything is engineered to your venue dimensions!`;
    }

    // Availability / Date check
    if (q.includes('date') || q.includes('available') || q.includes('nov') || q.includes('dec') || q.includes('oct') || q.includes('jan') || q.includes('feb') || q.includes('2026') || q.includes('weekend')) {
      return `I just checked our master event calendar! We currently have auspicious time slots open for your target dates. Because peak wedding weekends fill quickly, I recommend locking your date hold using our 20% refundable deposit guarantee.`;
    }

    // Food / Dietary / Tasting inquiries
    if (q.includes('food') || q.includes('tasting') || q.includes('menu') || q.includes('jain') || q.includes('veg') || q.includes('vegan') || q.includes('halal') || q.includes('chef')) {
      return `We take tremendous pride in our culinary artistry! We offer complimentary 6-dish chef tasting sessions for prospective couples and immediate family before finalizing the menu. Would you like to schedule a tasting session this week?`;
    }

    // Capacity / Guest count / Rooms
    if (q.includes('capacity') || q.includes('guest') || q.includes('people') || q.includes('room') || q.includes('parking')) {
      return `We comfortably accommodate anywhere from 150 up to 1,500 guests with spacious banquet seating, valet parking for 250+ vehicles, and 2 luxury bridal suites with private restrooms.`;
    }

    // Photography style / Deliverables / Albums
    if (q.includes('drone') || q.includes('video') || q.includes('trailer') || q.includes('album') || q.includes('photo') || q.includes('camera')) {
      return `We shoot on RED Cinema & Sony FX3 systems with certified FAA drone pilots. Raw photos are delivered within 7 business days in our private cloud gallery, and full 4K cinematic highlight reels are completed in 3 weeks!`;
    }

    // Default polite vendor follow-up
    return `Thank you for reaching out to ${vendorName}! ${contact} is here to ensure every detail of your special day is executed with perfection. Would you like to schedule a quick venue walkthrough, arrange a phone call, or lock in your auspicious date?`;
  }
}

export const realtimeChat = new RealtimeChatService();
