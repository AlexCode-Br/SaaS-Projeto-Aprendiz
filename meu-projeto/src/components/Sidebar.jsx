import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo_projeto_aprendiz.png';

// Definição dos Ícones como componentes para clareza
const DashboardIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>;
const CoursesIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v11.494m-9-5.747h18"></path></svg>;
const StudentsIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const ProfessorsIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const ReportsIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const InfoIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>;
const SupportIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const SettingsIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const AttendanceIcon = () => <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>;

// Definição dos links para cada perfil
const gestorLinks = [
    { to: "/gestor/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { to: "/gestor/cursos", text: "Cursos", icon: <CoursesIcon /> },
    { to: "/gestor/alunos", text: "Alunos", icon: <StudentsIcon /> },
    { to: "/gestor/professores", text: "Professores", icon: <ProfessorsIcon /> },
    { to: "/gestor/relatorios", text: "Relatórios", icon: <ReportsIcon /> },
    { to: "/gestor/informativos", text: "Informativos", icon: <InfoIcon /> },
    { to: "/gestor/suporte", text: "Suporte", icon: <SupportIcon /> },
];

const professorLinks = [
    { to: "/professor/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { to: "/professor/alunos", text: "Meus Alunos", icon: <StudentsIcon /> },
    { to: "/professor/frequencia", text: "Frequência", icon: <AttendanceIcon /> },
    { to: "/professor/relatorios", text: "Relatórios", icon: <ReportsIcon /> },
    { to: "/professor/informativos", text: "Informativos", icon: <InfoIcon /> },
    { to: "/professor/suporte", text: "Suporte", icon: <SupportIcon /> },
];

const commonLinks = [
    { to: "/configuracoes", text: "Configurações", icon: <SettingsIcon /> },
];


const Sidebar = ({ user, isOpen }) => {
    const [isDarkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => setDarkMode(!isDarkMode);

    const navLinks = user?.role === 'gestor' ? gestorLinks : professorLinks;
    
    // Estilo aplicado ao link ativo
    const activeLinkStyle = {
        backgroundColor: 'var(--color-primary-dark)',
        color: 'white'
    };

    return (
        <aside 
            className={`bg-primary text-text-inverse w-64 flex-shrink-0 flex-col fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex items-center justify-center h-20 border-b border-white/10 px-6 shrink-0">
                <img src={logo} alt="Projeto Aprendiz Logo" className="h-16 w-auto" />
            </div>
            
            <nav className="flex flex-col flex-1 px-4 py-6 overflow-y-auto">
                <div className="flex-1 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-primary-light transition-all duration-200"
                        >
                            {link.icon}
                            {link.text}
                        </NavLink>
                    ))}
                </div>

                {/* Links Comuns e Botão de Tema */}
                <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
                    {commonLinks.map((link) => (
                         <NavLink
                            key={link.to}
                            to={link.to}
                            style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-primary-light transition-all duration-200"
                        >
                            {link.icon}
                            {link.text}
                        </NavLink>
                    ))}
                    <button onClick={toggleTheme} className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-primary-light transition-all duration-200">
                        {isDarkMode ? (
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ) : (
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                        <span>{isDarkMode ? 'Tema Claro' : 'Tema Escuro'}</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;