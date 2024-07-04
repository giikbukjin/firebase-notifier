import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';
import { useAuth } from '../auth/Auth';
import { Link } from 'react-router-dom';
import { handleAllowNotification } from '../service/handleAllowNotification';
import '../common.css';

// 공지사항 목록 표시
const AnnouncementList = () => {
    const { currentUser, login, logout, role } = useAuth();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'announcements'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnnouncements(announcementsList);
        });

        if (currentUser !== undefined && currentUser !== null) {
            handleAllowNotification(currentUser);  // 로그인된 사용자의 정보와 함께 함수 호출
        }

        return () => unsubscribe();
    }, [currentUser]);

    const renderButtons = () => {
        if (currentUser) {
            return (
                <>
                    <button className="auth-button" onClick={logout}>로그아웃</button>
                    {role === 'admin' && (
                        <Link to="/admin">
                            <button className="admin-button">공지사항 작성</button>
                        </Link>
                    )}
                </>
            );
        } else {
            return <button className="auth-button" onClick={login}>로그인</button>;
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2>공지사항</h2>
                <div className="buttons">
                    {renderButtons()}
                </div>
            </header>
            <main>
                <ul className="announcement-list">
                    {announcements.map((announcement) => (
                        <li key={announcement.id} className="announcement-item">
                            <h3>{announcement.title}</h3>
                            <p>{announcement.content}</p>
                            <small>By {announcement.author} on {new Date(announcement.timestamp.toDate()).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default AnnouncementList;
