import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXf6VU8L8fawX52hfccIUnSs6u9XrS81I",
  authDomain: "sriceylonporcelain-website.firebaseapp.com",
  projectId: "sriceylonporcelain-website",
  storageBucket: "sriceylonporcelain-website.firebasestorage.app",
  messagingSenderId: "34828581507",
  appId: "1:34828581507:web:a33fd150bb5126732839b6",
  measurementId: "G-R3832GNMZS",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
