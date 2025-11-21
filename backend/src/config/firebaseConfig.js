import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuG2omd9qbxyladvPXbWAk4H1yHOy4sTU",
    authDomain: "healio-bf5ed.firebaseapp.com",
    projectId: "healio-bf5ed",
    storageBucket: "healio-bf5ed.firebasestorage.app",
    messagingSenderId: "691732173849",
    appId: "1:691732173849:web:537d459b2b522271a58688",
    measurementId: "G-NRJ89YP6HN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
