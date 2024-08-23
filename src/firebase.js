// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-realestate-c3b4e.firebaseapp.com",
  projectId: "mern-realestate-c3b4e",
  storageBucket: "mern-realestate-c3b4e.appspot.com",
  messagingSenderId: "406014665091",
  appId: "1:406014665091:web:3cf6ff3e4c7968954b56b6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);