import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

// --- Ícones SVG ---
const SaveIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>;

const Frequencia = () => {
    // Estado para a data, alunos, registros de frequência e controle de UI
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Busca os alunos do professor e a frequência para a data selecionada
    const fetchDataForDate = useCallback(async (date) => {
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            // 1. Busca a lista de alunos do professor logado
            const studentsResponse = await api.get('/api/professores/me/alunos');
            const myStudents = studentsResponse.data.alunos || [];
            setStudents(myStudents);

            // 2. Busca registros de frequência existentes para a data
            const attendanceResponse = await api.get(`/api/frequencia/${date}`);
            const existingRecords = attendanceResponse.data;

            // 3. Prepara o estado da frequência
            const initialAttendance = {};
            myStudents.forEach(student => {
                const record = existingRecords.find(r => r.aluno_id === student.id);
                // Por padrão, marca como ausente se não houver registro
                initialAttendance[student.id] = record ? record.status : 'falta';
            });
            setAttendance(initialAttendance);

        } catch (err) {
            setError('Falha ao carregar os dados. Verifique a data e tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Efeito para buscar dados quando a data muda
    useEffect(() => {
        if (selectedDate) {
            fetchDataForDate(selectedDate);
        }
    }, [selectedDate, fetchDataForDate]);

    // Manipulador para alterar o status de frequência de um aluno
    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: status,
        }));
    };

    // Manipulador para salvar todos os registros de frequência
    const handleSaveAttendance = async () => {
        setIsSaving(true);
        setError(null);
        setSuccessMessage('');

        const payload = {
            data_aula: selectedDate,
            frequencias: Object.entries(attendance).map(([aluno_id, status]) => ({
                aluno_id: parseInt(aluno_id, 10),
                status,
            })),
        };

        try {
            await api.post('/api/frequencia', payload);
            setSuccessMessage('Frequência salva com sucesso!');
        } catch (err) {
            setError('Ocorreu um erro ao salvar a frequência. Tente novamente.');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fade-in-up">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-default">Lançamento de Frequência</h2>
                    <p className="text-text-muted mt-1">Selecione a data da aula para registrar a presença dos alunos.</p>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-sm border border-border">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div>
                        <label htmlFor="class-date" className="block text-sm font-medium text-text-muted mb-1">Data da Aula</label>
                        <input
                            type="date"
                            id="class-date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition bg-transparent"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-text-muted">Carregando alunos...</div>
                ) : error ? (
                    <div className="p-10 text-center text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-default">
                            <thead className="bg-gray-50 dark:bg-gray-50/10 text-xs uppercase text-text-muted">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Aluno</th>
                                    <th scope="col" className="px-6 py-3 text-center">Presente</th>
                                    <th scope="col" className="px-6 py-3 text-center">Falta</th>
                                    <th scope="col" className="px-6 py-3 text-center">Falta Justificada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id} className="border-b border-border hover:bg-gray-50 dark:hover:bg-gray-50/5">
                                        <td className="px-6 py-4 font-medium">{student.nome}</td>
                                        <td className="px-6 py-4 text-center">
                                            <input type="radio" name={`freq-${student.id}`} value="presente"
                                                checked={attendance[student.id] === 'presente'}
                                                onChange={() => handleAttendanceChange(student.id, 'presente')}
                                                className="form-radio h-5 w-5 text-primary focus:ring-primary/50" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input type="radio" name={`freq-${student.id}`} value="falta"
                                                checked={attendance[student.id] === 'falta'}
                                                onChange={() => handleAttendanceChange(student.id, 'falta')}
                                                className="form-radio h-5 w-5 text-primary focus:ring-primary/50" />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input type="radio" name={`freq-${student.id}`} value="falta_justificada"
                                                checked={attendance[student.id] === 'falta_justificada'}
                                                onChange={() => handleAttendanceChange(student.id, 'falta_justificada')}
                                                className="form-radio h-5 w-5 text-primary focus:ring-primary/50" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {successMessage && <div className="m-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800/30 dark:text-green-300">{successMessage}</div>}
                
                <div className="p-6 border-t border-border bg-gray-50 dark:bg-surface/30 flex justify-end">
                    <button
                        onClick={handleSaveAttendance}
                        disabled={isSaving || loading || students.length === 0}
                        className="w-full sm:w-auto px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <SaveIcon />
                        {isSaving ? 'Salvando...' : 'Salvar Frequência'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Frequencia;