import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCONsVQgR7jRxnPxcNjWRrchsM_YKa516o",
  authDomain: "nosmokezone-3808f.firebaseapp.com",
  projectId: "nosmokezone-3808f",
  storageBucket: "nosmokezone-3808f.firebasestorage.app",
  messagingSenderId: "818140135388",
  appId: "1:818140135388:web:b9a3778f711dee58111919"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);