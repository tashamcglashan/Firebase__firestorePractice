// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmjPOLh50FWLb6AY0UqJB-gfUz1TsjG9g",
  authDomain: "fir-practice-7c7fe.firebaseapp.com",
  projectId: "fir-practice-7c7fe",
  storageBucket: "fir-practice-7c7fe.firebasestorage.app",
  messagingSenderId: "557193621167",
  appId: "1:557193621167:web:755b27b2a9f59df315ae5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

