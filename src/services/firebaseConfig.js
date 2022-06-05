import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
console.log(process.env.REACT_APP_FIREBASE_API_KEY)
console.log(process.env.REACT_APP_AUTH_DOMAIN)
console.log(process.env.REACT_APP_PROJECT_ID)
console.log(process.env.REACT_APP_STORAGE_BUCKET)
console.log(process.env.REACT_APP_MESSEGING_SENDER_ID)
console.log(process.env.REACT_APP_APP_ID)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSEGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export const userData = initializeApp(firebaseConfig);

export const rdb = getDatabase(userData);
