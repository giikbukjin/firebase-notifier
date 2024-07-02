import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-init';
import { useNavigate } from 'react-router-dom';

const AddAnnouncement = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'announcements'), {
                title,
                content,
                author,
                timestamp: new Date()
            });
            alert('Announcement added successfully');
            setTitle('');
            setContent('');
            setAuthor('');
            navigate('/');
        } catch (error) {
            console.error('Error adding announcement: ', error);
            alert('Failed to add announcement');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Content:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            </div>
            <div>
                <label>Author:</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>
            <button type="submit">Add Announcement</button>
        </form>
    );
};

export default AddAnnouncement;
