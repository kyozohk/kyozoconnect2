import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdxqpBRVLlBQ_qVAJ7vqZopy-ynPHEUBo",
  authDomain: "kyozo-7f801.firebaseapp.com",
  projectId: "kyozo-7f801",
  storageBucket: "kyozo-7f801.appspot.com",
  messagingSenderId: "782676535922",
  appId: "1:782676535922:web:ca7c53b90f4224658830eb",
  measurementId: "G-8FE7VM59C0",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
