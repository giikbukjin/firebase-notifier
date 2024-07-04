import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/Auth';
import AddAnnouncement from './components/announcement/AddAnnouncement';
import AnnouncementList from './components/announcement/AnnouncementList';
import PrivateRoute from './components/auth/PrivateRoute';
import { requestPermission, onMessageListener } from './firebase/firebase-init';

const App = () => {
    useEffect(() => {
        // Request permission for notifications
        requestPermission();

        // Listen for incoming messages
        onMessageListener()
            .then((payload) => {
                console.log('Message received: ', payload);
                console.log('Notification Title:', payload.notification.title);
                console.log('Notification Body:', payload.notification.body);
            })
            .catch((err) => console.log('Failed to receive message: ', err));
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route element={<PrivateRoute requiredRole="admin" />}>
                            <Route path="/admin" element={<AddAnnouncement />} />
                        </Route>
                        <Route path="/" element={<AnnouncementList />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
