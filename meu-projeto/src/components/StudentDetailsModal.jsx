import React from 'react';
import Modal from './Modal'; // Reutilizando nosso componente base de Modal

const InfoField = ({ label, value }) => (
    <div>
        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</label>
        <div className="mt-1 p-3 w-full bg-gray-100 dark:bg-black/20 rounded-lg border border-border text-sm text-text-default">
            {value || 'Não informado'}
        </div>
    </div>
);

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
    if (!student) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Dados do Aluno">
            <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Nome Completo" value={student.nome} />
                    <InfoField label="E-mail" value={student.email} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Telefone (WhatsApp)" value={student.telefone} />
                    <InfoField label="Igreja-Bairro" value={student.igreja_bairro} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Classe" value={student.classe} />
                    <InfoField label="Ele possui instrumento?" value={student.instrumento} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Local" value={student.local} />
                    <div>
                        <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider">Cursos</label>
                        <div className="mt-1 p-3 w-full bg-gray-100 dark:bg-black/20 rounded-lg border border-border min-h-[44px]">
                            {student.cursos && student.cursos.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {student.cursos.map((curso, index) => (
                                        <span key={index} className="px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-full">
                                            {curso.nome_curso}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-text-muted">Nenhum curso</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
             <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-lg text-text-default bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition font-semibold"
                >
                    Fechar
                </button>
            </div>
        </Modal>
    );
};

export default StudentDetailsModal;