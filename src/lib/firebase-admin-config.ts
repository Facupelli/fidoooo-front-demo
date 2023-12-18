import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
// import serviceAccount from "../../service-account.json";

const firebaseAdminConfig = {
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
};

const adminApp =
  getApps().length <= 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminAuth = getAuth(adminApp);
