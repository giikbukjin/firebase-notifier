import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Auth';

// 인증된 사용자만 특정 경로에 접근할 수 있도록 함
const PrivateRoute = ({ requiredRole }) => {
    const { currentUser, role } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
