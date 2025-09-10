const config = {
  apiKey: "AIzaSyCVw4J23im2_idj9HkTxgL0o25SGJKVhRI",
  authDomain: "vuv-knjiznica-95bae.firebaseapp.com",
  databaseURL: "https://vuv-knjiznica-95bae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vuv-knjiznica-95bae",
  storageBucket: "vuv-knjiznica-95bae.appspot.com",
  messagingSenderId: "61439071315",
  appId: "1:61439071315:web:eaccdea2cacfdd066ee2a6"
};
firebase.initializeApp(config);

// Kreiranje objekta Firebase baze

var oDb = firebase.database();
var auth = firebase.auth();
var oDbKnjiga = oDb.ref('knjige');
var ODbKorisnik = oDb.ref('korisnici');
var oDbPosudbe = oDb.ref('posudbe');