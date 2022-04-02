/*React Tools*/
import { createContext, useContext, useEffect, useState } from "react";
/* Firebase */
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, getAuth } from "firebase/auth";
import auth from "./Firebase";
import { collection, addDoc, getFirestore } from "firebase/firestore"; //Firestore

export const UserContext = createContext();

/* This function will be used to referrence the functions in AuthContext which use UserContext */
export function useAuth() { return useContext(UserContext); }

/*This function is kept as parent for App component, so that all of its functions can be used by its sub-components*/
export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();

    //E-Mail Login Function from Firebase
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    //Google-Login Function from Firebase
    function signInWithGoogleViaPopup() {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                //const credential = GoogleAuthProvider.credentialFromResult(result);// This gives you a Google Access Token. You can use it to access the Google API.
                //const token = credential.accessToken;
                const currentUser = result.user;// The signed-in user info.
                console.log(currentUser);
            });
    }

    //Signup Function from Firebase
    function signup(email, password, fullname) {
        return createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => { updateProfile(auth.currentUser, { displayName: fullname, }); })
            .then(addUserInFirestore(email, fullname));
    }

    //Add User to Firestore
    async function addUserInFirestore(email, fullname) {
        try {
            await addDoc(collection(getFirestore(), "users"), { email: email, name: fullname });
        } catch (e) {
            console.error("Error adding document: ",e);
        }
    }

    //Logout Function from Firebase
    function logout() {
        signOut(auth).then(() => {
            console.log('SignOut Successful');
        }).catch((error) => {
            console.log(error);
        });
    }

    //Forgot Password Function from Firebase
    function forgotPasswordMail(email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Mail Sent Successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    //Check for user and save it in currentUser
    useEffect(() => {
       const checkAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
       });
       return checkAuth;
    }, [currentUser]);

    const allAuthFunctions = { currentUser, login, signup, logout, forgotPasswordMail, signInWithGoogleViaPopup };

    //Return all of its child functions through useContext Provider by keeping them inside the value
    return (
        <UserContext.Provider value={allAuthFunctions}>
            {children}
        </UserContext.Provider>
    );
}
