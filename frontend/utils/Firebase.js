// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jagatacademy-36462.firebaseapp.com",
  projectId: "jagatacademy-36462",
  storageBucket: "jagatacademy-36462.firebasestorage.app",
  messagingSenderId: "436828488562",
  appId: "1:436828488562:web:75d2afd6431672824a53eb",
  measurementId: "G-PPVN7F8FWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Action code settings for email link sign-in
// URL must be whitelisted in Firebase Console under Authentication > Settings > Authorized domains
export const getActionCodeSettings = (baseUrl) => ({
  // URL to redirect back to after email verification
  url: `${baseUrl}/finishSignUp`,
  // This must be true for email link sign-in
  handleCodeInApp: true,
});

// Export Firebase Auth functions
export {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
};
