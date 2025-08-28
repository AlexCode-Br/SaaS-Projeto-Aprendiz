import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const AddIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

// --- Componente InfoModal ---
const InfoModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        conteudo: '',
        tipo: 'Geral',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Reset form when modal opens
        if (isOpen) {
            setFormData({ titulo: '', conteudo: '', tipo: 'Geral' });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.titulo.trim()) newErrors.titulo = 'O título é obrigatório.';
        if (!formData.conteudo.trim()) newErrors.conteudo = 'O conteúdo é obrigatório.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 opacity-100 px-4">
            <div className="modal-content bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-lg transform scale-100">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-default">Criar Novo Informativo</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-text-default"><CloseIcon /></button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="info-title" className="block text-sm font-medium text-text-default mb-1">Título</label>
                            <input type="text" id="info-title" name="titulo" value={formData.titulo} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent ${errors.titulo ? 'border-danger' : 'border-border'}`} />
                            {errors.titulo && <p className="text-danger text-xs mt-1">{errors.titulo}</p>}
                        </div>
                        <div>
                            <label htmlFor="info-type" className="block text-sm font-medium text-text-default mb-1">Tipo de Informativo</label>
                            <select id="info-type" name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent">
                                <option>Geral</option>
                                <option>Urgente</option>
                                <option>Evento</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="info-content" className="block text-sm font-medium text-text-default mb-1">Conteúdo</label>
                            <textarea id="info-content" name="conteudo" rows="6" value={formData.conteudo} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent ${errors.conteudo ? 'border-danger' : 'border-border'}`}></textarea>
                            {errors.conteudo && <p className="text-danger text-xs mt-1">{errors.conteudo}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end p-6 border-t border-border bg-gray-50 dark:bg-surface/50 rounded-b-lg">
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">Publicar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente Principal Informativos ---
const Informativos = () => {
    const [informativos, setInformativos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInformativos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/informativos');
            // Ordena para que os mais recentes apareçam primeiro
            const sorted = response.data.sort((a, b) => new Date(b.data_publicacao) - new Date(a.data_publicacao));
            setInformativos(sorted);
            setError(null);
        } catch (err) {
            setError("Falha ao carregar os informativos. Tente novamente mais tarde.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInformativos();
    }, [fetchInformativos]);

    const handleSaveInformativo = async (infoData) => {
        try {
            await api.post('/api/informativos', infoData);
            setIsModalOpen(false);
            fetchInformativos(); // Re-fetch para mostrar o novo informativo
        } catch (err) {
            console.error("Falha ao criar informativo:", err);
            // Idealmente, exibir um toast de erro
        }
    };

    const handleDeleteInformativo = async (id) => {
        // Encontra o informativo para remover da UI otimisticamente
        const infoToRemove = informativos.find(info => info.id === id);
        if (infoToRemove) {
            // Adiciona uma classe para a animação de fade-out
            infoToRemove.removing = true;
            setInformativos([...informativos]);

            // Espera a animação terminar antes de remover do estado e chamar a API
            setTimeout(async () => {
                try {
                    await api.delete(`/api/informativos/${id}`);
                    setInformativos(prev => prev.filter(info => info.id !== id));
                } catch (err) {
                    console.error("Falha ao deletar informativo:", err);
                    // Reverte a remoção visual se a API falhar
                    infoToRemove.removing = false;
                    setInformativos([...informativos]);
                }
            }, 500); // Duração da animação
        }
    };

    const getCardClassByType = (type) => {
        switch (type) {
            case 'Urgente':
                return 'border-l-4 border-danger';
            case 'Evento':
                return 'border-l-4 border-yellow-500';
            default:
                return 'border-l-4 border-primary';
        }
    };

    if (loading) return <div className="text-center p-10 text-text-muted">Carregando informativos...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center fade-in-up mb-6">
                <h2 className="text-2xl font-bold text-text-default mb-4 sm:mb-0">Informativos</h2>
                <div className="flex items-center w-full sm:w-auto">
                    <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                        <AddIcon />
                        <span>Novo Informativo</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {informativos.length > 0 ? informativos.map((info, index) => (
                    <div
                        key={info.id}
                        className={`info-card bg-surface rounded-lg shadow-sm border border-border p-6 relative transition-all duration-500 ease-out ${getCardClassByType(info.tipo)} ${info.removing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                        style={{ animation: info.removing ? '' : 'fadeInUp 0.5s ease-out forwards', animationDelay: `${index * 100}ms`, opacity: 0 }}
                    >
                        <button onClick={() => handleDeleteInformativo(info.id)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-text-default transition-colors" title="Marcar como lido">
                            <CloseIcon />
                        </button>
                        <div className="flex items-center mb-2">
                            <span className="text-sm font-semibold text-primary uppercase">{info.tipo}</span>
                        </div>
                        <h3 className="text-xl font-bold text-text-default mb-2">{info.titulo}</h3>
                        <p className="text-text-default mb-4 whitespace-pre-wrap">{info.conteudo}</p>
                        <p className="text-xs text-text-muted">
                            Publicado em {new Date(info.data_publicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                )) : (
                     <div className="text-center py-16 text-text-muted fade-in-up">
                        <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <h3 className="mt-2 text-sm font-medium text-text-default">Nenhum informativo por aqui</h3>
                        <p className="mt-1 text-sm">Quando um novo informativo for publicado, ele aparecerá aqui.</p>
                    </div>
                )}
            </div>
            
            <InfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveInformativo} />
        </>
    );
};

export default Informativos;