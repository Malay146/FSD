import { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1zD1HTnfVtxN1Ens4TbsBlkJlYkVcvQk",
  authDomain: "pr-11-525fb.firebaseapp.com",
  projectId: "pr-11-525fb",
  storageBucket: "pr-11-525fb.firebasestorage.app",
  messagingSenderId: "143976262842",
  appId: "1:143976262842:web:a45ae3b645e76906912683",
  measurementId: "G-V2XF97WHCP"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const signupUserWithEmailAndPassword = (email, password) => {
        return createUserWithEmailAndPassword(firebaseAuth, email, password);
    };

    const loginUserWithEmailAndPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const signinWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleProvider);
    };

    const logoutUser = () => {
        return signOut(firebaseAuth);
    };
    
    // Function to add user doc to Firestore
    const ensureUserDoc = async (user) => {
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName || 'Anonymous',
                email: user.email,
                photoURL: user.photoURL || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.uid)}`,
                createdAt: new Date(),
            });
        }
    };
    
    const updateUserProfileInfo = (user, profile) => {
        return updateProfile(user, profile);
    };


    const isLoggedIn = user !== null;

    const value = {
        user,
        isLoggedIn,
        firestore,
        auth: firebaseAuth,
        signupUserWithEmailAndPassword,
        loginUserWithEmailAndPassword,
        signinWithGoogle,
        logoutUser,
        ensureUserDoc,
        updateUserProfileInfo,
    };

    return (
        <FirebaseContext.Provider value={value}>
            {props.children}
        </FirebaseContext.Provider>
    );
};