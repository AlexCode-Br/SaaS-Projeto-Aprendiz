import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';

// Ícones
const EditIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;

const Cursos = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados dos Modais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null); // Para edição ou exclusão

    const showToast = useToast();

    // Busca os cursos da API
    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get('/cursos');
            setCourses(data);
        } catch (error) {
            showToast('Erro ao carregar cursos.', 'error');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Filtra os cursos com base na busca
    const filteredCourses = useMemo(() => 
        courses.filter(course => 
            course.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        ), [courses, searchTerm]);

    // Funções para manipular os modais
    const handleOpenModal = (course = null) => {
        setCurrentCourse(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCourse(null);
    };
    
    const handleOpenDeleteModal = (course) => {
        setCurrentCourse(course);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCurrentCourse(null);
    };

    // Função para salvar (criar ou editar) um curso
    const handleSaveCourse = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const courseData = Object.fromEntries(formData.entries());

        const apiCall = currentCourse 
            ? api.put(`/cursos/${currentCourse.id}`, courseData)
            : api.post('/cursos', courseData);

        try {
            await apiCall;
            showToast(`Curso ${currentCourse ? 'atualizado' : 'criado'} com sucesso!`);
            handleCloseModal();
            fetchCourses(); // Recarrega a lista de cursos
        } catch (error) {
            showToast('Erro ao salvar curso.', 'error');
            console.error(error);
        }
    };
    
    // Função para deletar um curso
    const handleDeleteCourse = async () => {
        if (!currentCourse) return;
        try {
            await api.delete(`/cursos/${currentCourse.id}`);
            showToast('Curso excluído com sucesso!');
            handleCloseDeleteModal();
            fetchCourses(); // Recarrega a lista
        } catch (error) {
            showToast('Erro ao excluir curso.', 'error');
            console.error(error);
        }
    };

    return (
        <>
            {/* Cabeçalho da Página e Ações */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-text-default mb-4 sm:mb-0">Gerenciamento de Cursos</h2>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors">
                    Adicionar Novo Curso
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-surface p-4 rounded-lg border border-border mb-6 animate-fade-in-up delay-100">
                <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou descrição..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent"
                />
            </div>

            {/* Tabela de Cursos */}
            <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden animate-fade-in-up delay-200">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-default">
                        <thead className="bg-gray-50 dark:bg-surface/30 text-xs uppercase text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome do Curso</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="3" className="text-center p-6">Carregando...</td></tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr><td colSpan="3" className="text-center p-6 text-text-muted">Nenhum curso encontrado.</td></tr>
                            ) : (
                                filteredCourses.map(course => (
                                    <tr key={course.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/10 transition-colors">
                                        <td className="px-6 py-4 font-medium">{course.nome}</td>
                                        <td className="px-6 py-4">{course.descricao}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button onClick={() => handleOpenModal(course)} className="p-2 text-text-muted hover:text-primary transition-colors"><EditIcon /></button>
                                                <button onClick={() => handleOpenDeleteModal(course)} className="p-2 text-text-muted hover:text-danger transition-colors"><DeleteIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Adicionar/Editar Curso */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={currentCourse ? 'Editar Curso' : 'Adicionar Novo Curso'}>
                <form onSubmit={handleSaveCourse} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-text-muted mb-1">Nome do Curso</label>
                        <input type="text" id="nome" name="nome" defaultValue={currentCourse?.nome || ''} required className="w-full px-3 py-2 border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-primary/50 transition" />
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-text-muted mb-1">Descrição</label>
                        <textarea id="descricao" name="descricao" rows="4" defaultValue={currentCourse?.descricao || ''} required className="w-full px-3 py-2 border border-border rounded-lg bg-transparent focus:ring-2 focus:ring-primary/50 transition"></textarea>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                         <button type="button" onClick={handleCloseModal} className="px-4 py-2 rounded-lg text-text-default bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancelar</button>
                         <button type="submit" className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary-dark transition">Salvar</button>
                    </div>
                </form>
            </Modal>
            
            {/* Modal de Confirmação de Exclusão */}
            <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteCourse}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o curso "${currentCourse?.nome}"? Esta ação não pode ser desfeita.`}
            />
        </>
    );
};

export default Cursos;