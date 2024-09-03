import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';  // Firebase Storage 추가
import 'firebase/compat/functions'; // Firebase Functions 추가

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_API_ID
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Firestore 초기화
const db = firebaseApp.firestore();

// Storage 초기화
const storage = firebaseApp.storage();  // Firebase Storage 초기화

// Functions 초기화
const functions = firebaseApp.functions();  // Firebase Functions 초기화

export {firebase, firebaseApp, db, storage, functions}; // Storage와 Functions를 추가로 export