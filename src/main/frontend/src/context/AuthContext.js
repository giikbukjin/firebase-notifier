import React, { useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, doc, getDoc } from '../firebase-init';

const AuthContext = React.createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    console.log("Fetching user document for UID: ", user.uid);
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("User document data: ", userData);
                        setRole(userData?.role);
                        setUserName(userData?.name);
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user document: ", error);
                }
            } else {
                setRole(null);
                setUserName(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        role,
        userName,
        login: async () => {
            // Implement your login logic
        },
        logout: async () => {
            // Implement your logout logic
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
