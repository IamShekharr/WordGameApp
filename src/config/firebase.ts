import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC11rUD1CEPgwPiWHQ3b4HyTicKNrBhkPw",
  authDomain: "wordgameapp-85de4.firebaseapp.com",
  projectId: "wordgameapp-85de4",
  storageBucket: "wordgameapp-85de4.firebasestorage.app",
  messagingSenderId: "76480342369",
  appId: "1:76480342369:web:9c65e02f62c0d0407fbd20"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;