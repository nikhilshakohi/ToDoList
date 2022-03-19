import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBE5yQIn5LqONARdXtqtMAvkhpCE66kwf0",
    authDomain: "assist-mark2.firebaseapp.com",
    projectId: "assist-mark2",
    storageBucket: "assist-mark2.appspot.com",
    messagingSenderId: "227524961449",
    appId: "1:227524961449:web:c02c9d7cd78eb10d3d35b8",
    measurementId: "G-EXKV597NNN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;