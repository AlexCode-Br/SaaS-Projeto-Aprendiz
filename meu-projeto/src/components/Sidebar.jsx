import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/logo_projeto_aprendiz.png';

// --- Ícones da Sidebar (exemplo, substitua pelos seus) ---
const DashboardIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CursosIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>;
const AlunosIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ProfessoresIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const RelatoriosIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FrequenciaIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const InformativosIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>;
const SuporteIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 10-7.07 7.071 5 5 0 007.07-7.071zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SettingsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

// --- Links de Navegação (separados por perfil) ---
const gestorLinks = [
    { path: '/gestor/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/gestor/cursos', icon: <CursosIcon />, label: 'Cursos' },
    { path: '/gestor/alunos', icon: <AlunosIcon />, label: 'Alunos' },
    { path: '/gestor/professores', icon: <ProfessoresIcon />, label: 'Professores' },
    { path: '/gestor/relatorios', icon: <RelatoriosIcon />, label: 'Relatórios' },
    { path: '/gestor/informativos', icon: <InformativosIcon />, label: 'Informativos' },
    { path: '/gestor/suporte', icon: <SuporteIcon />, label: 'Suporte' },
];

const professorLinks = [
    { path: '/professor/dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { path: '/professor/alunos', icon: <AlunosIcon />, label: 'Meus Alunos' },
    { path: '/professor/frequencia', icon: <FrequenciaIcon />, label: 'Frequência' },
    { path: '/professor/relatorios', icon: <RelatoriosIcon />, label: 'Relatórios' },
    { path: '/professor/informativos', icon: <InformativosIcon />, label: 'Informativos' },
    { path: '/professor/suporte', icon: <SuporteIcon />, label: 'Suporte' },
];

// --- Componente Principal ---
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { pathname } = location;
    const { user } = useAuth();
    const sidebar = useRef(null);

    // Fecha a sidebar em telas menores ao clicar fora dela
    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!sidebar.current || !sidebar.current.contains(target)) {
                setSidebarOpen(false);
            }
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    }, [setSidebarOpen]);

    const navigationLinks = user?.role === 'gestor' ? gestorLinks : professorLinks;

    return (
        <aside
            ref={sidebar}
            className={`absolute left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-hidden bg-surface shadow-lg duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            {/* Cabeçalho da Sidebar */}
            <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                <NavLink to="/">
                    <img src={Logo} alt="Logo" className="h-10" />
                </NavLink>

                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-controls="sidebar"
                    aria-expanded={sidebarOpen}
                    className="block lg:hidden text-text-muted hover:text-text-default"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Links de Navegação */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear flex-grow">
                <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
                    <div>
                        <h3 className="mb-4 ml-4 text-sm font-semibold text-text-muted uppercase">MENU</h3>
                        <ul className="mb-6 flex flex-col gap-1.5">
                            {navigationLinks.map((link) => (
                                <li key={link.path}>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-text-muted duration-300 ease-in-out hover:bg-border ' +
                                            (isActive && '!text-primary bg-primary/10')
                                        }
                                    >
                                        {link.icon}
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Espaço no final para Configurações */}
                <div className="mt-auto p-4 lg:p-6">
                     <NavLink
                        to="/configuracoes"
                        className={({ isActive }) =>
                            'group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-text-muted duration-300 ease-in-out hover:bg-border ' +
                            (isActive && '!text-primary bg-primary/10')
                        }
                    >
                        <SettingsIcon />
                        Configurações
                    </NavLink>
                </div>

            </div>
        </aside>
    );
};

export default Sidebar;