import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-surface rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up"
                onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
            >
                {/* Cabeçalho do Modal */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-xl font-semibold text-text-default">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-text-muted hover:text-text-default transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Conteúdo do Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;