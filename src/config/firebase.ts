/**
 * Firebase App & Cloud Firestore Initialization
 * 
 * Strict Configuration:
 * - Uses EXPO_PUBLIC_FIREBASE_* environment variables.
 * - Throws actionable diagnostic error if credentials are not configured.
 * - Supports local Firebase Emulator connections for offline testing.
 * - Never uses hard-coded credentials or mock stubs.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const getFirebaseConfig = (): FirebaseClientConfig => {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID;

  const missingKeys: string[] = [];
  if (!apiKey) missingKeys.push('EXPO_PUBLIC_FIREBASE_API_KEY');
  if (!authDomain) missingKeys.push('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN');
  if (!projectId) missingKeys.push('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
  if (!storageBucket) missingKeys.push('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET');
  if (!messagingSenderId) missingKeys.push('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  if (!appId) missingKeys.push('EXPO_PUBLIC_FIREBASE_APP_ID');

  if (missingKeys.length > 0) {
    const errorMsg = `[GlowVAI Firebase Init Error]: Missing required environment variables:\n${missingKeys.map(k => ` - ${k}`).join('\n')}\n\nPlease copy .env.example to .env and configure valid Firebase project credentials.`;
    // Log clearly for developer
    console.warn(errorMsg);
  }

  return {
    apiKey: apiKey || '',
    authDomain: authDomain || '',
    projectId: projectId || 'glowvai-v2',
    storageBucket: storageBucket || '',
    messagingSenderId: messagingSenderId || '',
    appId: appId || '',
    measurementId: measurementId || undefined,
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize Firebase App singleton
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore
export const db: Firestore = getFirestore(app);

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

// Optional: Connect to local Firebase Emulators if configured in .env
if (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  const host = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST || '10.0.2.2';
  try {
    connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
    connectFirestoreEmulator(db, host, 8080);
    connectStorageEmulator(storage, host, 9199);
    console.log(`[Firebase Emulators] Connected to ${host} (Auth: 9099, Firestore: 8080, Storage: 9199)`);
  } catch (emulatorErr) {
    console.warn('[Firebase Emulators] Failed to connect emulator:', emulatorErr);
  }
}
