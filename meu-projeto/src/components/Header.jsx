import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import Modal from './Modal.jsx';

// --- Componente do Modal de Perfil ---
const ProfileModal = ({ isOpen, onClose, user }) => {
    const showToast = useToast();
    const [formData, setFormData] = useState({ nome: '', email: '' });
    const [profilePicturePreview, setProfilePicturePreview] = useState("https://placehold.co/100x100/b71c1c/FFFFFF?text=A");

    useEffect(() => {
        if (user) {
            setFormData({ nome: user.nome, email: user.email });
            // Lógica para carregar a foto do perfil real do usuário, se disponível
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicturePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para submeter a atualização do perfil para a API
        showToast('Perfil atualizado com sucesso!', 'success');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
            <form onSubmit={handleSubmit} noValidate>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <img className="w-20 h-20 rounded-full object-cover" src={profilePicturePreview} alt="Imagem de Perfil" />
                        <div>
                            <label htmlFor="profile-picture-upload-modal" className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                Alterar Imagem
                            </label>
                            <input type="file" id="profile-picture-upload-modal" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                            <p className="text-xs text-text-muted mt-2">JPG, PNG ou GIF. Máx 2MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="modal-profile-name" className="block text-sm font-medium text-text-muted">Nome</label>
                            <input type="text" id="modal-profile-name" value={formData.nome} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                        <div>
                            <label htmlFor="modal-profile-email" className="block text-sm font-medium text-text-muted">Email</label>
                            <input type="email" id="modal-profile-email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-surface/30 px-6 py-4 flex justify-end items-center space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" className="px-6 py-2 text-sm bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
                        Salvar
                    </button>
                </div>
            </form>
        </Modal>
    );
};


// --- Componente Header Principal ---
const Header = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const pageTitle = user?.role === 'gestor' ? 'Painel do Gestor' : 'Painel do Professor';
    
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <>
            <header className="flex-shrink-0 h-20 bg-surface/80 dark:bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-20">
                <div className="w-full px-8 h-full flex items-center justify-between"> {/* Alterado de container mx-auto px-6 para w-full px-8 */}
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-text-muted md:hidden mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-semibold text-text-default truncate">{pageTitle}</h1>
                    </div>
                    
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-full bg-primary text-text-inverse flex items-center justify-center font-bold ring-2 ring-offset-2 ring-surface ring-primary/70 group-hover:ring-primary transition-all duration-300">
                                {getInitials(user?.nome)}
                            </div>
                            <div className="hidden md:block text-left">
                                <div className="font-semibold text-text-default">{user?.nome}</div>
                                <div className="text-sm text-text-muted">{user?.email}</div>
                            </div>
                        </button>
                        <div className={`absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-md py-1 z-50 border border-border transition-all duration-200 ease-out origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <button onClick={() => { setProfileModalOpen(true); setDropdownOpen(false); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-50/10 hover:text-primary transition-colors">
                                Editar Perfil
                            </button>
                            <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-text-muted hover:bg-gray-100 dark:hover:bg-gray-50/10 hover:text-primary transition-colors">
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                user={user}
            />
        </>
    );
};

export default Header;