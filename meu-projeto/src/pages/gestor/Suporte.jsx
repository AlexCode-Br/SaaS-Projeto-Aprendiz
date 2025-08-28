import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api'; // Simulação de API

const Suporte = () => {
    // Mock de dados, já que não há API real
    const allTicketsData = useMemo(() => [
        { id: 1, assunto: 'Dúvida sobre material de Violão II', professor: 'Prof. Flávio Franzin', data: '22/08/2025', status: 'Aberto', descricao: 'O material da aula 5 de Violão II parece estar incompleto. Poderiam verificar, por favor?' },
        { id: 2, assunto: 'Problema ao lançar frequência', professor: 'Prof. Tony Lucas', data: '21/08/2025', status: 'Pendente', descricao: 'Não estou conseguindo salvar a lista de frequência da turma de Teclado de Brotas. O sistema apresenta um erro.' },
        { id: 3, assunto: 'Acesso à plataforma', professor: 'Prof. Daniel Rios', data: '20/08/2025', status: 'Resolvido', descricao: 'Um dos meus alunos, João Silva, não está conseguindo acessar a plataforma. A senha dele parece ter sido bloqueada.' },
    ], []);

    const [tickets, setTickets] = useState(allTicketsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesSearch = ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  ticket.professor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'Todos' || ticket.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tickets, searchTerm, statusFilter]);
    
    // Simplesmente para demonstração. Em um app real, faria chamadas à API.
    const handleStatusChange = (ticketId, newStatus) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 fade-in-up">
                <h2 className="text-2xl font-bold text-text-default mb-4 sm:mb-0">Tickets de Suporte</h2>
            </div>

            <div className="bg-surface p-4 rounded-lg border border-border mb-6 fade-in-up delay-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="search-ticket" className="text-sm font-medium text-text-muted">Pesquisar</label>
                        <input type="text" id="search-ticket" placeholder="Assunto, professor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                    </div>
                    <div>
                         <label htmlFor="filter-status-ticket" className="text-sm font-medium text-text-muted">Status</label>
                         <select id="filter-status-ticket" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent">
                            <option>Todos</option>
                            <option>Aberto</option>
                            <option>Pendente</option>
                            <option>Resolvido</option>
                         </select>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm fade-in-up delay-300 border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-default">
                        <thead className="bg-gray-50 dark:bg-surface/30 text-xs uppercase text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3">Assunto</th>
                                <th scope="col" className="px-6 py-3">Professor</th>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                           {filteredTickets.map(ticket => (
                               <tr key={ticket.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/10 transition-colors">
                                   <td className="px-6 py-4 font-medium">{ticket.assunto}</td>
                                   <td className="px-6 py-4">{ticket.professor}</td>
                                   <td className="px-6 py-4">{ticket.data}</td>
                                   <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            ticket.status === 'Aberto' ? 'bg-danger text-white' :
                                            ticket.status === 'Pendente' ? 'bg-warning text-white' :
                                            'bg-success text-white'
                                        }`}>{ticket.status}</span>
                                   </td>
                                   <td className="px-6 py-4 text-center">
                                       <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                           Detalhes
                                       </button>
                                   </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Suporte;