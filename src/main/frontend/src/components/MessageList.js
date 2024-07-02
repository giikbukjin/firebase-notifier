import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-init';

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
            console.log("Fetched messages from Firestore: ", messagesList);
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

export default MessageList;
