import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQmBvLylXmLbVZpwoupXlwluSlQXw30m0",
  authDomain: "habit-tracking-40c4c.firebaseapp.com",
  databaseURL: "https://habit-tracking-40c4c-default-rtdb.firebaseio.com",
  projectId: "habit-tracking-40c4c",
  storageBucket: "habit-tracking-40c4c.firebasestorage.app",
  messagingSenderId: "1035057274604",
  appId: "1:1035057274604:web:5dc5d19eb6d4a834180fc9",
  measurementId: "G-WBVG9ZLF8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence and multi-tab synchronization
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support all of the features required to enable persistence');
  }
});

// For development, you can uncomment these lines to use emulators
// if (location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }