import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBPgX97EP9JrcQTVTkD3_K2nHXWdhYfgZE",
    authDomain: "tuves-backoffice.firebaseapp.com",
    projectId: "tuves-backoffice",
    storageBucket: "tuves-backoffice.appspot.com",
    messagingSenderId: "832417662281",
    appId: "1:832417662281:web:2063782ff9bc0a1b370698"
};

export const firebaseApp = initializeApp(firebaseConfig);
