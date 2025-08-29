import React, { useState, useMemo } from 'react';
import InformativoModal from '../../components/InformativoModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';

// Mock data
const initialInformativosData = [
    { id: 1, titulo: 'Início das Inscrições 2025', categoria: 'Inscrições', data: '28/08/2025', hora: '09:00', lido: 120, confirmacoes: 0, fixado: true, conteudo: 'As inscrições para o ano letivo de 2025 estão oficialmente abertas! Garanta sua vaga nos cursos desejados.', confirmacao: false },
    { id: 2, titulo: 'Apresentação de Fim de Ano', categoria: 'Eventos', data: '20/07/2025', hora: '19:00', lido: 150, confirmacoes: 135, fixado: false, conteudo: 'Convidamos todos os alunos, pais e responsáveis para nossa apresentação de fim de ano. Confirme sua presença.', confirmacao: true, linkUrl: '#', linkTexto: 'Confirmar Presença' },
    { id: 3, titulo: 'Manutenção da Plataforma', categoria: 'Geral', data: '15/07/2025', hora: '23:00', lido: 200, confirmacoes: 0, fixado: false, conteudo: 'A plataforma ficará indisponível para manutenção programada no dia 15/07, das 23:00 às 00:00.', confirmacao: false },
    { id: 4, titulo: 'Reunião Urgente de Professores', categoria: 'Urgente', data: '10/07/2025', hora: '18:00', lido: 45, confirmacoes: 45, fixado: false, conteudo: 'Reunião obrigatória para todos os professores sobre o novo cronograma. Favor confirmar a leitura.', confirmacao: true },
];

const Informativos = () => {
    const { showToast } = useToast();
    const [informativos, setInformativos] = useState(initialInformativosData);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
    const [isSendConfirmModalOpen, setSendConfirmModalOpen] = useState(false);
    const [currentInformativo, setCurrentInformativo] = useState(null);
    const [formDataToSave, setFormDataToSave] = useState(null);

    const handleOpenFormModal = (info = null) => {
        setCurrentInformativo(info);
        setFormModalOpen(true);
    };

    const handleOpenDeleteConfirm = (info) => {
        setCurrentInformativo(info);
        setDeleteConfirmModalOpen(true);
    };

    const handleSaveAndOpenConfirm = (formData) => {
        setFormDataToSave(formData);
        setFormModalOpen(false); // Fecha o form
        setSendConfirmModalOpen(true); // Abre a confirmação de envio
    };

    const handleConfirmSend = () => {
        const dataFormatada = new Date(formDataToSave.dataAgendamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

        if (currentInformativo) { // Editando
            const updatedInfo = { ...currentInformativo, ...formDataToSave, data: dataFormatada, hora: formDataToSave.horaAgendamento };
            setInformativos(informativos.map(i => i.id === currentInformativo.id ? updatedInfo : i));
            showToast('success', 'Informativo atualizado com sucesso!');
        } else { // Criando
            const newInfo = {
                id: Date.now(),
                ...formDataToSave,
                data: dataFormatada,
                hora: formDataToSave.horaAgendamento,
                lido: 0,
                confirmacoes: 0,
            };
            setInformativos([newInfo, ...informativos]);
            showToast('success', 'Informativo criado e enviado com sucesso!');
        }
        setSendConfirmModalOpen(false);
        setCurrentInformativo(null);
        setFormDataToSave(null);
    };

    const handleDelete = () => {
        setInformativos(informativos.filter(i => i.id !== currentInformativo.id));
        showToast('success', 'Informativo excluído com sucesso!');
        setDeleteConfirmModalOpen(false);
        setCurrentInformativo(null);
    };
    
    const getCategoryClass = (cat) => ({
        'Geral': 'bg-blue-100 text-blue-800',
        'Inscrições': 'bg-green-100 text-green-800',
        'Eventos': 'bg-purple-100 text-purple-800',
        'Urgente': 'bg-red-100 text-red-800',
    }[cat] || 'bg-gray-100 text-gray-800');

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-default">Informativos</h2>
                <button onClick={() => handleOpenFormModal()} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-dark flex items-center">
                    Criar Novo Informativo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {informativos.map(info => (
                    <div key={info.id} className="bg-surface rounded-lg shadow-sm border border-border flex flex-col">
                        <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${getCategoryClass(info.categoria)}`}>{info.categoria}</span>
                                {info.fixado && <span title="Fixado no topo">📌</span>}
                            </div>
                            <h3 className="font-bold text-lg text-text-default">{info.titulo}</h3>
                            <p className="text-sm text-text-muted mt-1">{info.data} às {info.hora}</p>
                            <p className="text-sm text-text-default mt-4">{info.conteudo}</p>
                        </div>
                        <div className="p-4 border-t border-border flex justify-between items-center text-xs text-text-muted">
                            <div>
                                <span>👁️ {info.lido} Leituras</span>
                                {info.confirmacao && <span className="ml-4">✔️ {info.confirmacoes} Confirmações</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => handleOpenFormModal(info)} className="text-blue-600 hover:underline">Editar</button>
                                <button onClick={() => handleOpenDeleteConfirm(info)} className="text-danger hover:underline">Excluir</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <InformativoModal
                isOpen={isFormModalOpen}
                onClose={() => setFormModalOpen(false)}
                onSave={handleSaveAndOpenConfirm}
                informativo={currentInformativo}
            />

            <ConfirmationModal
                isOpen={isSendConfirmModalOpen}
                onClose={() => setSendConfirmModalOpen(false)}
                onConfirm={handleConfirmSend}
                title="Confirmar Envio?"
                message="O informativo será enviado para todos os destinatários selecionados. Deseja continuar?"
            />

            <ConfirmationModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={() => setDeleteConfirmModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirmar Exclusão?"
                message="Este informativo será permanentemente removido. Esta ação não pode ser desfeita."
            />
        </>
    );
};

export default Informativos;