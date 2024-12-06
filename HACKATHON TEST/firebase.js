import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, addDoc, collection ,getDocs , doc, setDoc,updateDoc,serverTimestamp,arrayUnion, arrayRemove, deleteDoc,query,  orderBy,  onSnapshot,Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";



import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAk60U34S6tJLHiNAyK9i-6zkmgEoLFZNU",
  authDomain: "coranu-blog.firebaseapp.com",
  projectId: "coranu-blog",
  storageBucket: "coranu-blog.firebasestorage.app",
  messagingSenderId: "667733822470",
  appId: "1:667733822470:web:dcee04a4d1f2da45250787"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut, 
    signInWithPopup, GoogleAuthProvider, db, addDoc, collection,getDocs , doc, setDoc,
    updateDoc ,serverTimestamp,arrayUnion, arrayRemove , deleteDoc,query,  orderBy,  onSnapshot,Timestamp};