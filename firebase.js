// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
//import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQJuEYEH02qbY6H4ntRiMfcAURuNAplwo",
  authDomain: "inventory-management-91885.firebaseapp.com",
  projectId: "inventory-management-91885",
  storageBucket: "inventory-management-91885.appspot.com",
  messagingSenderId: "479700352697",
  appId: "1:479700352697:web:cc7d4f47953915f5c16568",
  measurementId: "G-QFN04Z97GB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, firestore }