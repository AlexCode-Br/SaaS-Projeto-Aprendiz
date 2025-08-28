import React, { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const DownloadIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;
const PrintIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>;

const Relatorios = () => {
    // Estado para os filtros do formulário
    const [reportType, setReportType] = useState('alunos_geral');
    const [format, setFormat] = useState('pdf');
    const [course, setCourse] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Estado para a lista de cursos e o histórico de relatórios
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock de dados para o histórico, já que não há API para isso
    const reportHistory = useMemo(() => [
        { id: 1, name: 'Relatório Geral de Alunos - Agosto', date: '28/08/2025', format: 'PDF' },
        { id: 2, name: 'Frequência - Violão I - Julho', date: '01/08/2025', format: 'CSV' },
        { id: 3, name: 'Relatório de Evasão - 1º Semestre', date: '15/07/2025', format: 'PDF' }
    ], []);


    // Busca a lista de cursos para popular o filtro
    const fetchCourses = useCallback(async () => {
        try {
            const response = await api.get('/api/cursos');
            setCourses(response.data);
        } catch (err) {
            console.error("Falha ao carregar cursos:", err);
            // Poderia ter um estado de erro para o filtro de cursos
        } finally {
            setLoadingCourses(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);
    
    // Função para tratar o download do arquivo
    const handleDownload = (data, filename, format) => {
        const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv';
        const blob = new Blob([data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    };


    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            const payload = {
                tipoRelatorio: reportType,
                formato: format,
                filtros: {
                    cursoId: course,
                    dataInicio: startDate,
                    dataFim: endDate
                }
            };
            
            // A API deve responder com o arquivo em si (responseType: 'blob')
            const response = await api.post('/api/relatorios/gerar', payload, {
                responseType: 'blob', 
            });

            const filename = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
            handleDownload(response.data, filename, format);

        } catch (error) {
            console.error("Erro ao gerar relatório:", error);
            // Adicionar um toast ou alerta para o usuário
        } finally {
            setIsGenerating(false);
        }
    };
    
    // Função para impressão (simulada)
    const handlePrint = () => {
        // Em uma aplicação real, isso poderia abrir uma nova aba com uma versão para impressão
        window.print();
    };


    return (
        <div className="fade-in-up">
            <h2 className="text-2xl font-bold text-text-default mb-6">Central de Relatórios</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna de Geração */}
                <div className="lg:col-span-2">
                    <div className="bg-surface rounded-lg shadow-sm border border-border">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-text-default">Gerar Novo Relatório</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Tipo de Relatório */}
                            <div>
                                <label htmlFor="report-type" className="block text-sm font-medium text-text-muted mb-1">Tipo de Relatório</label>
                                <select id="report-type" value={reportType} onChange={e => setReportType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent">
                                    <option value="alunos_geral">Alunos (Geral)</option>
                                    <option value="frequencia">Frequência</option>
                                    <option value="evasao">Evasão</option>
                                    <option value="professores_geral">Professores (Geral)</option>
                                </select>
                            </div>
                            
                            {/* Filtros Condicionais */}
                            {(reportType === 'frequencia' || reportType === 'evasao') && (
                                <div className="p-4 border border-border rounded-lg bg-gray-50 dark:bg-surface/30 space-y-4">
                                    <h4 className="font-semibold text-text-default">Filtros Adicionais</h4>
                                     <div>
                                        <label htmlFor="course-filter" className="block text-sm font-medium text-text-muted mb-1">Curso Específico</label>
                                        <select id="course-filter" value={course} onChange={e => setCourse(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" disabled={loadingCourses}>
                                            <option value="">Todos os Cursos</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="start-date" className="block text-sm font-medium text-text-muted mb-1">Data de Início</label>
                                            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                                        </div>
                                        <div>
                                            <label htmlFor="end-date" className="block text-sm font-medium text-text-muted mb-1">Data de Fim</label>
                                            <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formato */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Formato de Saída</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="format" value="pdf" checked={format === 'pdf'} onChange={e => setFormat(e.target.value)} className="form-radio text-primary focus:ring-primary/50"/>
                                        <span className="text-text-default">PDF</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="format" value="csv" checked={format === 'csv'} onChange={e => setFormat(e.target.value)} className="form-radio text-primary focus:ring-primary/50" />
                                        <span className="text-text-default">CSV</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-border bg-gray-50 dark:bg-surface/30 flex items-center justify-end gap-3">
                            <button onClick={handlePrint} className="px-4 py-2 bg-gray-200 text-text-default font-semibold rounded-lg shadow-sm hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors flex items-center">
                                <PrintIcon />
                                <span>Imprimir</span>
                            </button>
                            <button onClick={handleGenerateReport} disabled={isGenerating} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed">
                                <DownloadIcon />
                                <span>{isGenerating ? 'Gerando...' : 'Gerar e Baixar'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Coluna de Histórico */}
                <aside className="lg:col-span-1">
                     <div className="bg-surface rounded-lg shadow-sm border border-border">
                        <div className="px-6 py-4 border-b border-border">
                            <h3 className="text-lg font-semibold text-text-default">Histórico de Relatórios</h3>
                        </div>
                        <div className="p-4">
                            <ul className="divide-y divide-border">
                                {reportHistory.map(report => (
                                    <li key={report.id} className="py-3 px-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-50/10 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium text-text-default truncate">{report.name}</p>
                                            <p className="text-xs text-text-muted">{report.date}</p>
                                        </div>
                                        <button className="ml-4 p-2 text-text-muted hover:text-primary transition-colors" title={`Baixar ${report.format}`}>
                                            <DownloadIcon />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Relatorios;