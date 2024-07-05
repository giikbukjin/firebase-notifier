import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';
import { useAuth } from '../auth/Auth';
import { Link } from 'react-router-dom';
import { handleAllowNotification } from '../service/handleAllowNotification';
import '../common.css';

const AnnouncementList = () => {
    const { currentUser, login, logout, role } = useAuth();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        console.log('공지사항을 불러오는 중...');
        const qGeneral = query(collection(db, 'announcements', 'general', 'announcements'), orderBy('timestamp', 'desc'));
        const qClient1 = query(collection(db, 'announcements', 'client1', 'announcements'), orderBy('timestamp', 'desc'));

        const unsubscribeGeneral = onSnapshot(qGeneral, (querySnapshot) => {
            console.log('전체 공지사항 데이터를 불러왔습니다.');
            const generalAnnouncements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                type: 'general',
                ...doc.data()
            }));
            setAnnouncements(prev => [...prev.filter(a => a.type !== 'general'), ...generalAnnouncements]);
        });

        const unsubscribeClient1 = onSnapshot(qClient1, (querySnapshot) => {
            console.log('클라이언트 1 공지사항 데이터를 불러왔습니다.');
            const client1Announcements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                type: 'client1',
                ...doc.data()
            }));
            setAnnouncements(prev => [...prev.filter(a => a.type !== 'client1'), ...client1Announcements]);
        });

        if (currentUser) {
            handleAllowNotification(currentUser);
        }

        return () => {
            unsubscribeGeneral();
            unsubscribeClient1();
        };
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
                        <li key={`${announcement.type}-${announcement.id}`} className="announcement-item">
                            <div className="announcement-header">
                                <span className={`announcement-tag ${announcement.type}`}>
                                    {announcement.type === 'general' ? '전체공지' : '클라이언트1'}
                                </span>
                                <h3>{announcement.title}</h3>
                            </div>
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
