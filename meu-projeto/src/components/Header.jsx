import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Hook para autenticação
import useDarkMode from '../hooks/useDarkMode'; // Hook para o tema

// --- Ícones ---
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
    </svg>
);


// --- Componente Principal ---
const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const { user, logout } = useAuth();
    const [isDark, setIsDark] = useDarkMode();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    // Fecha o dropdown se clicar fora dele
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-sm shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 -mb-px">

                    {/* Botão de Menu (Mobile) */}
                    <div className="flex lg:hidden">
                        <button
                            className="text-text-muted hover:text-text-default"
                            aria-controls="sidebar"
                            aria-expanded={sidebarOpen}
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <span className="sr-only">Abrir sidebar</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Espaçador (para manter os itens da direita alinhados) */}
                    <div className="hidden lg:flex"></div>

                    {/* Controles do Header */}
                    <div className="flex items-center space-x-4">
                        {/* Seletor de Tema */}
                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className="flex items-center justify-center w-8 h-8 rounded-full text-text-muted hover:bg-border transition-colors duration-150"
                        >
                           {isDark ? <SunIcon /> : <MoonIcon />}
                        </button>
                        
                        {/* Divisor */}
                        <div className="w-px h-6 bg-border hidden sm:block"></div>

                        {/* Menu do Usuário */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center space-x-2"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <img 
                                    className="w-8 h-8 rounded-full" 
                                    src={user?.fotoUrl || `https://ui-avatars.com/api/?name=${user?.nome}&background=b71c1c&color=fff`}
                                    alt="Foto do Usuário" 
                                />
                                <div className="hidden sm:block text-left">
                                    <span className="block text-sm font-semibold text-text-default">{user?.nome}</span>
                                    <span className="block text-xs text-text-muted capitalize">{user?.role}</span>
                                </div>
                            </button>

                            {/* Dropdown */}
                            {dropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface ring-1 ring-border ring-opacity-5 focus:outline-none fade-in-up">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <Link to="/configuracoes" className="flex items-center px-4 py-2 text-sm text-text-default hover:bg-border" role="menuitem">
                                           <UserIcon />
                                           <span className="ml-2">Meu Perfil</span>
                                        </Link>
                                        <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-danger hover:bg-border" role="menuitem">
                                           <LogoutIcon />
                                           <span className="ml-2">Sair</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;