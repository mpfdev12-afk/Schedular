// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxaQnXRAFWLJ5Bgnf0J0QSe3GLrY8KQpw",
  authDomain: "login-auth-57c66.firebaseapp.com",
  projectId: "login-auth-57c66",
  storageBucket: "login-auth-57c66.firebasestorage.app",
  messagingSenderId: "964947691481",
  appId: "1:964947691481:web:24394e56efef8f8b547bc8",
  measurementId: "G-8HWB4TVRXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;