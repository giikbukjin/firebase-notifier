import React, {useContext, useEffect, useState} from 'react';
import { auth, db, doc, getDoc, GoogleAuthProvider, onAuthStateChanged,
    signInWithPopup, signOut} from '../../firebase/firebase-init';

// Firebase를 사용하여 사용자의 인증 상태 관리, Google 로그인 기능 제공
const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);
const provider = new GoogleAuthProvider();

const fetchUserRole = async (user) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            return userDoc.data().role;
        } else {
            console.log('사용자 문서가 존재하지 않습니다.');
            return 'user';
        }
    } catch (error) {
        console.error('사용자 역할을 가져오는 중 오류 발생:', error);
        return 'user';
    }
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRole = await fetchUserRole(user);
                console.log(`로그인한 사용자 역할: ${userRole}`);
                if (userRole === 'admin') {
                    setCurrentUser(user);
                    setRole(userRole);
                } else {
                    alert('관리자만 로그인할 수 있습니다.');
                    await signOut(auth);
                    setCurrentUser(null);
                    setRole(null);
                    console.log('관리자가 아닌 사용자는 로그아웃되었습니다.');
                }
            } else {
                setCurrentUser(null);
                setRole(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [auth]);

    const login = async () => {
        try {
            await signInWithPopup(auth, provider);
            console.log('로그인 성공');
        } catch (error) {
            console.error('로그인 중 오류 발생:', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null);
            setRole(null);
            console.log('로그아웃 성공');
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
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
