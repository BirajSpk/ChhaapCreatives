import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        /* Check for existing session on mount */
        const checkAuth = async () => {
            // Try to get token from both localStorage (30-day) and sessionStorage (session)
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
            
            if (!token) {
                setUser(null);
                setRememberMe(false);
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setUser(response.data.data.user);
                    setRememberMe(storedRememberMe);
                }
            } catch (error) {
                /* Token expired or invalid */
                localStorage.removeItem('token');
                localStorage.removeItem('rememberMe');
                sessionStorage.removeItem('token');
                setUser(null);
                setRememberMe(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData, isRememberMe = false) => {
        setUser(userData);
        setRememberMe(isRememberMe);
        
        /* Store token based on rememberMe preference */
        if (isRememberMe) {
            /* 30-day persistence with localStorage */
            localStorage.setItem('rememberMe', 'true');
            /* Token will be set by API call - store it in localStorage */
        } else {
            /* Session-only with sessionStorage */
            localStorage.removeItem('rememberMe');
            /* Token will be stored in sessionStorage via API interceptor */
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('rememberMe');
            sessionStorage.removeItem('token');
            setUser(null);
            setRememberMe(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, rememberMe, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
