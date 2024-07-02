import React, {useContext, useEffect, useState} from 'react';
import {
    auth,
    db,
    doc,
    getDoc,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from '../firebase-init';

const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                setRole(userDoc.data()?.role || 'user');
            } else {
                setCurrentUser(null);
                setRole(null);
            }
            setLoading(false);
        });
    }, []);

    const login = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
        setRole(null);
    };

    const value = {
        currentUser,
        role,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
