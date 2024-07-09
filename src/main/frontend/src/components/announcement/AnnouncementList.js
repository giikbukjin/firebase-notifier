import React, { useEffect, useState, useRef } from 'react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';
import { useAuth } from '../auth/Auth';
import { Link } from 'react-router-dom';
import '../common.css';
import { v4 as uuidv4 } from 'uuid';

const AnnouncementList = () => {
    const [userId, setUserId] = useState(null);
    const { currentUser, login, logout, role } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [expandedIds, setExpandedIds] = useState({});
    const contentRefs = useRef({});

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
        let storedUserId = localStorage.getItem('user-id');

        if (!storedUserId) {
            // UUID 생성 및 저장
            storedUserId = uuidv4();
            localStorage.setItem('user-id', storedUserId);
        }
        setUserId(storedUserId);

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
                [`readBy.${userId}`]: true
            });
            console.log("Updated");
        } catch (e) {
            console.error(e.message);
        }
    }

    const isRead = (announcement) => {
        return userId && announcement.readBy && announcement.readBy[userId];
    }

    const renderButtons = () => {
        if (currentUser) {
            return (
                <>
                    <button className="auth-button" onClick={logout}>로그아웃</button>
                    {role === 'admin' && (
                        <Link to="/add">
                            <button className="admin-button">공지사항 작성</button>
                        </Link>
                    )}
                    {role === 'admin' && (
                        <Link to="/check">
                            <button className="admin-button">읽음 확인</button>
                        </Link>
                    )}
                </>
            );
        } else {
            return <button className="auth-button" onClick={login}>관리자 로그인</button>
        }
    };

    useEffect(() => {
        Object.keys(contentRefs.current).forEach((id) => {
            const element = contentRefs.current[id];
            if (expandedIds[id]) {
                element.style.maxHeight = `${element.scrollHeight}px`;
            } else {
                element.style.maxHeight = '0px';
            }
        });
    }, [expandedIds]);

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
                            className={`announcement-item ${isRead(announcement) ? 'announcement-read' : ''}`}
                            onClick={() => { toggleButton(announcement) }}>
                            <div className="announcement-header">
                                <span className={`announcement-tag ${announcement.type}`}>
                                    {announcement.type === 'general' ? '전체공지' : '클라이언트1'}
                                </span>
                                <h3 className={`${isRead(announcement) ? 'announcement-read' : ''}`}>{announcement.title}</h3>
                                <small>By {announcement.author} on {new Date(announcement.timestamp.toDate()).toLocaleString()}</small>
                            </div>
                            <div className={`announcement-content ${expandedIds[announcement.id] ? 'expanded' : ''}`} ref={el => contentRefs.current[announcement.id] = el}>
                                <div className="content-inner">
                                    <p>{announcement.content}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default AnnouncementList;
