import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBEjPGgHJJHwAmzR-h5F9eeAyIVn7QM88",
  authDomain: "react-native-test-pro.firebaseapp.com",
  projectId: "react-native-test-pro",
  storageBucket: "react-native-test-pro.firebasestorage.app",
  messagingSenderId: "805033986076",
  appId: "1:805033986076:web:a1d724762e92c22e63b7d9",
  measurementId: "G-9M05RN91TB"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
// export const googleProvider = new GoogleAuthProvider();

export { auth, db };