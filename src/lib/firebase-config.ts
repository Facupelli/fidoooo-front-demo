import { initializeApp } from "firebase/app";
import { getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// PRODUCTION
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "fidooo-bot-prod.firebaseapp.com",
  projectId: "fidooo-bot-prod",
  storageBucket: "fidooo-bot-prod.appspot.com",
  messagingSenderId: "155710848331",
  appId: "1:155710848331:web:e68cc1729f1ffb083ffcce",
};

// UAT
// const firebaseConfig = {
//   projectId: "fidooo-bots-uat",
//   apiKey: "AIzaSyB_IvN0hI7KyB4nKboVuOrf1iTZOyEQo_c",
//   authDomain: "fidooo-bots-uat.firebaseapp.com",
//   storageBucket: "fidooo-bots-uat.appspot.com",
//   messagingSenderId: "396277948888",
//   appId: "1:396277948888:web:228433f09eea36150352ad",
//   measurementId: "G-1V3DB51R7N",
// };

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, firestore, database, storage };
