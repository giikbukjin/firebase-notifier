import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebase-init";

const CheckReadAnnouncement = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

    const userRoles = {
        'aaa187f5-fb2f-4555-841f-624cd9195411': 'admin',
        '5a2028df-e3d2-4a8f-bb67-622c35bb5cd8': 'client1-chrome',
        '524edefa-fd9f-4ded-8029-37297fb3735b': 'client1-safari'
    };

    useEffect(() => {
        const dataQuery = query(collection(db, "announcements"), orderBy("timestamp", "desc"));
        const handleSnapshot = (querySnapshot) => {
            console.log('공지사항 데이터를 불러왔습니다.');
            const newAnnouncements = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    readBy: data.readBy ? Object.keys(data.readBy).filter(userId => data.readBy[userId]) : []
                };
            });
            setAnnouncements(newAnnouncements);
        };
        const unsubscribe = onSnapshot(dataQuery, handleSnapshot);

        return () => {
            unsubscribe();
        };
    }, [db]);

    return (
        <div className="container">
            <header className="header">
                <h2>읽음 확인</h2>
                <div className="buttons">
                    <button className="back-button" onClick={() => navigate('/')}>목록으로</button>
                </div>
            </header>
            <main>
                <table className="announcement-read-status">
                    <thead>
                        <tr>
                            <th>공지사항 제목</th>
                            <th>날짜</th>
                            <th>읽은 사용자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement) => (
                            <tr key={announcement.id}>
                                <td>{announcement.title}</td>
                                <td>{new Date(announcement.timestamp.toDate()).toLocaleString()}</td>
                                <td>
                                    <ul>
                                        {announcement.readBy.map((userId) => (
                                            <li key={userId}>
                                                {userRoles[userId] || 'unknown'} ({userId})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default CheckReadAnnouncement;