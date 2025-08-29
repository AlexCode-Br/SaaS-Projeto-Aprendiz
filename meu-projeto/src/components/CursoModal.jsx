import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Usando o Modal genérico como base

const CursoModal = ({ isOpen, onClose, onSave, course }) => {
  const [formData, setFormData] = useState({
    nome: '',
    local: '',
    professor_nome: '',
    carga_horaria: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        nome: course.nome || '',
        local: course.local || '',
        professor_nome: course.professor_nome || '',
        carga_horaria: course.carga_horaria || '',
      });
    } else {
      setFormData({
        nome: '',
        local: '',
        professor_nome: '',
        carga_horaria: '',
      });
    }
  }, [course, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const modalTitle = course ? "Editar Curso" : "Adicionar Novo Curso";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} id="curso-form" className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-text-muted">Nome do Curso</label>
          <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="mt-1 w-full p-2 border border-border rounded-md bg-transparent" required />
        </div>
        <div>
          <label htmlFor="local" className="block text-sm font-medium text-text-muted">Local</label>
          <input type="text" name="local" id="local" value={formData.local} onChange={handleChange} className="mt-1 w-full p-2 border border-border rounded-md bg-transparent" required />
        </div>
        <div>
          <label htmlFor="professor_nome" className="block text-sm font-medium text-text-muted">Professor</label>
          <input type="text" name="professor_nome" id="professor_nome" value={formData.professor_nome} onChange={handleChange} className="mt-1 w-full p-2 border border-border rounded-md bg-transparent" />
        </div>
        <div>
          <label htmlFor="carga_horaria" className="block text-sm font-medium text-text-muted">Carga Horária (horas)</label>
          <input type="number" name="carga_horaria" id="carga_horaria" value={formData.carga_horaria} onChange={handleChange} className="mt-1 w-full p-2 border border-border rounded-md bg-transparent" />
        </div>
        <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-default font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">
                Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">
                Salvar
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default CursoModal;