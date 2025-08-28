import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const AddIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const ContactIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const EditIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"></path></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const WhatsAppIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.89 7.89 0 0 0 13.6 2.326zM7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>;
const WarningIcon = () => <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const ChevronDownIcon = () => <svg className="w-4 h-4 ml-2 text-text-muted transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
const ThreeDotsIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>;
const PaginationArrowLeft = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>;
const PaginationArrowRight = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>;


// --- Componente CustomSelect ---
const CustomSelect = ({ options, placeholder, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        const closeDropdown = () => setIsOpen(false);
        if (isOpen) {
            window.addEventListener('click', closeDropdown);
        }
        return () => window.removeEventListener('click', closeDropdown);
    }, [isOpen]);

    return (
        <div className="relative mt-1 custom-select-container">
            <button
                type="button"
                className="flex items-center justify-between w-full px-3 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            >
                <span className="text-sm text-text-default truncate">{selectedValue || placeholder}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <ul className="custom-select-options absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-10">
                    <li
                        data-value=""
                        onClick={() => { onSelect(''); setIsOpen(false); }}
                        className="px-3 py-2 text-sm text-text-muted hover:bg-gray-100 cursor-pointer"
                    >
                        {placeholder}
                    </li>
                    {options.map(option => (
                        <li
                            key={option}
                            data-value={option}
                            onClick={() => { onSelect(option); setIsOpen(false); }}
                            className="px-3 py-2 text-sm text-text-default hover:bg-gray-100 cursor-pointer truncate"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Componente StudentModal ---
const StudentModal = ({ isOpen, onClose, onSave, studentData }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(studentData || {
            nome: '',
            email: '',
            telefone: '',
            igreja_bairro: '',
            classe: '',
            status: 'Ativo'
        });
        setErrors({});
    }, [studentData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const validateForm = () => {
        const newErrors = {};
        if (!formData.nome?.trim()) newErrors.nome = 'O nome é obrigatório.';
        if (!formData.email?.trim()) newErrors.email = 'O email é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido.';
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
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-default">
                        {studentData ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-text-default">
                        <CloseIcon />
                    </button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="student-name" className="block text-sm font-medium text-text-default mb-1">Nome Completo</label>
                            <input type="text" id="student-name" name="nome" value={formData.nome || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent ${errors.nome ? 'border-danger' : 'border-border'}`} />
                            {errors.nome && <p className="text-danger text-xs mt-1">{errors.nome}</p>}
                        </div>
                        <div>
                            <label htmlFor="student-email" className="block text-sm font-medium text-text-default mb-1">Email</label>
                            <input type="email" id="student-email" name="email" value={formData.email || ''} onChange={handleChange} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent ${errors.email ? 'border-danger' : 'border-border'}`} />
                            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="student-phone" className="block text-sm font-medium text-text-default mb-1">Telefone (WhatsApp)</label>
                            <input type="tel" id="student-phone" name="telefone" value={formData.telefone || ''} onChange={handleChange} placeholder="(00) 00000-0000" className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                        <div>
                            <label htmlFor="student-church" className="block text-sm font-medium text-text-default mb-1">Igreja-Bairro</label>
                            <input type="text" id="student-church" name="igreja_bairro" value={formData.igreja_bairro || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                        <div>
                            <label htmlFor="student-class" className="block text-sm font-medium text-text-default mb-1">Classe</label>
                            <input type="text" id="student-class" name="classe" value={formData.classe || ''} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                    </div>
                    <div className="flex justify-end p-6 border-t border-border bg-gray-50 dark:bg-surface/50 rounded-b-lg">
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Componente ConfirmationModal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 opacity-100 px-4">
            <div className="modal-content bg-white dark:bg-surface rounded-lg shadow-xl p-8 w-full max-w-md transform scale-100">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
                        <WarningIcon />
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-text-default mt-5">
                        Confirmar exclusão?
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500 dark:text-text-muted">
                            Esta ação não poderá ser desfeita.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center space-x-4">
                    <button onClick={onConfirm} type="button" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm">
                        Sim
                    </button>
                    <button onClick={onClose} type="button" className="inline-flex justify-center rounded-md border border-gray-300 dark:border-border shadow-sm px-4 py-2 bg-white dark:bg-surface text-base font-medium text-gray-700 dark:text-text-default hover:bg-gray-50 dark:hover:bg-gray-50/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm">
                        Não
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Componente ContactModal ---
const ContactModal = ({ isOpen, onClose, studentData }) => {
    if (!isOpen || !studentData) return null;

    return (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 opacity-100 px-4">
            <div className="modal-content bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-md transform scale-100">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-default">Informações de Contato</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-text-default">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-text-muted">Nome</p>
                        <p className="text-lg font-semibold text-text-default">{studentData.nome}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text-muted">Email</p>
                        <a href={`mailto:${studentData.email}`} className="text-base text-primary hover:underline">{studentData.email}</a>
                    </div>
                    {studentData.telefone && (
                        <div>
                            <p className="text-sm font-medium text-text-muted">Telefone (WhatsApp)</p>
                            <a href={`https://wa.me/${studentData.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-base text-primary hover:underline flex items-center gap-2">
                                <span>{studentData.telefone}</span>
                                <WhatsAppIcon />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal Alunos ---
const Alunos = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    
    // Para o dropdown de ações da tabela em mobile
    const [openActionMenu, setOpenActionMenu] = useState(null);


    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/alunos', {
                params: {
                    search: searchTerm,
                    status: selectedStatus,
                    page: currentPage,
                    limit: itemsPerPage
                }
            });
            
            // Backend precisa retornar students e totalPages
            // Se não, adaptamos aqui
            if (Array.isArray(response.data)) {
                 // Lógica de paginação e filtro no frontend se o backend não suportar
                let filteredData = response.data.filter(s => 
                    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    (selectedStatus === '' || s.status.toLowerCase() === selectedStatus.toLowerCase())
                );
                setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
                setStudents(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));

            } else {
                 // Se o backend já pagina e filtra
                setStudents(response.data.students);
                setTotalPages(response.data.totalPages);
            }

            setError(null);
        } catch (err) {
            setError("Falha ao carregar os dados dos alunos. Tente novamente mais tarde.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, selectedStatus]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleSaveStudent = async (studentData) => {
        try {
            if (studentData.id) {
                await api.put(`/api/alunos/${studentData.id}`, studentData);
            } else {
                await api.post('/api/alunos', studentData);
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (err) {
            console.error("Falha ao salvar aluno:", err);
            // Idealmente, exibir um toast/mensagem de erro para o usuário aqui
        }
    };

    const handleDeleteStudent = async () => {
        if (currentStudent) {
            try {
                await api.delete(`/api/alunos/${currentStudent.id}`);
                setDeleteModalOpen(false);
                setCurrentStudent(null);
                fetchStudents();
            } catch (err) {
                console.error("Falha ao deletar aluno:", err);
            }
        }
    };

    const openModal = (student = null) => {
        setCurrentStudent(student);
        setIsModalOpen(true);
    };

    const openDeleteModal = (student) => {
        setCurrentStudent(student);
        setDeleteModalOpen(true);
    };

    const openContactModal = (student) => {
        setCurrentStudent(student);
        setContactModalOpen(true);
    };
    
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    }
    
    const handleActionMenuToggle = (studentId) => {
        setOpenActionMenu(openActionMenu === studentId ? null : studentId);
    };


    if (loading && students.length === 0) {
        return <div className="text-center p-10 text-text-muted">Carregando alunos...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center fade-in-up mb-6">
                <h2 className="text-2xl font-bold text-text-default mb-4 sm:mb-0">Alunos</h2>
                <div className="flex items-center w-full sm:w-auto">
                    <button onClick={() => openModal()} className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                        <AddIcon />
                        <span>Novo Aluno</span>
                    </button>
                </div>
            </div>

            <div className="filter-card bg-surface p-4 rounded-lg border border-border mb-6 fade-in-up delay-200">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search-aluno" className="text-sm font-medium text-text-muted">Pesquisar</label>
                        <input type="text" id="search-aluno" placeholder="Nome do aluno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-muted">Curso</label>
                        <CustomSelect 
                            options={[]} // Popular com dados da API de cursos se disponível
                            placeholder="Todos os Cursos"
                            selectedValue=""
                            onSelect={() => {}} // Lógica para filtro de curso
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-muted">Status</label>
                         <CustomSelect 
                            options={['Ativo', 'Inativo']}
                            placeholder="Todos"
                            selectedValue={selectedStatus}
                            onSelect={setSelectedStatus}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm overflow-hidden fade-in-up delay-300 border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-default">
                        <thead className="bg-gray-50 dark:bg-gray-50/10 text-xs uppercase text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Nome do Aluno</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Curso</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Local</th>
                                <th scope="col" className="px-6 py-3 whitespace-nowrap">Status</th>
                                <th scope="col" className="px-6 py-3 text-center whitespace-nowrap">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map(student => (
                                <tr key={student.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/5 transition-colors duration-200">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{student.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.curso_interesse || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.igreja_bairro || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status && student.status.toLowerCase() === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="md:hidden flex justify-center">
                                            <div className="relative">
                                                <button onClick={() => handleActionMenuToggle(student.id)} className="p-2 text-text-muted hover:bg-gray-200 rounded-full">
                                                    <ThreeDotsIcon />
                                                </button>
                                                {openActionMenu === student.id && (
                                                    <div className="action-menu-dropdown absolute right-0 mt-1 w-32 bg-white dark:bg-surface rounded-md shadow-lg py-1 z-10 origin-top-right ring-1 ring-black ring-opacity-5">
                                                        <a href="#" onClick={(e) => { e.preventDefault(); openContactModal(student); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-text-default hover:bg-gray-100 dark:hover:bg-gray-50/10">Contato</a>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); openModal(student); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-text-default hover:bg-gray-100 dark:hover:bg-gray-50/10">Editar</a>
                                                        <a href="#" onClick={(e) => { e.preventDefault(); openDeleteModal(student); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-danger hover:bg-red-50">Excluir</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center justify-center space-x-2">
                                            <button onClick={() => openContactModal(student)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors" title="Contato">
                                                <ContactIcon />
                                            </button>
                                            <button onClick={() => openModal(student)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" title="Editar">
                                                <EditIcon />
                                            </button>
                                            <button onClick={() => openDeleteModal(student)} className="p-2 text-danger hover:bg-red-100 rounded-full transition-colors" title="Excluir">
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-text-muted">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex-1 text-sm text-text-muted">
                            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalPages * itemsPerPage)} de {totalPages * itemsPerPage} resultados
                        </div>
                        <div className="flex items-center space-x-1">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-50/10">
                                <PaginationArrowLeft />
                            </button>
                            {[...Array(totalPages).keys()].map(num => (
                                <button key={num + 1} onClick={() => handlePageChange(num + 1)} className={`px-3 py-1 rounded-md ${currentPage === num + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-50/10'}`}>
                                    {num + 1}
                                </button>
                            ))}
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-50/10">
                                <PaginationArrowRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- Modais --- */}
            <StudentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveStudent} studentData={currentStudent} />
            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteStudent} />
            <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} studentData={currentStudent} />
        </>
    );
};

export default Alunos;