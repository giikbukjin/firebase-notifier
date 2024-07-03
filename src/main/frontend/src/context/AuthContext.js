import React, {useContext, useEffect, useState} from 'react';
import {auth, db, doc, getDoc, onAuthStateChanged} from '../firebase/firebase-init';

// Firebase를 사용하여 사용자의 인증 상태 관리
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
        // Firebase의 인증 상태가 변경되면 실행
        return onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                try {
                    console.log("Fetching user document for UID: ", user.uid);
                    // Firestore에서 현재 사용자의 문서 가져옴
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        // 사용자 문서가 존재하면 사용자의 데이터를 가져옴
                        const userData = userDoc.data();
                        console.log("User document data: ", userData);
                        // 역할(admin)과 이름을 상태에 저장
                        setRole(userData?.role);
                        setUserName(userData?.name);
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user document: ", error);
                }
            } else {
                // 사용자가 로그아웃한 경우 정보를 null로 바꿈
                setRole(null);
                setUserName(null);
            }
            setLoading(false);
        });
    }, []);

    const value = {
        currentUser,
        role,
        userName,
        login: async () => {
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
