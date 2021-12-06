import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA0QljSHg7Zmnx0iHjUANWX0i6cxiYS6G4",
    authDomain: "tinder-clone-3244e.firebaseapp.com",
    projectId: "tinder-clone-3244e",
    storageBucket: "tinder-clone-3244e.appspot.com",
    messagingSenderId: "878544394448",
    appId: "1:878544394448:web:b5d666bc8e909ee0e426d5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
