import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api'; // Axios instance para chamadas de API

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadUserFromStorage = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                // Configura o token no header do axios para futuras requisições
                api.defaults.headers.Authorization = `Bearer ${token}`;
            }
            setLoading(false);
        };
        loadUserFromStorage();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                api.defaults.headers.Authorization = `Bearer ${data.token}`;
                setUser(data.user);
                
                // Redireciona para o dashboard correto
                const dashboardPath = data.user.role === 'gestor' ? '/gestor/dashboard' : '/professor/dashboard';
                navigate(dashboardPath);
            }
        } catch (error) {
            console.error("Falha no login:", error);
            // Lança o erro para que a página de Login possa tratá-lo
            throw new Error('Credenciais inválidas');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        api.defaults.headers.Authorization = null;
        navigate('/login');
    };

    const value = { user, loading, login, logout };

    // Não renderiza o app até que o estado de autenticação seja verificado
    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};