import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/auth/Auth';
import AddAnnouncement from './components/announcement/AddAnnouncement';
import AnnouncementList from './components/announcement/AnnouncementList';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route element={<PrivateRoute requiredRole="admin" />}>
                            <Route path="/admin" element={<AddAnnouncement />} />
                        </Route>
                        <Route path="/" element={<AnnouncementList />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
