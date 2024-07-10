import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../firebase/firebase-init";
import {fetchAnnouncements} from "./FetchAnnouncements";

const CheckReadAnnouncement = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [userRoles, setUserRoles] = useState({});

    // Firestore에서 client 컬렉션의 데이터 불러와 userRoles 상태로 설정
    useEffect(() => {
        const userRolesQuery = query(collection(db, "clients"));
        const handleSnapshot = (querySnapshot) => {
            const roles = {};
            querySnapshot.forEach(doc => {
                roles[doc.id] = doc.data().name;
            });
            setUserRoles(roles);
        };
        const unsubscribe = onSnapshot(userRolesQuery, handleSnapshot);
        return () => unsubscribe();
    }, [db]);

    // Firestore에서 announcement 컬렉션의 데이터 불러와 announcements 상태로 설정
    useEffect(() => {
        const unsubscribe = fetchAnnouncements(setAnnouncements);
        return () => unsubscribe();
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