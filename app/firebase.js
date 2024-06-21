import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBOhXrx4vZKarLVcuAP0Bd_W1OcMdT4DiI',
  authDomain: 'creator-base-6c959.firebaseapp.com',
  projectId: 'creator-base-6c959',
  storageBucket: 'creator-base-6c959.appspot.com',
  messagingSenderId: '417869842806',
  appId: '1:417869842806:web:513c5f0602c759e1859257',
  measurementId: 'G-RDZ3FPQ53P',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
