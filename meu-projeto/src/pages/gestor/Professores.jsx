import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// --- Componentes ---
import Pagination from '../../components/Pagination';
import ProfessorFormModal from '../../components/ProfessorFormModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { PencilIcon, TrashIcon } from '../../components/icons';

const Professores = () => {
    // --- Estados ---
    const [professores, setProfessores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Paginação
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProfessores, setTotalProfessores] = useState(0);
    const [itemsPerPage] = useState(10);

    // Modais
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState(null);

    // Busca
    const [searchTerm, setSearchTerm] = useState('');

    const { showToast } = useToast();

    // --- Carregamento de Dados ---
    const fetchProfessores = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/professores', {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchTerm,
                }
            });
            setProfessores(response.data.professores);
            setTotalProfessores(response.data.total);
            setError(null);
        } catch (err) {
            setError("Não foi possível carregar os professores.");
            showToast("Erro ao carregar professores.", 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, showToast]);

    useEffect(() => {
        fetchProfessores();
    }, [fetchProfessores]);

    // --- Handlers de Ações ---
    const handleOpenFormModal = (professor = null) => {
        setSelectedProfessor(professor);
        setIsFormModalOpen(true);
    };

    const handleOpenConfirmModal = (professor) => {
        setSelectedProfessor(professor);
        setIsConfirmModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsFormModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedProfessor(null);
    };
    
    // ** PONTO CRÍTICO DA CORREÇÃO **
    // A função foi reescrita para enviar FormData, necessário para upload de foto e lista de cursos.
    const handleSaveProfessor = async (formData, professorId) => {
        try {
            if (professorId) {
                // Atualização
                await api.put(`/professores/${professorId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Professor atualizado com sucesso!', 'success');
            } else {
                // Criação
                await api.post('/professores', formData, {
                     headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast('Professor adicionado com sucesso!', 'success');
            }
            fetchProfessores();
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao salvar professor.';
            showToast(errorMessage, 'error');
            console.error("Erro ao salvar professor:", error);
        } finally {
            handleCloseModals();
        }
    };

    const handleDeleteProfessor = async () => {
        if (!selectedProfessor) return;
        try {
            await api.delete(`/professores/${selectedProfessor.id}`);
            showToast('Professor excluído com sucesso!', 'success');
            fetchProfessores();
        } catch (error) {
            showToast('Erro ao excluir professor.', 'error');
            console.error("Erro ao excluir professor:", error);
        } finally {
            handleCloseModals();
        }
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-default mb-6">Gestão de Professores</h1>

            {/* Barra de Ações */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Buscar professor..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:max-w-xs px-4 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                    onClick={() => handleOpenFormModal()}
                    className="w-full sm:w-auto px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-dark"
                >
                    Adicionar Professor
                </button>
            </div>

            {/* Tabela de Professores */}
            <div className="bg-surface rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-surface">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Foto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase">Cursos</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-text-muted uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Carregando...</td></tr>
                        ) : error ? (
                             <tr><td colSpan="5" className="text-center py-4 text-danger">{error}</td></tr>
                        ) : professores.map((prof) => (
                            <tr key={prof.id} className="hover:bg-border/50">
                                <td className="px-6 py-4">
                                    <img className="h-10 w-10 rounded-full object-cover" src={prof.foto_url || `https://ui-avatars.com/api/?name=${prof.nome}&background=333&color=fff`} alt={prof.nome} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-default">{prof.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{prof.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">
                                    {prof.cursos?.map(c => c.nome).join(', ') || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button onClick={() => handleOpenFormModal(prof)} className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-primary/10">
                                            <PencilIcon />
                                        </button>
                                        <button onClick={() => handleOpenConfirmModal(prof)} className="text-danger hover:text-red-700 p-1 rounded-full hover:bg-danger/10">
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {!loading && !error && professores.length === 0 && (
                    <div className="text-center py-10 text-text-muted">Nenhum professor encontrado.</div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={totalProfessores}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            <ProfessorFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseModals}
                onSave={handleSaveProfessor}
                professor={selectedProfessor}
            />
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleDeleteProfessor}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o professor ${selectedProfessor?.nome}?`}
            />
        </div>
    );
};

export default Professores;