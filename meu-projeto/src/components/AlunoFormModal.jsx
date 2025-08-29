import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../services/api';

const AlunoFormModal = ({ isOpen, onClose, onSave, aluno }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        data_nascimento: '',
    });
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    
    useEffect(() => {
        if (aluno) {
            setFormData({
                nome: aluno.nome || '',
                email: aluno.email || '',
                telefone: aluno.telefone || '',
                endereco: aluno.endereco || '',
                data_nascimento: aluno.data_nascimento ? new Date(aluno.data_nascimento).toISOString().split('T')[0] : '',
            });
            setPreview(aluno.foto_url || null);
        } else {
            // Reset form when opening for a new student
            setFormData({ nome: '', email: '', telefone: '', endereco: '', data_nascimento: '' });
            setFoto(null);
            setPreview(null);
        }
    }, [aluno, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    // ** PONTO CRÍTICO DA CORREÇÃO **
    // A função foi reescrita para usar FormData, permitindo o envio de arquivos.
    const handleSave = async () => {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (foto) {
            data.append('foto', foto);
        }

        onSave(data, aluno?.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={aluno ? 'Editar Aluno' : 'Adicionar Aluno'}>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full bg-border flex-shrink-0">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="foto-upload" className="cursor-pointer px-4 py-2 text-sm rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                            Carregar Foto
                        </label>
                        <input id="foto-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Endereço" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                
                <div className="flex justify-end space-x-4 pt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-text-default bg-surface border border-border hover:bg-border">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark">Salvar</button>
                </div>
            </div>
        </Modal>
    );
};

export default AlunoFormModal;