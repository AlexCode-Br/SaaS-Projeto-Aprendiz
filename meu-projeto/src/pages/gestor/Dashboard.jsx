import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import CustomSelect from '../../components/CustomSelect';
import StudentDetailsModal from '../../components/StudentDetailsModal';

// Ícones dos Cards
const StudentsIcon = () => <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>;
const CoursesIcon = () => <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v11.494m-9-5.747h18"></path></svg>;
const ProfessorsIcon = () => <svg className="w-6 h-6 text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
const SupportIcon = () => <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>;

// Componente para os Cards de Estatísticas
const StatCard = ({ to, title, value, icon, delay }) => (
    <Link to={to} className={`block p-5 bg-surface rounded-lg shadow-sm interactive-card fade-in-up border border-border delay-${delay}`}>
        <div className="grid grid-cols-[1fr,auto] items-center gap-4">
            <div className="min-w-0">
                <p className="text-sm font-medium text-text-muted truncate">{title}</p>
                <p className="text-3xl font-bold text-text-default">{value}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">{icon}</div>
        </div>
    </Link>
);

const GestorDashboard = () => {
    const [isStudentModalOpen, setStudentModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Dados Mock para preencher a UI
    const mockData = {
        stats: { totalAlunos: 1250, cursosAtivos: 12, professores: 48, ticketsPendentes: 3 },
        inscricoesPorCurso: {
            labels: ["Violão I", "Teclado", "Violão II", "Teoria Musical", "Escaleta", "Bateria", "Canto Coral", "Violino"],
            data: [80, 55, 40, 45, 35, 30, 25, 20]
        },
        ultimasInscricoes: [
            { id: 1, nome: 'João Pereira', email: 'joao.pereira@email.com', telefone: '(71) 98765-4321', igreja_bairro: 'Pituba', classe: 'Jovem', instrumento: 'Sim, dele próprio', cursos: [{ nome_curso: "Violão I"}, { nome_curso: "Guarani"}], local: 'Guarani' },
            { id: 2, nome: 'Maria Clara', email: 'maria.clara@email.com', curso: 'Canto Coral', cursos: [{ nome_curso: "Canto Coral"}, { nome_curso: "Violino"}] },
            { id: 3, nome: 'Pedro Almeida', email: 'pedro.almeida@email.com', curso: 'Bateria', cursos: [{ nome_curso: "Bateria"}] },
            { id: 4, nome: 'Ana Beatriz', email: 'ana.beatriz@email.com', curso: 'Teclado', cursos: [{ nome_curso: "Teclado"}] },
            { id: 5, nome: 'Lucas Guimarães', email: 'lucas.guimaraes@email.com', curso: 'Violino', cursos: [{ nome_curso: "Violino"}] },
            { id: 6, nome: 'Gabriela Santos', email: 'gabriela.santos@email.com', curso: 'Flauta Transversal', cursos: [{ nome_curso: "Flauta Transversal"}] },
        ],
        baixaFrequencia: [
            { id: 7, nome: 'Ricardo Alves', curso: 'Violão I', frequencia: '68%' },
            { id: 8, nome: 'Juliana Costa', curso: 'Teclado', frequencia: '71%' },
        ]
    };
    
    const [stats, setStats] = useState(mockData.stats);
    const [chartData, setChartData] = useState(mockData.inscricoesPorCurso);
    const [ultimasInscricoes, setUltimasInscricoes] = useState(mockData.ultimasInscricoes);
    const [baixaFrequencia, setBaixaFrequencia] = useState(mockData.baixaFrequencia);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    
    const openStudentModal = (student) => {
        setSelectedStudent(student);
        setStudentModalOpen(true);
    };

    // Lógica para criar e atualizar o gráfico
    useEffect(() => {
        if (chartRef.current && chartData.labels.length > 0) {
            if (chartInstance.current) chartInstance.current.destroy();

            const isDarkMode = document.documentElement.classList.contains('dark');
            const rootStyles = getComputedStyle(document.documentElement);
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
            const ticksColor = rootStyles.getPropertyValue('--color-text-muted').trim();
            const tooltipBgColor = rootStyles.getPropertyValue('--color-surface').trim();

            chartInstance.current = new Chart(chartRef.current, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Total de Inscrições',
                        data: chartData.data,
                        backgroundColor: 'rgba(183, 28, 28, 0.8)',
                        borderColor: 'rgba(183, 28, 28, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                    }]
                },
                options: {
                    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                    scales: {
                        x: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: ticksColor } },
                        y: { grid: { display: false }, ticks: { color: ticksColor } }
                    },
                    plugins: { legend: { display: false }, tooltip: { displayColors: false, backgroundColor: tooltipBgColor, titleColor: ticksColor, bodyColor: ticksColor } }
                }
            });
        }
    }, [chartData]);


    return (
        <>
            <div className="mb-6 fade-in-up">
                <h2 className="text-2xl font-bold text-text-default">Dashboard Geral</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                <StatCard to="/gestor/alunos" title="Total de Alunos" value={stats.totalAlunos} icon={<StudentsIcon/>} delay="100"/>
                <StatCard to="/gestor/cursos" title="Cursos Ativos" value={stats.cursosAtivos} icon={<CoursesIcon/>} delay="200"/>
                <StatCard to="/gestor/professores" title="Professores" value={stats.professores} icon={<ProfessorsIcon/>} delay="300"/>
                <StatCard to="/gestor/suporte" title="Tickets Pendentes" value={stats.ticketsPendentes} icon={<SupportIcon/>} delay="400"/>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                <div className="xl:col-span-2 p-4 md:p-6 bg-surface rounded-lg shadow-sm fade-in-up delay-500 border border-border">
                    <h3 className="text-lg font-semibold text-text-default">Total de Inscrições por Curso</h3>
                    <div className="mt-4" style={{ position: 'relative', height: '40vh', minHeight: '320px' }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
                <div className="p-4 md:p-6 bg-surface rounded-lg shadow-sm fade-in-up delay-600 border border-border">
                    <h3 className="text-lg font-semibold text-text-default">Últimas Inscrições</h3>
                    <ul className="mt-4 -mx-2 space-y-1">
                        {ultimasInscricoes.map((insc) => (
                            <li key={insc.id}>
                                <button onClick={() => openStudentModal(insc)} className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50/10 transition-colors duration-200 text-left">
                                    <div className="w-10 h-10 rounded-full bg-primary text-text-inverse flex-shrink-0 flex items-center justify-center font-bold">
                                        {insc.nome.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-text-default truncate">{insc.nome}</p>
                                        <p className="text-xs text-text-muted truncate">{insc.curso || 'Curso não especificado'}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="mt-6 bg-surface rounded-lg shadow-sm overflow-hidden fade-in-up delay-700 border border-border">
                <div className="p-4 md:p-6"><h3 className="text-lg font-semibold text-text-default">Alunos com Baixa Frequência (&lt;75%)</h3></div>
                <div className="p-4 md:px-6 border-y border-border bg-gray-50 dark:bg-surface/30">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-muted">Pesquisar por Aluno</label>
                            <input type="text" placeholder="Nome do aluno..." className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-muted">Filtrar por Curso</label>
                            <CustomSelect options={[{value: 'v1', label: 'Violão I'}]} placeholder="Todos os Cursos" onSelect={() => {}} />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-default">
                        <thead className="bg-gray-50 dark:bg-surface/30 text-xs uppercase text-text-muted">
                            <tr>
                                <th scope="col" className="px-6 py-3">Aluno</th>
                                <th scope="col" className="px-6 py-3">Curso</th>
                                <th scope="col" className="px-6 py-3">Frequência</th>
                            </tr>
                        </thead>
                        <tbody>
                           {baixaFrequencia.map((aluno) => (
                               <tr key={aluno.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/10">
                                   <td className="px-6 py-4 font-medium">{aluno.nome}</td>
                                   <td className="px-6 py-4">{aluno.curso}</td>
                                   <td className="px-6 py-4">
                                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger text-text-inverse">{aluno.frequencia}</span>
                                   </td>
                               </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <StudentDetailsModal 
                isOpen={isStudentModalOpen}
                onClose={() => setStudentModalOpen(false)}
                student={selectedStudent}
            />
        </>
    );
};

export default GestorDashboard;