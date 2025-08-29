import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo_projeto_aprendiz.png';

// Ícones
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>
);

const CheckCircleIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = () => (
    <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const SuccessAnimation = () => (
    <div className="text-center">
        <svg className="checkmark w-24 h-24 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <p className="text-2xl font-bold text-gray-700 mt-4">Senha alterada com sucesso!</p>
        <p className="text-gray-500">Você será redirecionado para o login...</p>
    </div>
);


const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [strength, setStrength] = useState({
        length: false,
        uppercase: false,
        number: false,
        symbol: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        setStrength({
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            symbol: /[^A-Za-z0-9]/.test(newPassword),
        });
    }, [newPassword]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (newPassword !== confirmPassword) {
            setErrorMessage('As senhas não coincidem.');
            return;
        }

        if (Object.values(strength).some(v => !v)) {
            setErrorMessage('A senha não atende a todos os requisitos de segurança.');
            return;
        }
        
        setShowSuccess(true);
        setTimeout(() => {
            navigate('/login');
        }, 2500);
    };

    return (
        <div className="bg-gray-100">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <img 
                          src={Logo}
                          alt="Logo Projeto Aprendiz" 
                          className="h-20 mx-auto bg-[#b71c1c] p-4 rounded-2xl shadow-lg"
                        />
                    </div>
                    
                    {!showSuccess ? (
                        <div id="reset-container" className="form-container">
                            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl">
                                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Redefinir Senha</h2>
                                <p className="text-center text-gray-500 mb-8">Crie uma nova senha para sua conta.</p>

                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                                        <span className="block sm:inline">{errorMessage}</span>
                                    </div>
                                )}

                                <form id="reset-form" className="space-y-4" onSubmit={handleSubmit} noValidate>
                                    <div>
                                        <div className="relative input-field border border-gray-300 rounded-lg transition-all duration-300">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                            </span>
                                            <input
                                                id="new-password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                                className="w-full pl-10 pr-10 py-3 bg-transparent border-none rounded-lg focus:outline-none"
                                                placeholder="Nova senha"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOffIcon/> : <EyeIcon/>}
                                            </button>
                                        </div>
                                        <div className="password-strength">
                                             {Object.entries(strength).map(([key, valid]) => {
                                                const labels = {
                                                    length: "8+ caracteres",
                                                    uppercase: "1 letra maiúscula",
                                                    number: "1 número",
                                                    symbol: "1 símbolo especial"
                                                };
                                                return (
                                                    <div key={key} className={`strength-item ${valid ? 'valid' : ''}`}>
                                                        <div className="w-4 h-4 mr-2 flex-shrink-0">
                                                            {valid ? <CheckCircleIcon/> : <XCircleIcon/>}
                                                        </div>
                                                        <span>{labels[key]}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="relative input-field border border-gray-300 rounded-lg transition-all duration-300">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </span>
                                        <input
                                            id="confirm-password"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-10 py-3 bg-transparent border-none rounded-lg focus:outline-none"
                                            placeholder="Confirme a nova senha"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                           {showConfirmPassword ? <EyeOffIcon/> : <EyeIcon/>}
                                        </button>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full submit-btn items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                                        >
                                            <span>Redefinir Senha</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                       <SuccessAnimation />
                    )}

                    <footer className="text-center mt-8">
                        <p className="text-sm text-gray-500">
                            Versão 1.0.0
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;