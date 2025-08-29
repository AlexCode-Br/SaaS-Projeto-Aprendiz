import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// --- Componentes ---
import Pagination from '../../components/Pagination';
import Modal from '../../components/Modal'; // Usando o modal genérico
import ConfirmationModal from '../../components/ConfirmationModal';
import { PencilIcon, TrashIcon } from '../../components/icons';

// --- Componente de Formulário (interno para simplicidade) ---
const CursoForm = ({ curso, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        carga_horaria: ''
    });

    useEffect(() => {
        if (curso) {
            setFormData({
                nome: curso.nome || '',
                descricao: curso.descricao || '',
                carga_horaria: curso.carga_horaria || ''
            });
        } else {
            setFormData({ nome: '', descricao: '', carga_horaria: '' });
        }
    }, [curso]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome do Curso"
                required
                className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição"
                rows="4"
                className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
                type="number"
                name="carga_horaria"
                value={formData.carga_horaria}
                onChange={handleChange}
                placeholder="Carga Horária (horas)"
                required
                className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-text-default bg-surface border border-border hover:bg-border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark">Salvar</button>
            </div>
        </form>
    );
};


// --- Componente Principal da Página ---
const Cursos = () => {
    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCursos, setTotalCursos] = useState(0);
    const [itemsPerPage] = useState(10);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedCurso, setSelectedCurso] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');

    const { showToast } = useToast();

    const fetchCursos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/cursos', {
                params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
            });
            setCursos(response.data.cursos);
            setTotalCursos(response.data.total);
        } catch (err) {
            setError("Não foi possível carregar os cursos.");
            showToast("Erro ao carregar cursos.", 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, showToast]);

    useEffect(() => {
        fetchCursos();
    }, [fetchCursos]);

    const handleOpenFormModal = (curso = null) => {
        setSelectedCurso(curso);
        setIsFormModalOpen(true);
    };

    const handleOpenConfirmModal = (curso) => {
        setSelectedCurso(curso);
        setIsConfirmModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsFormModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedCurso(null);
    };

    const handleSaveCurso = async (formData) => {
        try {
            if (selectedCurso?.id) {
                await api.put(`/cursos/${selectedCurso.id}`, formData);
                showToast('Curso atualizado com sucesso!', 'success');
            } else {
                await api.post('/cursos', formData);
                showToast('Curso criado com sucesso!', 'success');
            }
            fetchCursos();
        } catch (error) {
            showToast('Erro ao salvar curso.', 'error');
        } finally {
            handleCloseModals();
        }
    };

    const handleDeleteCurso = async () => {
        if (!selectedCurso) return;
        try {
            await api.delete(`/cursos/${selectedCurso.id}`);
            showToast('Curso excluído com sucesso!', 'success');
            fetchCursos();
        } catch (error) {
            showToast('Erro ao excluir curso.', 'error');
        } finally {
            handleCloseModals();
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-default mb-6">Gestão de Cursos</h1>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Buscar curso..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full sm:max-w-xs px-4 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={() => handleOpenFormModal()} className="w-full sm:w-auto px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark">
                    Adicionar Curso
                </button>
            </div>

            <div className="bg-surface rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-surface">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Descrição</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Carga Horária</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-4">Carregando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="4" className="text-center py-4 text-danger">{error}</td></tr>
                        ) : cursos.map((curso) => (
                            <tr key={curso.id} className="hover:bg-border/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-default">{curso.nome}</td>
                                <td className="px-6 py-4 text-sm text-text-muted max-w-sm truncate">{curso.descricao}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{curso.carga_horaria}h</td>
                                <td className="px-6 py-4 text-right">
                                     <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleOpenFormModal(curso)} className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-primary/10">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleOpenConfirmModal(curso)} className="text-danger hover:text-red-700 p-1 rounded-full hover:bg-danger/10">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {!loading && !error && cursos.length === 0 && (
                    <div className="text-center py-10 text-text-muted">Nenhum curso encontrado.</div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalCursos}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            <Modal isOpen={isFormModalOpen} onClose={handleCloseModals} title={selectedCurso ? 'Editar Curso' : 'Adicionar Curso'}>
                <CursoForm curso={selectedCurso} onSave={handleSaveCurso} onCancel={handleCloseModals} />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleDeleteCurso}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o curso ${selectedCurso?.nome}?`}
            />
        </div>
    );
};

export default Cursos;