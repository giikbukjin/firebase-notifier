import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useAuth } from './Auth';
import { Link } from 'react-router-dom';
import './common.css';

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

        return () => unsubscribe();
    }, []);

    return (
        <div className="container">
            <header className="header">
                <div className="header-placeholder"></div>
                <div className="header-text">
                    <h1>공지사항</h1>
                </div>
            </header>
            <main>
                <h2>공지사항</h2>
                {currentUser ? (
                    <button className="auth-button" onClick={logout}>Logout</button>
                ) : (
                    <button className="auth-button" onClick={login}>Login</button>
                )}
                {currentUser && role === 'admin' && (
                    <Link to="/admin">
                        <button className="admin-button">Add Notification</button>
                    </Link>
                )}
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
