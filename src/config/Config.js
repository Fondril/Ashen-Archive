import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCTxAC9S2NdNb6st5rv4svJQOVZ4R6xFFU",
  authDomain: "gamevault-193bd.firebaseapp.com",
  databaseURL:
    "https://gamevault-193bd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gamevault-193bd",
  storageBucket: "gamevault-193bd.appspot.com",
  messagingSenderId: "199109910913",
  appId: "1:199109910913:web:1932f4cb9db4e892fe0880",
  measurementId: "G-8EWMM4J03H",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

export { auth, db, app, storage };
