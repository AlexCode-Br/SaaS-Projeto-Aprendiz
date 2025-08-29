import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../services/api';
import CustomSelect from './CustomSelect'; // Usando um select customizado

const ProfessorFormModal = ({ isOpen, onClose, onSave, professor }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
    });
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [cursos, setCursos] = useState([]);
    const [selectedCursos, setSelectedCursos] = useState([]);
    
    // Carrega a lista de cursos disponíveis
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const response = await api.get('/cursos');
                setCursos(response.data.map(c => ({ value: c.id, label: c.nome })));
            } catch (error) {
                console.error("Erro ao buscar cursos:", error);
            }
        };
        if (isOpen) {
            fetchCursos();
        }
    }, [isOpen]);

    // Preenche o formulário com dados do professor para edição
    useEffect(() => {
        if (professor) {
            setFormData({
                nome: professor.nome || '',
                email: professor.email || '',
                telefone: professor.telefone || '',
            });
            setPreview(professor.foto_url || null);
            // Mapeia os cursos do professor para o formato do CustomSelect
            if (professor.cursos) {
                setSelectedCursos(professor.cursos.map(c => ({ value: c.id, label: c.nome })));
            }
        } else {
             // Limpa o formulário para um novo professor
            setFormData({ nome: '', email: '', telefone: '' });
            setFoto(null);
            setPreview(null);
            setSelectedCursos([]);
        }
    }, [professor, isOpen]);

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
    // A função foi reescrita para usar FormData, permitindo o envio de arquivos e do array de cursos.
    const handleSave = async () => {
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
        if (foto) {
            data.append('foto', foto);
        }
        // O backend espera um array de IDs para os cursos
        selectedCursos.forEach(curso => {
            data.append('cursos[]', curso.value);
        });

        onSave(data, professor?.id);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={professor ? 'Editar Professor' : 'Adicionar Professor'}>
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
                        <label htmlFor="foto-upload-prof" className="cursor-pointer px-4 py-2 text-sm rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                            Carregar Foto
                        </label>
                        <input id="foto-upload-prof" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="Telefone" className="w-full px-3 py-2 border rounded-md bg-surface border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                
                {/* Seleção de Cursos */}
                <CustomSelect
                    options={cursos}
                    isMulti
                    value={selectedCursos}
                    onChange={setSelectedCursos}
                    placeholder="Selecione os cursos..."
                />

                <div className="flex justify-end space-x-4 pt-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-text-default bg-surface border border-border hover:bg-border">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-primary hover:bg-primary-dark">Salvar</button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfessorFormModal;