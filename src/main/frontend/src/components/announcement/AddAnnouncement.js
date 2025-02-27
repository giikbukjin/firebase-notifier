import React, { useState } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/Auth';
import '../common.css';
import { postAnnouncementToBackend } from '../../firebase/firebase-init';

const AddAnnouncement = () => {
    const { currentUser, role } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('general');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (role !== 'admin') {
            alert('공지 등록 실패: 계정 권한이 없습니다.', false);
            return;
        }
        setLoading(true);

        try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
                alert('공지 등록 실패: 사용자가 존재하지 않습니다.', false);
                return;
            }

            const userName = userDoc.data().name;
            const announcementDocRef = collection(db, 'announcements');
            await addDoc(announcementDocRef, {
                title,
                content,
                author: userName,
                type,
                timestamp: new Date(),
                readBy: {}
            });

            // 백엔드에 보낼 메세지
            const message = {
                title,
                content,
                type,
                author: userName,
                timestamp: new Date()
            };
            alert('공지 등록 성공');
            setTitle('');
            setContent('');
            navigate('/');
            await postAnnouncementToBackend(message);
        } catch (error) {
            alert('공지 등록 실패', false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2>공지사항 작성</h2>
                <div className="buttons">
                    <button className="back-button" onClick={() => navigate('/')}>목록으로</button>
                </div>
            </header>
            <main>
                <form onSubmit={handleSubmit} className="announcement-form">
                    <div className="form-group">
                        <label>대상</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} required>
                            <option value="general">전체</option>
                            <option value="client1">클라이언트 1</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                    </div>
                    <div className="form-group">
                        <label>내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? '등록 중...' : '공지사항 등록'}
                    </button>
                </form>
            </main>
        </div>
    );
};

export default AddAnnouncement;
