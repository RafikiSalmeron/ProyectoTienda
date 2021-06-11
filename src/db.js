import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';


var firebaseConfig = {
    apiKey: "AIzaSyBbHo1XZssWepAGrBEQXo7u35K3v9bKs9Q",
    authDomain: "tienda-proyecto-cb7c6.firebaseapp.com",
    projectId: "tienda-proyecto-cb7c6",
    storageBucket: "tienda-proyecto-cb7c6.appspot.com",
    messagingSenderId: "90654449103",
    appId: "1:90654449103:web:38ea5fcc4cfe45b5fb86ba",
    measurementId: "G-2XJQGNGX8W"
};

const db = firebase.initializeApp( firebaseConfig ).firestore();
export {db}


export default {
    auth: firebase.auth()
}
