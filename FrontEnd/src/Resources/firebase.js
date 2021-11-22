import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getStorage } from "firebase/storage";
// import 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyCYEpYQCIuruhWJCHFLb1np6mly_F4ekEI",
    authDomain: "digicart9.firebaseapp.com",
    databaseURL: "https://digicart9-default-rtdb.firebaseio.com",
    projectId: "digicart9",
    storageBucket: "digicart9.appspot.com",
    messagingSenderId: "104222689162",
    appId: "1:104222689162:web:491954c1a97f8da15f2a73"
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);
const db=firebase.firestore(); 
const storage = getStorage(firebaseApp);
 export {firebaseApp,db,storage};