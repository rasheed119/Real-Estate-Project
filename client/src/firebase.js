// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "real-estate-mern-app.firebaseapp.com",
  projectId: "real-estate-mern-app",
  storageBucket: "real-estate-mern-app.appspot.com",
  messagingSenderId: "272625132757",
  appId: "1:272625132757:web:942b38e035933de103ee5c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);