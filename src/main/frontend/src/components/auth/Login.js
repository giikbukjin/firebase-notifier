import React, { useEffect } from 'react';
import { useAuth } from './Auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login, currentUser, role, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (currentUser && role === 'admin') {
                navigate('/admin');
            } else if (currentUser) {
                navigate('/');
            }
        }
    }, [currentUser, role, loading, navigate]);

    return (
        <div>
            <h1>Login</h1>
            <button onClick={login}>Log In with Google</button>
        </div>
    );
};

export default Login;
