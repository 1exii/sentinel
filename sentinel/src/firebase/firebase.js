/**
 * Firebase
 * Sets up Firebase services including:
 * - Authentication (Google Sign-In)
 * - Firestore database for storing reports
 * - Analytics for tracking app usage
 */

// imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// firebase configuration with env variables for api keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sentinelapp-157a5.firebaseapp.com",
  projectId: "sentinelapp-157a5",
  storageBucket: "sentinelapp-157a5.firebasestorage.app",
  messagingSenderId: "996567385231",
  appId: "1:996567385231:web:7bb6408434782427b79cfa",
  measurementId: "G-5DFTY1RQ95"
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize analytics
const analytics = getAnalytics(app);

// export authentication instance
export const auth = getAuth(app);

// export Firestore database instance 
export const db = getFirestore(app);

// export Google authentication provide
export const googleProvider = new GoogleAuthProvider();

export default app;