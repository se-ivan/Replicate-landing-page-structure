import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

function getPrivateKey() {
  return import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function getStorageBucket() {
  return (
    import.meta.env.FIREBASE_STORAGE_BUCKET ||
    (import.meta.env.FIREBASE_PROJECT_ID ? `${import.meta.env.FIREBASE_PROJECT_ID}.firebasestorage.app` : undefined)
  );
}

const firebaseApp =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_PROJECT_ID,
      privateKey: getPrivateKey(),
      clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
    }),
    storageBucket: getStorageBucket(),
  });

export const firebaseBucket = getStorage(firebaseApp).bucket();
