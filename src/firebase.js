import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAyCZSWj5Kmbuvlp_UCa0BKJ717-0mAPAQ",
  authDomain: "chatterbox-3c62f.firebaseapp.com",
  databaseURL: 'chatterbox-3c62f-default-rtdb.firebaseio.com/',
  storageBucket: "chatterbox-3c62f.appspot.com",
}

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app;
}

const db = firebase.database()

export {db};
