// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbknkfD6Je1a3wDZRTzn6lC62CNUhhwLc",
  authDomain: "store-471f1.firebaseapp.com",
  projectId: "store-471f1",
  storageBucket: "store-471f1.appspot.com", // ✅ fixed typo here
  messagingSenderId: "619523242611",
  appId: "1:619523242611:web:fdfa53044c62f844574806",
  measurementId: "G-16C8MYT70G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
