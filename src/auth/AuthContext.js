/*React Tools*/
import { createContext, useContext, useEffect, useState } from "react";
/* Firebase */
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, getAuth } from "firebase/auth";
import auth from "./Firebase";

export const UserContext = createContext();

/* This function will be used to referrence the functions in AuthContext which use UserContext */
export function useAuth() { return useContext(UserContext); }

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

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

    function signup(email, password, fullname) {
        return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {updateProfile(auth.currentUser, { displayName: fullname, });})
    }

    function logout() {
        signOut(auth).then(() => {
            console.log('SignOut Successful');
        }).catch((error) => {
            console.log(error);
        });
    }

    function forgotPasswordMail(email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Mail Sent Successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    }

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

    return (
        <UserContext.Provider value={allAuthFunctions}>
            {children}
        </UserContext.Provider>
    );
}
