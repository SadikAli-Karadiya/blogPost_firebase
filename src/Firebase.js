import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

const firebaseConfig = {
    // apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // projectId:process.env.FIREBASE_PROJECT_ID ,
    // storageBucket:process.env.FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    // appId:process.env.FIREBASE_APP_ID
    apiKey: "AIzaSyB_vD2cEe8q3MMcGIAv8GbAuJdz77JHm3M",
    authDomain: "first-firebase-503df.firebaseapp.com",
    projectId: "first-firebase-503df",
    storageBucket: "first-firebase-503df.appspot.com",
    messagingSenderId: "686259556625",
    appId: "1:686259556625:web:df201d85229c8700127cb0"
}
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export {auth, db, storage, serverTimestamp}