import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2RvorRGHMmLGTdT1vvEpWOWwZMAqPJ14",
  authDomain: "smartstadium-ai-58b4a.firebaseapp.com",
  projectId: "smartstadium-ai-58b4a",
  storageBucket: "smartstadium-ai-58b4a.firebasestorage.app",
  messagingSenderId: "211126324467",
  appId: "1:211126324467:web:6f22196080fd0dcd5f3b86",
  measurementId: "G-J3L5PFYB03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
