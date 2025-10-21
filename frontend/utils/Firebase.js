// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  authDomain: "jagat-acadmey.firebaseapp.com",
  projectId: "jagat-acadmey",
  storageBucket: "jagat-acadmey.firebasestorage.app",
  messagingSenderId: "534998272773",
  appId: "1:534998272773:web:2910ca6f54c0ecaa30056c",
  measurementId: "G-VXJK5DKFJ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);