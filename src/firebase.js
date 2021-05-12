import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "<YOUR_DETAILS>",
  authDomain: "<YOUR_DETAILS>",
  databaseURL: '<YOUR_DETAILS>',
  storageBucket: "<YOUR_DETAILS>",
}

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app;
}

const db = firebase.database()

export {db};
