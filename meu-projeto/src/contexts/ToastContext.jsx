import React, { createContext, useState, useCallback, useContext } from 'react';

const ToastContext = createContext();

const Toast = ({ message, type, onDismiss }) => {
    const baseStyle = "fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-md transition-transform transform ";
    const typeStyles = {
        success: "bg-success text-white",
        error: "bg-danger text-white",
    };

    // Animação de entrada e saída
    const [isVisible, setIsVisible] = useState(false);
    React.useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Espera a animação de saída terminar antes de remover o componente
            setTimeout(onDismiss, 300); 
        }, 3000); // O toast fica visível por 3 segundos

        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className={`${baseStyle} ${typeStyles[type]} ${isVisible ? 'translate-x-0' : 'translate-x-[120%]'}`}>
            {message}
        </div>
    );
};


export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            <div className="fixed top-5 right-5 z-50 space-y-2">
                {toasts.map(({ id, message, type }) => (
                    <Toast key={id} message={message} type={type} onDismiss={() => dismissToast(id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    return useContext(ToastContext);
};