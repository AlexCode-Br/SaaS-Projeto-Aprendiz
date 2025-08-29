import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.Authorization = `Bearer ${token}`;
                try {
                    // CORREÇÃO: Adicionado /api/
                    const response = await api.get('/api/auth/me'); 
                    setUser(response.data);
                } catch (error) {
                    console.error("Sessão inválida, fazendo logout.", error);
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        // CORREÇÃO: Adicionado /api/
        const response = await api.post('/api/auth/login', { email, senha: password });
        const { token, user: userData } = response.data;

        localStorage.setItem('token', token);
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.Authorization;
        setUser(null);
        navigate('/login');
    };

    const value = {
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};