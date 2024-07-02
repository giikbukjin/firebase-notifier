import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useAuth } from './Auth';
import {Link} from "react-router-dom";

const AnnouncementList = () => {
    const { currentUser, login, logout } = useAuth();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'announcements'));
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
        <div>
            <h1>Announcements</h1>
            {currentUser ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <button onClick={login}>Go to Login</button>
            )}
            {}
            {currentUser && (
                <Link to="/admin">
                    <button>Go to Admin</button>
                </Link>
            )}
            <ul>
                {announcements.map((announcement) => (
                    <li key={announcement.id}>
                        <h2>{announcement.title}</h2>
                        <p>{announcement.content}</p>
                        <small>By {announcement.author} on {new Date(announcement.timestamp.toDate()).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnnouncementList;
