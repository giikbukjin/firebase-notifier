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
} from '../../firebase/firebase-init';

// Firebase를 사용하여 사용자의 인증 상태 관리, Google 로그인 기능 제공
const AuthContext = React.createContext();

export const useAuth = () => useContext(AuthContext);

const fetchUserRole = async (user) => {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.data()?.role || 'user';
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                setRole(await fetchUserRole(user));
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
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
