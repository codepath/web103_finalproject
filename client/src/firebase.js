// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxhNrg9u4Zq_oLF9jQ0KwfI1AcfuofxTk",
  authDomain: "pawmodoro-64524.firebaseapp.com",
  projectId: "pawmodoro-64524",
  storageBucket: "pawmodoro-64524.firebasestorage.app",
  messagingSenderId: "86625035463",
  appId: "1:86625035463:web:99cb9e515fb43f70040ae2",
  measurementId: "G-JB9QY1MS5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider }