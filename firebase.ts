import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMTUWWgXpxD3bnT1I1h6EIjQRAHZk1DXk",
  authDomain: "diet-traning-app.firebaseapp.com",
  projectId: "diet-traning-app",
  storageBucket: "diet-traning-app.appspot.com",
  messagingSenderId: "386008893462",
  appId: "1:386008893462:web:7fb8a6a6cd0181e7fd4d37",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);