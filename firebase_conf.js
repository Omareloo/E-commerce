// firebase_conf.js
const firebaseConfig = {
  apiKey: "AIzaSyD9x4LGO8jrIShzyguY8mJ_CQ5lO2cm05Q",
  authDomain: "e-commerce-21ae3.firebaseapp.com",
  projectId: "e-commerce-21ae3",
  storageBucket: "e-commerce-21ae3.appspot.com",
  messagingSenderId: "387811424080",
  appId: "1:387811424080:web:301f4e7163b503238ee3fa"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
