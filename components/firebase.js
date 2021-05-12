import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAyCZSWj5Kmbuvlp_UCa0BKJ717-0mAPAQ",
  authDomain: "chatterbox-3c62f.firebaseapp.com",
  databaseURL: 'chatterbox-3c62f-default-rtdb.firebaseio.com/',
  storageBucket: "chatterbox-3c62f.appspot.com",
}

const Fire = () => {

  firebase.initializeApp(firebaseConfig);

}

export const storeMessage = (msg) => {
  firebase.database().ref('users/' + msg.id).set({
      content: msg.text,
      createdAt: msg.text,
    });
}

export default Fire;
