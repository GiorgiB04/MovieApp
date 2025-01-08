// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAz68muxtzL5Net6DjcvWAZjokahKXxL0",
  authDomain: "movie-app-245c9.firebaseapp.com",
  projectId: "movie-app-245c9",
  storageBucket: "movie-app-245c9.firebasestorage.app",
  messagingSenderId: "387858117482",
  appId: "1:387858117482:web:de084f8fe16f90d231eb13",
  measurementId: "G-6LTWFKMH75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
