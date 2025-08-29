import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

// Ícones como componentes para facilitar o uso
const ChevronDownIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
);

const BellIcon = () => <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;

const InfoIcon = () => <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

const UserCircleIcon = () => <svg className="w-6 h-6 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;


// Componente de Toggle Switch customizado
const ToggleSwitch = ({ id, label, enabled, setEnabled }) => (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
        <span className="text-text-default">{label}</span>
        <div className="relative">
            <input id={id} type="checkbox" className="sr-only" checked={enabled} onChange={() => setEnabled(!enabled)} />
            <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
        </div>
    </label>
);


const Configuracoes = () => {
    const { showToast } = useToast();
    const [profileImage, setProfileImage] = useState('https://placehold.co/100x100/b71c1c/FFFFFF?text=A');
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [notifications, setNotifications] = useState({
        newStudent: true,
        newTicket: true,
        courseUpdates: false,
        systemAlerts: true,
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfileImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        // Lógica de validação e salvamento aqui
        showToast('success', 'Perfil atualizado com sucesso!');
    };

    return (
        <>
            <h2 className="text-2xl font-bold text-text-default mb-6">Configurações da Conta</h2>

            <div className="space-y-8">
                {/* Card de Perfil */}
                <div className="bg-surface rounded-lg shadow-sm border border-border">
                    <div className="p-4 md:p-6 border-b border-border flex items-center">
                        <UserCircleIcon/>
                        <h3 className="text-lg font-semibold text-text-default">Perfil</h3>
                    </div>
                    <form onSubmit={handleProfileSubmit}>
                        <div className="p-4 md:p-6 space-y-6">
                            <div className="flex items-center space-x-4">
                                <img src={profileImage} alt="Imagem de Perfil" className="w-20 h-20 rounded-full" />
                                <div>
                                    <label htmlFor="profile-picture-upload" className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                                        Alterar Imagem
                                    </label>
                                    <input type="file" id="profile-picture-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="profile-name" className="block text-sm font-medium text-text-default mb-1">Nome</label>
                                    <input type="text" id="profile-name" defaultValue="Admin Regional" className="w-full px-3 py-2 border border-border rounded-lg" />
                                </div>
                                <div>
                                    <label htmlFor="profile-email" className="block text-sm font-medium text-text-default mb-1">E-mail</label>
                                    <input type="email" id="profile-email" defaultValue="admin@icm.org.br" className="w-full px-3 py-2 border border-border rounded-lg" />
                                </div>
                            </div>
                            <div>
                                <button type="button" onClick={() => setIsPasswordOpen(!isPasswordOpen)} className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <span className="font-semibold text-text-default">Alterar Senha</span>
                                    <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform ${isPasswordOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isPasswordOpen && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-border rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-text-default mb-1">Nova Senha</label>
                                            <input type="password" className="w-full px-3 py-2 border border-border rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-default mb-1">Confirmar Nova Senha</label>
                                            <input type="password" className="w-full px-3 py-2 border border-border rounded-lg" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end p-4 bg-gray-50 dark:bg-surface/30 border-t border-border rounded-b-lg">
                            <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark">Salvar Alterações</button>
                        </div>
                    </form>
                </div>

                {/* Card de Notificações */}
                <div className="bg-surface rounded-lg shadow-sm border border-border">
                     <div className="p-4 md:p-6 border-b border-border flex items-center">
                        <BellIcon/>
                        <h3 className="text-lg font-semibold text-text-default">Notificações</h3>
                    </div>
                    <div className="p-4 md:p-6 space-y-4">
                        <ToggleSwitch id="notif-aluno" label="Receber e-mail para cada novo aluno inscrito" enabled={notifications.newStudent} setEnabled={(val) => setNotifications(p => ({...p, newStudent: val}))} />
                        <ToggleSwitch id="notif-ticket" label="Receber e-mail para cada novo ticket de suporte" enabled={notifications.newTicket} setEnabled={(val) => setNotifications(p => ({...p, newTicket: val}))}/>
                        <ToggleSwitch id="notif-curso" label="Receber e-mail sobre atualizações dos cursos" enabled={notifications.courseUpdates} setEnabled={(val) => setNotifications(p => ({...p, courseUpdates: val}))}/>
                        <ToggleSwitch id="notif-sistema" label="Receber e-mail sobre alertas e manutenções do sistema" enabled={notifications.systemAlerts} setEnabled={(val) => setNotifications(p => ({...p, systemAlerts: val}))}/>
                    </div>
                </div>

                {/* Card Sobre o Sistema */}
                 <div className="bg-surface rounded-lg shadow-sm border border-border">
                    <div className="p-4 md:p-6 border-b border-border flex items-center">
                        <InfoIcon/>
                        <h3 className="text-lg font-semibold text-text-default">Sobre o Sistema</h3>
                    </div>
                    <div className="p-4 md:p-6 text-sm text-text-default space-y-2">
                        <p><strong>Versão do Sistema:</strong> 2.0.1 (Gestor)</p>
                        <p><strong>Última Atualização:</strong> 15 de Agosto de 2025</p>
                        <p>&copy; 2025 Projeto Aprendiz. Todos os direitos reservados.</p>
                        <div className="pt-2">
                            <a href="#" className="text-primary hover:underline">Termos de Serviço</a>
                            <span className="mx-2 text-text-muted">|</span>
                            <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Configuracoes;