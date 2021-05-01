import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCrnD7INx8hsGeT2Zt3UhSKI9ucD9wiVYM',
  authDomain: 'virtualqueue-efbe6.firebaseapp.com',
  databaseURL: 'https://virtualqueue-efbe6-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: 'virtualqueue-efbe6',
  storageBucket: 'virtualqueue-efbe6.appspot.com',
  messagingSenderId: '413665534659',
  appId: '1:413665534659:android:8db16fc9b1188478d93876',
  
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };