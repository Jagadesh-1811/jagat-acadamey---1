import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "jagat-academy.firebaseapp.com",
  projectId: "jagat-academy",
  storageBucket: "jagat-academy.appspot.com",
  messagingSenderId: "534998272773",
  appId: "1:534998272773:web:d4488c0ac977e09830056c",
  measurementId: "G-RXBW105ZV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'prompt': 'consent'
});

export default app;
