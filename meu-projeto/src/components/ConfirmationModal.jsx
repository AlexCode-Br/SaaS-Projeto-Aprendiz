import React from 'react';
import Modal from './Modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div>
                <p className="text-text-muted mb-6">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-text-default bg-surface border border-border hover:bg-border transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md text-white bg-danger hover:bg-red-700 transition-colors duration-200"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;