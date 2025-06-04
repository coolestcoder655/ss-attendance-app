import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCb9_uf_NVvAxx6OkGRwaT_X866PSc3urA",
  authDomain: "attendance-app-ss.firebaseapp.com",
  projectId: "attendance-app-ss",
  storageBucket: "attendance-app-ss.firebasestorage.app",
  messagingSenderId: "182957475569",
  appId: "1:182957475569:web:1a450ea83094d16663cb50",
  measurementId: "G-GPRVQDCVPX"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);