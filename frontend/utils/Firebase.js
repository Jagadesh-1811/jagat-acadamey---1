// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpspZAjCShQtuph-NFRw7fSQwKblJLHyI",
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