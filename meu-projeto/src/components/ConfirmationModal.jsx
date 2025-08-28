import React from 'react';
import Modal from './Modal';

const WarningIcon = () => (
    <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
                    <WarningIcon />
                </div>
                <h3 className="text-lg leading-6 font-medium text-text-default mt-5">{title}</h3>
                <div className="mt-2">
                    <p className="text-sm text-text-muted">{message}</p>
                </div>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={onClose}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 dark:border-border shadow-sm px-4 py-2 bg-white dark:bg-surface text-base font-medium text-text-default hover:bg-gray-50 dark:hover:bg-gray-50/10 focus:outline-none sm:w-auto sm:text-sm"
                >
                    Não
                </button>
                <button
                    onClick={onConfirm}
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm"
                >
                    Sim
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;