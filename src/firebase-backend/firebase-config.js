import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAzlXYvkwBW-7hY9qEKv7ZGeASrmQcReA4",
    authDomain: "m-g-parcel-care.firebaseapp.com",
    projectId: "m-g-parcel-care",
    storageBucket: "m-g-parcel-care.appspot.com",
    messagingSenderId: "888591747286",
    appId: "1:888591747286:web:aafd4137e4952a2e95e177",
    measurementId: "G-2ZBNRH5KD6"
};
initializeApp(firebaseConfig);
const firestore = getFirestore();
const auth = getAuth();

export { firestore, auth }