import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = 
{
  apiKey: "AIzaSyByzWTpeF9pwCrAX-YKntJwq8MTTXErfnM",
  authDomain: "quiz-app-4356d.firebaseapp.com",
  projectId: "quiz-app-4356d",
  storageBucket: "quiz-app-4356d.firebasestorage.app",
  messagingSenderId: "530982372582",
  appId: "1:530982372582:web:d191aca2965b9d10e9e727",
  measurementId: "G-WNLX0T31G1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export default app;