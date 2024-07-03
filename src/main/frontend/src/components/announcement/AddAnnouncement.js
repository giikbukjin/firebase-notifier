import React, { useState } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-init';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/Auth';
import '../common.css';

// 사용자가 공지사항을 작성하고 Firestore에 저장
const AddAnnouncement = () => {
    // 현재 사용자 정보를 AuthContext에서 가져옴
    const { currentUser } = useAuth();
    // 공지사항의 제목, 내용을 상태로 관리
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 비동기 작업 중 로딩 상태 관리
    const [loading, setLoading] = useState(false);
    // 페이지 이동을 위한 네비게이션
    const navigate = useNavigate();

    // 경고 메시지와 상태 업데이트
    const showAlertAndSetLoading = (message, isLoading) => {
        alert(message);
        setLoading(isLoading);
    };

    // 공지사항 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            showAlertAndSetLoading('공지 등록 실패: 계정 권한이 없습니다.', false);
            return;
        }
        setLoading(true);

        try {
            // Firestore에서 현재 사용자의 문서 가져옴
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (!userDoc.exists()) {
                showAlertAndSetLoading('공지 등록 실패: 사용자가 존재하지 않습니다.', false);
                return;
            }

            // 사용자의 이름을 가져옴
            const userName = userDoc.data().name;

            await addDoc(collection(db, 'announcements'), {
                title,
                content,
                // 공지사항 내용의 작성자를 사용자의 이름으로 대체함
                author: userName,
                timestamp: new Date()
            });
            alert('공지 등록 성공');
            setTitle('');
            setContent('');
            // 입력 완료 후 공지 목록 페이지로 리다이렉트
            navigate('/');
        } catch (error) {
            showAlertAndSetLoading('공지 등록 실패', false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header-buttons">
                <button className="back-button" onClick={() => navigate('/')}>목록으로</button>
            </div>
            <main>
                <form onSubmit={handleSubmit} className="announcement-form">
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
