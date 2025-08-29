import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

// --- Componentes ---
import CustomSelect from '../../components/CustomSelect';
import DynamicReportTable from '../../components/DynamicReportTable'; // Um novo componente para tabelas dinâmicas
import { exportToCSV, exportToPDF } from '../../utils/exportUtils'; // Funções de exportação

const Relatorios = () => {
    // --- Estados ---
    const [activeTab, setActiveTab] = useState('frequencia');
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState([]);
    
    // Estados dos Filtros
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        cursoId: null,
        professorId: null,
    });

    // Opções para os filtros de select
    const [cursoOptions, setCursoOptions] = useState([]);
    const [professorOptions, setProfessorOptions] = useState([]);

    const { showToast } = useToast();

    // --- Carregamento de Opções para Filtros ---
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const [cursosRes, professoresRes] = await Promise.all([
                    api.get('/cursos'),
                    api.get('/professores?limit=1000') // Pega todos para o filtro
                ]);
                setCursoOptions(cursosRes.data.cursos.map(c => ({ value: c.id, label: c.nome })));
                setProfessorOptions(professoresRes.data.professores.map(p => ({ value: p.id, label: p.nome })));
            } catch (error) {
                showToast('Erro ao carregar filtros.', 'error');
            }
        };
        fetchFilterOptions();
    }, [showToast]);

    // --- Geração do Relatório ---
    const generateReport = useCallback(async () => {
        setLoading(true);
        setReportData([]);
        
        // ** PONTO CRÍTICO DA CORREÇÃO **
        // A URL agora é dinâmica com base na aba ativa (frequencia ou evasao)
        const reportUrl = `/relatorios/${activeTab}`;

        // Monta os parâmetros da query com base nos filtros
        const params = {
            data_inicio: filters.startDate,
            data_fim: filters.endDate,
            curso_id: filters.cursoId?.value,
            professor_id: filters.professorId?.value,
        };

        try {
            const response = await api.get(reportUrl, { params });
            setReportData(response.data);
            if (response.data.length === 0) {
                showToast('Nenhum dado encontrado para os filtros selecionados.', 'info');
            }
        } catch (error) {
            showToast('Erro ao gerar relatório.', 'error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, filters, showToast]);
    
    // --- Handlers ---
    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleExport = (format) => {
        if (reportData.length === 0) {
            showToast('Não há dados para exportar.', 'warning');
            return;
        }
        const headers = Object.keys(reportData[0]).map(key => ({
            label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            key: key
        }));
        
        if (format === 'csv') {
            exportToCSV(reportData, headers, `relatorio_${activeTab}`);
        } else if (format === 'pdf') {
            exportToPDF(reportData, headers, `Relatório de ${activeTab}`);
        }
    };
    
    // Define as colunas da tabela com base no relatório ativo
    const tableColumns = {
        frequencia: [
            { header: 'Aluno', accessor: 'nome_aluno' },
            { header: 'Curso', accessor: 'nome_curso' },
            { header: 'Data', accessor: 'data_aula' },
            { header: 'Status', accessor: 'status' }
        ],
        evasao: [
            { header: 'Curso', accessor: 'nome_curso' },
            { header: 'Total de Alunos', accessor: 'total_alunos' },
            { header: 'Alunos Evadidos', accessor: 'alunos_evadidos' },
            { header: 'Taxa de Evasão (%)', accessor: 'taxa_evasao' }
        ]
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-text-default mb-6">Relatórios</h1>

            {/* Abas de Seleção de Relatório */}
            <div className="mb-6 border-b border-border">
                <nav className="flex space-x-4">
                    <button onClick={() => setActiveTab('frequencia')} className={`py-2 px-4 font-semibold ${activeTab === 'frequencia' ? 'border-b-2 border-primary text-primary' : 'text-text-muted'}`}>
                        Frequência de Alunos
                    </button>
                    <button onClick={() => setActiveTab('evasao')} className={`py-2 px-4 font-semibold ${activeTab === 'evasao' ? 'border-b-2 border-primary text-primary' : 'text-text-muted'}`}>
                        Taxa de Evasão
                    </button>
                </nav>
            </div>

            {/* Filtros */}
            <div className="p-6 bg-surface rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="date" name="startDate" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                    <input type="date" name="endDate" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary"/>
                    <CustomSelect options={cursoOptions} value={filters.cursoId} onChange={(val) => handleFilterChange('cursoId', val)} placeholder="Filtrar por Curso"/>
                    <CustomSelect options={professorOptions} value={filters.professorId} onChange={(val) => handleFilterChange('professorId', val)} placeholder="Filtrar por Professor"/>
                </div>
                <div className="mt-4 flex justify-end">
                    <button onClick={generateReport} disabled={loading} className="px-6 py-2 text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50">
                        {loading ? 'Gerando...' : 'Gerar Relatório'}
                    </button>
                </div>
            </div>

            {/* Resultados */}
            <div className="bg-surface rounded-lg shadow">
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h2 className="text-xl font-semibold">Resultados</h2>
                    <div className="space-x-2">
                        <button onClick={() => handleExport('csv')} className="px-4 py-2 text-sm text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20">Exportar CSV</button>
                        <button onClick={() => handleExport('pdf')} className="px-4 py-2 text-sm text-primary bg-primary/10 border border-primary/20 rounded-md hover:bg-primary/20">Exportar PDF</button>
                    </div>
                </div>
                <DynamicReportTable
                    columns={tableColumns[activeTab]}
                    data={reportData}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default Relatorios;