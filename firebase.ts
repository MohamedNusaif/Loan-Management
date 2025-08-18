import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyABa5t2Ayc9Z7rCSRP99spMR43F7cjC13Q",
  authDomain: "loanapp-991be.firebaseapp.com",
  databaseURL: "https://loanapp-991be-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "loanapp-991be",
  storageBucket: "loanapp-991be.appspot.com",
  messagingSenderId: "988255613733",
  appId: "1:988255613733:web:a5ca56449eab2082eb20cc",
  measurementId: "G-X2CJ1R98R4"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Helper function to upload file to Firebase Storage
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};