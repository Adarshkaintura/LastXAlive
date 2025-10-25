// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPxTdg3q8WGdg6BkckdlnWorrqXeCVhZE",
  authDomain: "lastxalive.firebaseapp.com",
  projectId: "lastxalive",
  storageBucket: "lastxalive.appspot.com",
  messagingSenderId: "763530458403",
  appId: "1:763530458403:web:e168d85c9178f42858c896",
  measurementId: "G-ZDBWQYTCVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
