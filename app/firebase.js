import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCZcfNOtiW7ejcaOc_suYxaObKJsgI9qs',
  authDomain: 'dashboard-a0a7e.firebaseapp.com',
  projectId: 'dashboard-a0a7e',
  storageBucket: 'dashboard-a0a7e.appspot.com',
  messagingSenderId: '549724431506',
  appId: '1:549724431506:web:6eee38510a9b0f9c75724b',
  measurementId: 'G-KCVXNC66WB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
