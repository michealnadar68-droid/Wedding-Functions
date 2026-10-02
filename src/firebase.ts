import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App instance safely (singleton pattern)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with custom databaseId if provisioned
export const firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Connectivity Probe test per Firebase guidelines
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testRef = doc(firestore, 'test', 'connection_probe');
    await setDoc(testRef, {
      lastPing: new Date().toISOString(),
      status: 'online',
      client: 'Elysian Wedding Platform'
    }, { merge: true });
    
    const snap = await getDocFromServer(testRef);
    if (snap.exists()) {
      console.log('[Firebase Live] Connected successfully to Cloud Firestore database:', firebaseConfig.projectId);
      return true;
    }
    return false;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase Cloud] Client is offline, operating in resilient local-cache mode.');
    } else {
      console.info('[Firebase Cloud Init]', error);
    }
    return false;
  }
}

// Automatically trigger connection probe on startup
if (typeof window !== 'undefined') {
  testFirebaseConnection().catch(() => {});
}
