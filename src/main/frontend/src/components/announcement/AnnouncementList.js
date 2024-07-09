import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db, token } from '../../firebase/firebase-init';
import { useAuth } from '../auth/Auth';
import { Link } from 'react-router-dom';
import '../common.css';

const AnnouncementList = () => {
    const { currentUser, login, logout, role } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [expandedIds, setExpandedIds] = useState({});

    useEffect(() => {
        const dataQuery = query(collection(db, "announcements"), orderBy("timestamp", "desc"));

        const handleSnapshot = (querySnapshot) => {
            console.log('공지사항 데이터를 불러왔습니다.');
            const newAnnouncements = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnnouncements(newAnnouncements);
        };

        const unsubscribe = onSnapshot(dataQuery, handleSnapshot);

        return () => {
            unsubscribe();
        };
    }, [db]);

    const toggleExpand = (id) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    const toggleButton = async (announcement) => {
        toggleExpand(announcement.id);

        const announcementDocRef = doc(db, 'announcements', announcement.id);

        try {
            await updateDoc(announcementDocRef, {
                [`readBy.${token}`]: true
            });
            console.log("Updated");
        } catch (e) {
            console.error(e.message);
        }
    }

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
            return <button className="auth-button" onClick={login}>로그인</button>
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2>공지사항</h2>
                <div className="buttons">
                    { renderButtons() }
                </div>
            </header>
            <main>
                <ul className="announcement-list">
                    {announcements.map((announcement) => (
                        <li key={announcement.id}
                            className={`announcement-item ${announcement.readBy && announcement.readBy[token] ? 'announcement-read' : ''}`}
                            onClick={() => { toggleButton(announcement) }}>
                            <div className="announcement-header">
                                <span className={`announcement-tag ${announcement.type}`}>
                                    {announcement.type === 'general' ? '전체공지' : '클라이언트1'}
                                </span>
                                <h3 className={`${announcement.readBy && announcement.readBy[token] ? 'announcement-read' : ''}`}>{announcement.title}</h3>
                                <small>By {announcement.author} on {new Date(announcement.timestamp.toDate()).toLocaleString()}</small>
                            </div>
                            {expandedIds[announcement.id] && (
                                <>
                                    <p>{announcement.content}</p>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default AnnouncementList;
