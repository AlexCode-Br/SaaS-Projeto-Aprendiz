import React, { useState } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const DownloadIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>;

const ProfessorRelatorios = () => {
    // Estado para os filtros do formulário
    const [reportType, setReportType] = useState('frequencia_turma');
    const [format, setFormat] = useState('pdf');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Estado para controle de UI
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

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
        setError('');
        try {
            const payload = {
                tipoRelatorio: reportType,
                formato: format,
                filtros: {
                    // A API irá inferir o professor/curso a partir do token de autenticação
                    dataInicio: startDate,
                    dataFim: endDate
                }
            };
            
            const response = await api.post('/api/relatorios/gerar', payload, {
                responseType: 'blob', 
            });

            const filename = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
            handleDownload(response.data, filename, format);

        } catch (err) {
            setError("Ocorreu um erro ao gerar o relatório. Tente novamente.");
            console.error("Erro ao gerar relatório:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-default">Meus Relatórios</h2>
                    <p className="text-text-muted mt-1">Gere relatórios de frequência e desempenho da sua turma.</p>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-border">
                <div className="px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-text-default">Gerar Novo Relatório</h3>
                </div>
                <div className="p-6 space-y-6">
                    {/* Tipo de Relatório */}
                    <div>
                        <label htmlFor="report-type" className="block text-sm font-medium text-text-muted mb-1">Tipo de Relatório</label>
                        <select 
                            id="report-type" 
                            value={reportType} 
                            onChange={e => setReportType(e.target.value)} 
                            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent"
                        >
                            <option value="frequencia_turma">Frequência da Turma</option>
                            <option value="desempenho_alunos">Desempenho dos Alunos</option>
                        </select>
                    </div>
                    
                    {/* Período */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start-date" className="block text-sm font-medium text-text-muted mb-1">Data de Início</label>
                            <input 
                                type="date" 
                                id="start-date" 
                                value={startDate} 
                                onChange={e => setStartDate(e.target.value)} 
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" 
                            />
                        </div>
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-text-muted mb-1">Data de Fim</label>
                            <input 
                                type="date" 
                                id="end-date" 
                                value={endDate} 
                                onChange={e => setEndDate(e.target.value)} 
                                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent" 
                            />
                        </div>
                    </div>

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

                {error && <div className="mx-6 mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-800/30 dark:text-red-300">{error}</div>}

                <div className="px-6 py-4 border-t border-border bg-gray-50 dark:bg-surface/30 flex items-center justify-end">
                    <button 
                        onClick={handleGenerateReport} 
                        disabled={isGenerating} 
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <DownloadIcon />
                        <span>{isGenerating ? 'Gerando...' : 'Gerar e Baixar'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfessorRelatorios;