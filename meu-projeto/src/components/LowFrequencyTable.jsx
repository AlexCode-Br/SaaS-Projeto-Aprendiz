import React, { useState, useMemo } from 'react';

// Dados mockados extraídos do protótipo
const lowFrequencyStudentsData = [
    { nome: 'Ricardo Alves', curso: ['Violão I'], local: 'Pituba', contato: 'ricardo.alves@email.com', telefone: '(71) 98877-6655', status: 'Inativo', classe: 'Jovem', igreja: 'Pituba', instrumento: 'Sim, dele próprio' }, { nome: 'Juliana Costa', curso: ['Teclado'], local: 'Brotas', contato: 'juliana.costa@email.com', telefone: '(71) 99988-7766', status: 'Ativo', classe: 'Adolescente', igreja: 'Brotas', instrumento: 'Sim, dele próprio' }, { nome: 'Lucas Martins', curso: ['Bateria'], local: 'Lauro de Freitas', contato: 'lucas.martins@email.com', telefone: '(71) 98123-4567', status: 'Ativo', classe: 'Varão', igreja: 'Lauro de Freitas', instrumento: 'Sim, dele próprio' }, { nome: 'João Pereira', curso: ['Violão I'], local: 'Pituba', contato: 'joao.pereira@email.com', telefone: '(71) 98765-4321', status: 'Ativo', classe: 'Jovem', igreja: 'Pituba', instrumento: 'Sim, dele próprio' }, { nome: 'Maria Clara', curso: ['Canto Coral'], local: 'Pituba', contato: 'maria.clara@email.com', telefone: '(71) 99111-2233', status: 'Ativo', classe: 'Senhora', igreja: 'Pituba', instrumento: 'Não possui' }, { nome: 'Pedro Almeida', curso: ['Bateria'], local: 'Lauro de Freitas', contato: 'pedro.almeida@email.com', telefone: '(71) 98888-9999', status: 'Ativo', classe: 'Adolescente', igreja: 'Lauro de Freitas', instrumento: 'Sim, mas é emprestado' }, { nome: 'Ana Beatriz', curso: ['Teclado'], local: 'Brotas', contato: 'ana.beatriz@email.com', telefone: '(71) 99222-3344', status: 'Ativo', classe: 'Jovem', igreja: 'Brotas', instrumento: 'Sim, dele próprio' }, { nome: 'Lucas Guimarães', curso: ['Violino'], local: 'Brotas', contato: 'lucas.guimaraes@email.com', telefone: '(71) 98181-8282', status: 'Ativo', classe: 'Varão', igreja: 'Brotas', instrumento: 'Não possui' }, { nome: 'Gabriela Santos', curso: ['Flauta Transversal'], local: 'Boca do Rio', contato: 'gabriela.santos@email.com', telefone: '(71) 99333-4455', status: 'Ativo', classe: 'Jovem', igreja: 'Boca do Rio', instrumento: 'Sim, mas é emprestado' }, { nome: 'Rafael Souza', curso: ['Contrabaixo'], local: 'Alto de Coutos', contato: 'rafael.souza@email.com', telefone: '(71) 99666-7788', status: 'Inativo', classe: 'Varão', igreja: 'Alto de Coutos', instrumento: 'Sim, dele próprio' }, { nome: 'Carlos Eduardo', curso: ['Violão II'], local: 'Pituba', contato: 'carlos.edu@email.com', telefone: '(71) 98111-2222', status: 'Ativo', classe: 'Jovem', igreja: 'Pituba', instrumento: 'Sim, dele próprio' }, { nome: 'Beatriz Lima', curso: ['Teoria Musical'], local: 'Remoto', contato: 'bia.lima@email.com', telefone: '(71) 98222-3333', status: 'Ativo', classe: 'Adolescente', igreja: 'Itinga', instrumento: 'Não possui' }, { nome: 'Fernando Mendes', curso: ['Saxofone'], local: 'Brotas', contato: 'fer.mendes@email.com', telefone: '(71) 98333-4444', status: 'Inativo', classe: 'Varão', igreja: 'Brotas', instrumento: 'Sim, mas é emprestado' }, { nome: 'Leticia Barros', curso: ['Flauta Transversal'], local: 'Boca do Rio', contato: 'lele.barros@email.com', telefone: '(71) 98444-5555', status: 'Ativo', classe: 'Jovem', igreja: 'Boca do Rio', instrumento: 'Sim, dele próprio' }, { nome: 'Thiago Correia', curso: ['Bateria'], local: 'Vista Alegre (Remoto)', contato: 'thi.correia@email.com', telefone: '(71) 98555-6666', status: 'Ativo', classe: 'Adolescente', igreja: 'Vista Alegre', instrumento: 'Não possui' }, { nome: 'Amanda Nunes', curso: ['Canto Coral', 'Teclado'], local: 'Pituba', contato: 'amanda.nunes@email.com', telefone: '(71) 98666-7777', status: 'Ativo', classe: 'Senhora', igreja: 'Pituba', instrumento: 'Não possui' }, { nome: 'Gustavo Rocha', curso: ['Contrabaixo'], local: 'Alto de Coutos', contato: 'guga.rocha@email.com', telefone: '(71) 98777-8888', status: 'Inativo', classe: 'Varão', igreja: 'Alto de Coutos', instrumento: 'Sim, dele próprio' }, { nome: 'Larissa Andrade', curso: ['Violino'], local: 'Brotas', contato: 'lari.andrade@email.com', telefone: '(71) 98888-9999', status: 'Ativo', classe: 'Jovem', igreja: 'Brotas', instrumento: 'Sim, mas é emprestado' }, { nome: 'Vinicius Moraes', curso: ['Violão I'], local: 'Lauro de Freitas', contato: 'vini.moraes@email.com', telefone: '(71) 98999-0000', status: 'Ativo', classe: 'Jovem', igreja: 'Lauro de Freitas', instrumento: 'Sim, dele próprio' }, { nome: 'Sofia Ribeiro', curso: ['Teclado'], local: 'Guarani', contato: 'sofi.ribeiro@email.com', telefone: '(71) 99000-1111', status: 'Ativo', classe: 'Adolescente', igreja: 'Guarani', instrumento: 'Não possui' }
];

const LowFrequencyTable = ({ onSelectStudent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const allCourses = useMemo(() => [...new Set(lowFrequencyStudentsData.flatMap(s => s.curso))].sort(), []);

    const filteredData = useMemo(() => {
        return lowFrequencyStudentsData.filter(student => {
            const matchesSearch = student.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCourse = selectedCourse === '' || student.curso.includes(selectedCourse);
            return matchesSearch && matchesCourse;
        });
    }, [searchTerm, selectedCourse]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="mt-6 bg-surface rounded-lg shadow-sm overflow-hidden fade-in-up delay-700 border border-border">
            <div className="p-4 md:p-6"><h3 className="text-lg font-semibold text-text-default">Alunos com Baixa Frequência (&lt;75%)</h3></div>
            
            <div className="p-4 md:px-6 border-y border-border bg-gray-50 dark:bg-surface/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search-low-frequency" className="text-sm font-medium text-text-muted">Pesquisar por Aluno</label>
                        <input 
                            type="text" 
                            id="search-low-frequency" 
                            placeholder="Nome do aluno..." 
                            className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-surface"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-muted">Filtrar por Curso</label>
                         <select 
                            className="relative mt-1 w-full px-3 py-2 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                            value={selectedCourse}
                            onChange={(e) => { setSelectedCourse(e.target.value); setCurrentPage(1); }}
                         >
                            <option value="">Todos os Cursos</option>
                            {allCourses.map(course => <option key={course} value={course}>{course}</option>)}
                         </select>
                    </div>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-text-default">
                    <thead className="bg-gray-50 dark:bg-surface/30 text-xs uppercase text-text-muted">
                        <tr>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Curso</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Aluno</th>
                            <th scope="col" className="px-6 py-3 whitespace-nowrap">Frequência</th>
                            <th scope="col" className="px-6 py-3 text-center whitespace-nowrap">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? paginatedData.map(student => (
                            <tr key={student.contato} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/10 transition-colors duration-200">
                                <td className="px-6 py-4 font-medium">{student.curso.join(', ')}</td>
                                <td className="px-6 py-4">{student.nome}</td>
                                <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger text-text-inverse">68%</span></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button 
                                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-full transition-colors" 
                                            title="Visualizar Aluno"
                                            onClick={() => onSelectStudent(student)}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                        </button>
                                        <button className="p-2 text-danger hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors" title="Excluir Aluno">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center py-10 text-text-muted">Nenhum aluno encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
             <div className="p-4 flex justify-between items-center border-t border-border">
                {totalPages > 1 && (
                    <>
                        <div className="flex-1 text-sm text-text-muted">
                            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} resultados
                        </div>
                        <div className="flex items-center space-x-1">
                            <button 
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-50/10 disabled:text-gray-400 disabled:cursor-not-allowed" 
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </button>
                            {[...Array(totalPages).keys()].map(i => (
                               <button 
                                    key={i + 1}
                                    className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-50/10'}`} 
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-50/10 disabled:text-gray-400 disabled:cursor-not-allowed" 
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LowFrequencyTable;