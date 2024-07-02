import React, { useState } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import './common.css';

const AddAnnouncement = () => {
    const { currentUser } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            console.error("User is not authenticated.");
            alert('Failed to add announcement: User is not authenticated.');
            return;
        }

        setLoading(true);

        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
                console.error("User document does not exist.");
                alert('Failed to add announcement: User document does not exist.');
                setLoading(false);
                return;
            }

            const userName = userDoc.data().name;

            console.log('Attempting to add announcement with:', { title, content, userName });
            await addDoc(collection(db, 'announcements'), {
                title,
                content,
                author: userName,
                timestamp: new Date()
            });
            alert('Announcement added successfully');
            setTitle('');
            setContent('');
            navigate('/'); // Redirect to the announcement list page
        } catch (error) {
            console.error('Error adding announcement: ', error);
            alert('Failed to add announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <div className="header-placeholder"></div>
                <div className="header-text">
                    <h1>공지사항 작성</h1>
                </div>
            </header>
            <main>
                <form onSubmit={handleSubmit} className="announcement-form">
                    <div className="form-group">
                        <label>Title:</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Content:</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Announcement'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddAnnouncement;
