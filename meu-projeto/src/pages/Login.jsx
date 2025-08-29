import React, { useState } from 'react';
// CORREÇÃO: Adicionado 'Link' à importação
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Logo from '../assets/logo_projeto_aprendiz.png';

const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.013 3.42-5.32 6.542-6.15M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 2l20 20" />
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { role } = await login(email, password);
            showToast('Login bem-sucedido!', 'success');
            
            const redirectPath = role === 'gestor' ? '/gestor/dashboard' : '/professor/dashboard';
            navigate(redirectPath);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-bg-start to-bg-end px-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-md fade-in-up">
                <div className="text-center">
                    <img 
                        className="h-20 mx-auto bg-primary p-4 rounded-2xl shadow-lg" 
                        src={Logo} 
                        alt="Logo Projeto Aprendiz" 
                    />
                    <h2 className="mt-6 text-2xl font-bold text-text-default">
                        Acesse sua conta
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <input
                            id="email" name="email" type="email" autoComplete="email" required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-3 text-text-default bg-surface border border-border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Email"
                        />
                    </div>
                    
                    <div className="relative">
                        <input
                            id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-3 text-text-default bg-surface border border-border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Senha"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-text-muted"
                        >
                            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input 
                                id="remember-me" name="remember-me" type="checkbox" checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
                                Lembrar-me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link to="/reset-password" className="font-medium text-primary hover:text-primary-dark">
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;