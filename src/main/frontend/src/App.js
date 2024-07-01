import React, { useEffect, useState } from 'react';
import './App.css';
import { ref, set, onValue } from 'firebase/database';
import { database } from './firebaseInit';

const App = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const announcementsRef = ref(database, 'announcements/');
        onValue(announcementsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setAnnouncements(Object.values(data));
            }
        });
    }, []);

    const addAnnouncement = () => {
        const newAnnouncementRef = ref(database, `announcements/${Date.now()}`);
        set(newAnnouncementRef, {
            message: '새로운 공지사항입니다.'
        })
            .then(() => {
                console.log('Announcement added successfully.');
            })
            .catch((error) => {
                console.error('Error adding announcement:', error);
            });
    };

    return (
        <div className="App">
            <h1>공지사항</h1>
            <ul>
                {announcements.map((announcement, index) => (
                    <li key={index}>{announcement.message}</li>
                ))}
            </ul>
            <button onClick={addAnnouncement}>공지사항 추가</button>
        </div>
    );
};

export default App;
