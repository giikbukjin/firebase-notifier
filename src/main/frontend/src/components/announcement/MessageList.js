import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';

// Firestore 데이터베이스에서 공지사항을 실시간으로 가져와 화면에 표시
function MessageList() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'announcements'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messagesList);
        });

        return () => unsubscribe(); // Cleanup the subscription on unmount
    }, []);

    return (
        <div>
            <h1>Announcements</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message.id}>
                        <h2>{message.title}</h2>
                        <p>{message.content}</p>
                        <small>By {message.author} on {new Date(message.timestamp.toDate()).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
