import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/Auth';
import AddAnnouncement from './components/AddAnnouncement';
import AnnouncementList from './components/AnnouncementList';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

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
