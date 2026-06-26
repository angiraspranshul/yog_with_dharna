import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// In Vercel, environment variables can be parsed. We will expect a base64 encoded JSON string
// for the service account to avoid issues with newlines in stringified JSON via env vars.
const getServiceAccount = () => {
  try {
    let b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || import.meta.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (!b64) {
      console.error("FIREBASE_SERVICE_ACCOUNT_BASE64 is missing!");
      return null;
    }
    // Strip accidental quotes
    b64 = b64.replace(/^["']|["']$/g, '');
    const decoded = Buffer.from(b64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_BASE64:", error);
    return null;
  }
};

const serviceAccount = getServiceAccount();

if (!getApps().length && serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET || import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export const adminBucket = getStorage().bucket();

