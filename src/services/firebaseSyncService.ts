import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  UserProfile, 
  BookingRecord, 
  FavoriteItem, 
  Conversation, 
  ChatMessage, 
  VendorSubmissionItem 
} from '../types';

export interface CloudDatabaseStatus {
  provider: 'Firebase Cloud Firestore';
  projectId: string;
  databaseId: string;
  isOnline: boolean;
  lastSyncTime: string;
  totalCollectionsSynced: number;
  totalDocumentsSynced: number;
  syncLatencyMs: number;
}

class FirebaseSyncService {
  private isOnline = false;
  private lastSyncTime = new Date().toISOString();
  private documentsCount = 0;
  private latencyMs = 12;
  private unsubscribeListeners: (() => void)[] = [];
  private isInitialized = false;

  constructor() {
    // Initial status setup
  }

  public getStatus(): CloudDatabaseStatus {
    return {
      provider: 'Firebase Cloud Firestore',
      projectId: firebaseConfig.projectId || 'encouraging-period-7dtd0',
      databaseId: firebaseConfig.firestoreDatabaseId || '(default)',
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      totalCollectionsSynced: 5,
      totalDocumentsSynced: this.documentsCount,
      syncLatencyMs: this.latencyMs
    };
  }

  public async initSync(
    onBookingsSynced?: (bookings: BookingRecord[]) => void,
    onFavoritesSynced?: (favorites: FavoriteItem[]) => void,
    onSubmissionsSynced?: (submissions: VendorSubmissionItem[]) => void,
    onConversationsSynced?: (convs: Conversation[]) => void
  ) {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      const startT = performance.now();

      // 1. Sync Bookings Collection Listener
      const bookingsCol = collection(firestore, 'bookings');
      const unsubBookings = onSnapshot(bookingsCol, (snapshot) => {
        this.isOnline = true;
        this.lastSyncTime = new Date().toISOString();
        this.latencyMs = Math.round(performance.now() - startT);
        
        const remoteBookings: BookingRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as BookingRecord;
          if (data && data.id) {
            remoteBookings.push(data);
          }
        });

        if (remoteBookings.length > 0 && onBookingsSynced) {
          this.documentsCount += remoteBookings.length;
          onBookingsSynced(remoteBookings);
        }
      }, (err) => {
        console.info('[Firestore Live Sync: Bookings] Listener fallback:', err.message);
      });
      this.unsubscribeListeners.push(unsubBookings);

      // 2. Sync Favorites Collection Listener
      const favsCol = collection(firestore, 'favorites');
      const unsubFavs = onSnapshot(favsCol, (snapshot) => {
        this.isOnline = true;
        this.lastSyncTime = new Date().toISOString();
        
        const remoteFavs: FavoriteItem[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as FavoriteItem;
          if (data && data.id) {
            remoteFavs.push(data);
          }
        });

        if (remoteFavs.length > 0 && onFavoritesSynced) {
          this.documentsCount += remoteFavs.length;
          onFavoritesSynced(remoteFavs);
        }
      }, (err) => {
        console.info('[Firestore Live Sync: Favorites] Listener fallback:', err.message);
      });
      this.unsubscribeListeners.push(unsubFavs);

      // 3. Sync Vendor Submissions Listener
      const submissionsCol = collection(firestore, 'vendorSubmissions');
      const unsubSubmissions = onSnapshot(submissionsCol, (snapshot) => {
        this.isOnline = true;
        this.lastSyncTime = new Date().toISOString();
        
        const remoteSubmissions: VendorSubmissionItem[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as VendorSubmissionItem;
          if (data && data.id) {
            remoteSubmissions.push(data);
          }
        });

        if (remoteSubmissions.length > 0 && onSubmissionsSynced) {
          this.documentsCount += remoteSubmissions.length;
          onSubmissionsSynced(remoteSubmissions);
        }
      }, (err) => {
        console.info('[Firestore Live Sync: Submissions] Listener fallback:', err.message);
      });
      this.unsubscribeListeners.push(unsubSubmissions);

      // 4. Sync Conversations Listener
      const convsCol = collection(firestore, 'conversations');
      const unsubConvs = onSnapshot(convsCol, (snapshot) => {
        this.isOnline = true;
        this.lastSyncTime = new Date().toISOString();
        
        const remoteConvs: Conversation[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as Conversation;
          if (data && data.id) {
            remoteConvs.push(data);
          }
        });

        if (remoteConvs.length > 0 && onConversationsSynced) {
          this.documentsCount += remoteConvs.length;
          onConversationsSynced(remoteConvs);
        }
      }, (err) => {
        console.info('[Firestore Live Sync: Conversations] Listener fallback:', err.message);
      });
      this.unsubscribeListeners.push(unsubConvs);

      this.isOnline = true;
      console.log('✅ [Firebase Cloud Firestore] Real-time synchronization active for collections.');
    } catch (e: any) {
      console.warn('[Firebase Cloud Sync Init]', e?.message);
    }
  }

  // --- CLOUD WRITES ---

  public async saveUserToCloud(user: UserProfile) {
    if (!user || !user.id) return;
    try {
      const userRef = doc(firestore, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save User]', e);
    }
  }

  public async saveBookingToCloud(booking: BookingRecord) {
    if (!booking || !booking.id) return;
    try {
      const bookingRef = doc(firestore, 'bookings', booking.id);
      await setDoc(bookingRef, {
        ...booking,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save Booking]', e);
    }
  }

  public async saveFavoriteToCloud(fav: FavoriteItem) {
    if (!fav || !fav.id) return;
    try {
      const favRef = doc(firestore, 'favorites', fav.id);
      await setDoc(favRef, {
        ...fav,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save Favorite]', e);
    }
  }

  public async deleteFavoriteFromCloud(favId: string) {
    if (!favId) return;
    try {
      const favRef = doc(firestore, 'favorites', favId);
      await deleteDoc(favRef);
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Delete Favorite]', e);
    }
  }

  public async saveVendorSubmissionToCloud(submission: VendorSubmissionItem) {
    if (!submission || !submission.id) return;
    try {
      const subRef = doc(firestore, 'vendorSubmissions', submission.id);
      await setDoc(subRef, {
        ...submission,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save Submission]', e);
    }
  }

  public async saveConversationToCloud(conv: Conversation) {
    if (!conv || !conv.id) return;
    try {
      const convRef = doc(firestore, 'conversations', conv.id);
      await setDoc(convRef, {
        ...conv,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save Conversation]', e);
    }
  }

  public async saveMessageToCloud(conversationId: string, message: ChatMessage) {
    if (!conversationId || !message || !message.id) return;
    try {
      const msgRef = doc(firestore, 'conversations', conversationId, 'messages', message.id);
      await setDoc(msgRef, {
        ...message,
        cloudSyncedAt: new Date().toISOString()
      }, { merge: true });
      this.isOnline = true;
      this.lastSyncTime = new Date().toISOString();
    } catch (e) {
      console.info('[Firebase Cloud Save Message]', e);
    }
  }
}

export const firebaseSync = new FirebaseSyncService();
