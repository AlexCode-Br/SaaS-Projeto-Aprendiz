import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';

// --- Ícone de Senha ---
const LockIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>;

// --- Componente de Toggle Switch (reutilizável) ---
const ToggleSwitch = ({ id, label, description, checked, onChange }) => (
    <li className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
            <p className="font-medium text-text-default">{label}</p>
            <p className="text-sm text-text-muted">{description}</p>
        </div>
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in flex-shrink-0">
            <input type="checkbox" name={id} id={id} checked={checked} onChange={onChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
            <label htmlFor={id} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"></label>
        </div>
    </li>
);

const ProfessorConfiguracoes = () => {
    const { user, setUser } = useContext(AuthContext);
    const showToast = useToast();
    
    const [formData, setFormData] = useState({ nome: '', email: '' });
    const [profilePicturePreview, setProfilePicturePreview] = useState("https://placehold.co/100x100/b71c1c/FFFFFF?text=P");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        newStudent: true,
        supportTicket: true,
    });

    useEffect(() => {
        if (user) {
            setFormData({ nome: user.nome, email: user.email });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNotificationChange = (e) => {
        const { id, checked } = e.target;
        setNotificationSettings(prev => ({ ...prev, [id]: checked }));
    };
    
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePicturePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };
    
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        showToast('Funcionalidade de edição indisponível para professores.', 'warning');
    };

    return (
        <div className="fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-text-default">Configurações</h2>
            </div>

            <div className="space-y-8 max-w-4xl">
                {/* Card de Perfil */}
                <div className="bg-surface rounded-lg shadow-sm border border-border fade-in-up delay-200">
                    <div className="p-6"><h3 className="text-lg font-semibold text-text-default">Perfil</h3></div>
                    <div className="p-6 border-t border-border">
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <img className="w-20 h-20 rounded-full object-cover" src={profilePicturePreview} alt="Imagem de Perfil" />
                                <div>
                                    <label htmlFor="profile-picture-upload" className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                        Alterar Imagem
                                    </label>
                                    <input type="file" id="profile-picture-upload" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-text-muted">Nome</label>
                                    <input type="text" id="nome" value={formData.nome} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 bg-transparent" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-text-muted">Email</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 bg-transparent" />
                                </div>
                            </div>
                            <div>
                                <button type="button" onClick={() => setShowPasswordFields(!showPasswordFields)} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center space-x-2">
                                    <LockIcon /><span>Alterar Senha</span>
                                </button>
                            </div>
                            {showPasswordFields && (
                                <div className="space-y-4 pt-2">{/* Campos de senha aqui */}</div>
                            )}
                            <div className="pt-4 text-left">
                                <button type="submit" className="px-6 py-2 text-sm bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Card de Notificações */}
                <div className="bg-surface rounded-lg shadow-sm border border-border fade-in-up delay-300">
                     <div className="p-6"><h3 className="text-lg font-semibold text-text-default">Notificações</h3></div>
                    <ul className="divide-y divide-border">
                       <ToggleSwitch 
                            id="newStudent" 
                            label="Novos alunos na sua turma" 
                            description="Receber um e-mail quando um novo aluno se inscrever no seu curso."
                            checked={notificationSettings.newStudent}
                            onChange={handleNotificationChange}
                        />
                         <ToggleSwitch 
                            id="supportTicket" 
                            label="Respostas de tickets de suporte" 
                            description="Receber um e-mail quando um gestor responder a um ticket seu."
                            checked={notificationSettings.supportTicket}
                            onChange={handleNotificationChange}
                        />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfessorConfiguracoes;