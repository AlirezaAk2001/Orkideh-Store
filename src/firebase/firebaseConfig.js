import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'; 
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDi7B5A26E6U_zmVN6J_YKyzliGRKkAxUc",
  authDomain: "products-af8c7.firebaseapp.com",
  projectId: "products-af8c7",
  storageBucket: "products-af8c7.firebasestorage.app",
  messagingSenderId: "667966146530",
  appId: "1:667966146530:web:d2470ffd951d695ee41bbb"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
export const storage = getStorage(app);

export { db, auth };