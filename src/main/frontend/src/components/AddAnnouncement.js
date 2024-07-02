import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth'; // Import useAuth
import './common.css';

const AddAnnouncement = () => {
    const { userName } = useAuth(); // Destructure userName from useAuth
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userName) {
            console.error("User name is not available.");
            alert('Failed to add announcement: User name is not available.');
            return;
        }

        try {
            console.log('Attempting to add announcement with:', { title, content, userName });
            await addDoc(collection(db, 'announcements'), {
                title,
                content,
                author: userName, // Set author to the logged-in user's name
                timestamp: new Date()
            });
            alert('Announcement added successfully');
            setTitle('');
            setContent('');
            navigate('/'); // Redirect to the announcement list page
        } catch (error) {
            console.error('Error adding announcement: ', error);
            alert('Failed to add announcement');
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
                    <button type="submit" className="submit-button">Add Announcement</button>
                </form>
            </main>
        </div>
    );
};

export default AddAnnouncement;
