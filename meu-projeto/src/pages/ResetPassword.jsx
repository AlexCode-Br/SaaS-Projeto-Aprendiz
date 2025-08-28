import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_projeto_aprendiz.png';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Lógica de envio de email de redefinição iria aqui
        console.log("Solicitação de redefinição para:", email);
        setTimeout(() => {
            setMessage('Se um email estiver associado a esta conta, um link de redefinição foi enviado.');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-bg-end dark:bg-bg-start">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Logo Projeto Aprendiz"
                        className="h-20 mx-auto bg-primary p-4 rounded-2xl shadow-lg"
                    />
                </div>

                <div className="bg-surface p-8 sm:p-10 rounded-2xl shadow-md border border-border">
                    <h2 className="text-3xl font-bold text-center text-text-default mb-2">Redefinir Senha</h2>
                    <p className="text-center text-text-muted mb-8">Digite seu email para receber o link de redefinição.</p>

                    {message && (
                        <div className="bg-success/10 border border-success/50 text-success px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    )}
                    
                    {!message && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">Email</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </span>
                                    <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-2 bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition" placeholder="seu.email@exemplo.com" />
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors">
                                    {loading ? 'Enviando...' : 'Enviar Link'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-dark">
                            &larr; Voltar para o Login
                        </Link>
                    </div>
                </div>
                 <footer className="text-center mt-8">
                    <p className="text-sm text-text-muted">
                        Versão 1.0.0
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default ResetPassword;