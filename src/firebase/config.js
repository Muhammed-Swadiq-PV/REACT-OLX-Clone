import { initializeApp } from 'firebase/app';
import * as firebaseAuth from "firebase/auth";
import * as firestore from "firebase/firestore";
import * as storage from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBN1yzrIO3gNNMR3yoaeEJwJVXicCy-2tM",
  authDomain: "fir-b255d.firebaseapp.com",
  projectId: "fir-b255d",
  storageBucket: "fir-b255d.appspot.com",
  messagingSenderId: "787760603013",
  appId: "1:787760603013:web:2c413d13c85178b666aeec",
  measurementId: "G-7JPVBXZ24F"
};

const app = initializeApp(firebaseConfig);
const db = firestore.getFirestore();

const firebaseExports = { app, db, firebaseAuth, firestore, storage };
export default firebaseExports;