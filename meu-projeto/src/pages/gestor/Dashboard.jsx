import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Importando todos os componentes necessários
import Pagination from '../../components/Pagination';
import StatusIndicator from '../../components/StatusIndicator';
import KebabMenu from '../../components/KebabMenu';
import CustomSelect from '../../components/CustomSelect';
import ProfessorFormModal from '../../components/ProfessorFormModal';
import ProfessorDetailsModal from '../../components/ProfessorDetailsModal'; // <-- Novo
import ConfirmationModal from '../../components/ConfirmationModal';
import { PencilIcon } from '../../components/icons/PencilIcon';
import { TrashIcon } from '../../components/icons/TrashIcon';
import { EyeIcon } from '../../components/icons/EyeIcon';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Estados dos modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // <-- Novo
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [professorToDelete, setProfessorToDelete] = useState(null);

  useEffect(() => {
    fetchProfessores();
  }, [currentPage, searchTerm, statusFiltro]);

  const fetchProfessores = async () => {
    try {
      const params = { page: currentPage, search: searchTerm, status: statusFiltro };
      const response = await api.get('/professores', { params });
      setProfessores(response.data.professores);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Erro ao carregar professores.');
    }
  };
  
  const handleOpenFormModal = (professor = null) => {
    setSelectedProfessor(professor);
    setIsFormModalOpen(true);
  };
  
  // <-- Nova função para o modal de detalhes -->
  const handleOpenDetailsModal = (professor) => {
    setSelectedProfessor(professor);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteModal = (professor) => {
    setProfessorToDelete(professor);
    setIsConfirmModalOpen(true);
  };

  const closeAllModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false); // <-- Novo
    setIsConfirmModalOpen(false);
    setSelectedProfessor(null);
    setProfessorToDelete(null);
  };
  
  // <-- FUNÇÃO DE SALVAR ATUALIZADA -->
  const handleSaveProfessor = async (professorData) => {
    const formData = new FormData();
    Object.keys(professorData).forEach(key => {
        if (professorData[key] != null) {
            formData.append(key, professorData[key]);
        }
    });

    try {
      if (selectedProfessor) {
        await api.put(`/professores/${selectedProfessor.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Professor atualizado com sucesso!');
      } else {
        await api.post('/professores', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Professor criado com sucesso!');
      }
      fetchProfessores();
    } catch (error) {
      toast.error(`Erro ao salvar o professor: ${error.response?.data?.message || error.message}`);
    } finally {
      closeAllModals();
    }
  };

  // <-- FUNÇÃO DE DELETAR ATUALIZADA -->
  const handleDeleteProfessor = async () => {
    if (!professorToDelete) return;
    try {
      await api.delete(`/professores/${professorToDelete.id}`);
      toast.success('Professor excluído com sucesso!');
      fetchProfessores();
    } catch (error) {
      toast.error('Erro ao excluir o professor.');
    } finally {
      closeAllModals();
    }
  };
  
  const statusOptions = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
  ];

  return (
    <div className="container mx-auto p-6 animate-fadeInUp">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Professores</h1>
        <button
          onClick={() => handleOpenFormModal()}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-600"
        >
          <span>Novo Professor</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Pesquisar por nome ou disciplina..."
              className="w-full p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CustomSelect
            options={statusOptions}
            placeholder="Filtrar por Status"
            onSelect={(selected) => setStatusFiltro(selected?.value || '')}
          />
        </div>
      </div>

      {/* Tabela de Professores */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disciplina Principal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {professores.map((prof) => (
              <tr key={prof.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={prof.foto_url || `https://ui-avatars.com/api/?name=${prof.nome}&background=random`} alt={prof.nome} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{prof.nome}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prof.disciplina_principal}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{prof.email}</div>
                    <div className="text-xs text-gray-500">{prof.telefone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <StatusIndicator status={prof.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="hidden md:flex items-center justify-end space-x-4">
                    <button onClick={() => handleOpenDetailsModal(prof)} className="text-gray-500 hover:text-blue-600"><EyeIcon /></button>
                    <button onClick={() => handleOpenFormModal(prof)} className="text-gray-500 hover:text-green-600"><PencilIcon /></button>
                    <button onClick={() => handleOpenDeleteModal(prof)} className="text-gray-500 hover:text-red-600"><TrashIcon /></button>
                  </div>
                  <div className="md:hidden">
                    <KebabMenu>
                        <button onClick={() => handleOpenDetailsModal(prof)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Visualizar</button>
                        <button onClick={() => handleOpenFormModal(prof)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</button>
                        <button onClick={() => handleOpenDeleteModal(prof)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Excluir</button>
                    </KebabMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Modais */}
      {isFormModalOpen && <ProfessorFormModal isOpen={isFormModalOpen} onClose={closeAllModals} onSave={handleSaveProfessor} professor={selectedProfessor} />}
      {isDetailsModalOpen && <ProfessorDetailsModal isOpen={isDetailsModalOpen} onClose={closeAllModals} professor={selectedProfessor} />}
      {isConfirmModalOpen && <ConfirmationModal isOpen={isConfirmModalOpen} onClose={closeAllModals} onConfirm={handleDeleteProfessor} title="Confirmar Exclusão" message={`Deseja excluir o professor "${professorToDelete?.nome}"?`} />}
    </div>
  );
};

export default Professores;