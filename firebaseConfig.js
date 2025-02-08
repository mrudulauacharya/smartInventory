import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcAnhOsaXMH8DIeC1pjBgJkrXR8z0Uc5E",
  authDomain: "smartinventory-4a6b7.firebaseapp.com",
  projectId: "smartinventory-4a6b7",
  storageBucket: "smartinventory-4a6b7.appspot.com",
  messagingSenderId: "488725406161",
  appId: "1:488725406161:web:20d43ca367bef1e54580f0",
  measurementId: "G-RS7B8254C8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
