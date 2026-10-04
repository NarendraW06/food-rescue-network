import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCW0ywkAgZERanAacpKQXC_07EIZWIYIW0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "food-rescue-network-15735.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "food-rescue-network-15735",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "food-rescue-network-15735.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "487378250189",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:487378250189:web:446e82cf53f1eadb07bc84"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });