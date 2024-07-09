import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/Auth';
import AddAnnouncement from './components/announcement/AddAnnouncement';
import AnnouncementList from './components/announcement/AnnouncementList';
import PrivateRoute from './components/auth/PrivateRoute';
import { onMessageListener } from './firebase/firebase-init';

const App = () => {
    useEffect(() => {
        // 수신 메시지 리스너 설정
        onMessageListener()
            .then((payload) => {
                console.log('메세지 수신: ', payload);
                console.log('공지사항 제목:', payload.notification.title);
                console.log('공지사항 내용:', payload.notification.body);
            })
            .catch((err) => console.log('Failed to receive message: ', err));
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/" element={<AnnouncementList />} />
                        <Route element={<PrivateRoute requiredRole="admin" />}>
                            <Route path="/admin" element={<AddAnnouncement />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
