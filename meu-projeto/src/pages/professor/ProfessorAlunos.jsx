import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const ContactIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const WhatsAppIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.89 7.89 0 0 0 13.6 2.326zM7.994 14.521a6.57 6.57 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>;
const ThreeDotsIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>;

// --- Componente ContactModal ---
const ContactModal = ({ isOpen, onClose, studentData }) => {
    if (!isOpen || !studentData) return null;
    return (
        <div className="modal fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 opacity-100 px-4">
            <div className="modal-content bg-white dark:bg-surface rounded-lg shadow-xl w-full max-w-md transform scale-100">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-text-default">Informações de Contato</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-text-default"><CloseIcon /></button>
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
                                <span>{studentData.telefone}</span> <WhatsAppIcon />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal Alunos (Visão do Professor) ---
const AlunosProfessor = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [courseName, setCourseName] = useState('');

    const fetchMyStudents = useCallback(async () => {
        setLoading(true);
        try {
            // Rota hipotética para buscar alunos do professor logado.
            // Se a API não tiver, a lógica seria buscar o professor,
            // ver o curso dele, e depois filtrar a lista geral de alunos.
            const response = await api.get('/api/professores/me/alunos');
            setStudents(response.data.alunos);
            setCourseName(response.data.cursoNome); // Supondo que a API retorne o nome do curso
            setError(null);
        } catch (err) {
            setError("Falha ao carregar os dados dos seus alunos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyStudents();
    }, [fetchMyStudents]);

    const openContactModal = (student) => {
        setCurrentStudent(student);
        setContactModalOpen(true);
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student =>
            student.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    if (loading) return <div className="text-center p-10 text-text-muted">Carregando seus alunos...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center fade-in-up mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-default">Meus Alunos</h2>
                    <p className="text-text-muted mt-1">Alunos matriculados em seu curso: {courseName}</p>
                </div>
            </div>
            
            <div className="bg-surface p-4 rounded-lg border border-border mb-6 fade-in-up delay-200">
                <div>
                    <label htmlFor="search-aluno" className="text-sm font-medium text-text-muted">Pesquisar Aluno</label>
                    <input type="text" id="search-aluno" placeholder="Nome do aluno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm overflow-hidden fade-in-up delay-300 border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-default">
                        <thead className="bg-gray-50 dark:bg-gray-50/10 text-xs uppercase text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome do Aluno</th>
                                <th scope="col" className="px-6 py-3">Igreja/Bairro</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? filteredStudents.map(student => (
                                <tr key={student.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-text-default">{student.nome}</div>
                                        <div className="text-xs text-text-muted">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{student.igreja_bairro || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status && student.status.toLowerCase() === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="md:hidden flex justify-center">
                                            <div className="relative">
                                                <button onClick={() => setOpenActionMenu(openActionMenu === student.id ? null : student.id)} className="p-2 text-text-muted hover:bg-gray-200 rounded-full"><ThreeDotsIcon /></button>
                                                {openActionMenu === student.id && (
                                                    <div className="action-menu-dropdown absolute right-0 mt-1 w-32 bg-white dark:bg-surface rounded-md shadow-lg py-1 z-10 origin-top-right ring-1 ring-black ring-opacity-5">
                                                        <a href="#" onClick={(e) => { e.preventDefault(); openContactModal(student); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-text-default hover:bg-gray-100 dark:hover:bg-gray-50/10">Contato</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex justify-center">
                                            <button onClick={() => openContactModal(student)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors" title="Contato">
                                                <ContactIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-text-muted">
                                        Nenhum aluno encontrado para este curso.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} studentData={currentStudent} />
        </>
    );
};

export default AlunosProfessor;