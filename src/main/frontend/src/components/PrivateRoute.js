import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './Auth';

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
