import React from 'react';

const recentSubscriptionsData = [
    { nome: 'João Pereira', curso: ['Violão I', 'Guarani'] },
    { nome: 'Maria Clara', curso: ['Canto Coral', 'Violino'] },
    { nome: 'Pedro Almeida', curso: ['Bateria'] },
    { nome: 'Ana Beatriz', curso: ['Teclado'] },
    { nome: 'Lucas Guimarães', curso: ['Violino'] },
    { nome: 'Gabriela Santos', curso: ['Flauta Transversal'] },
];

const RecentActivities = () => {
    return (
        <div className="p-4 md:p-6 bg-surface rounded-lg shadow-sm fade-in-up delay-600 border border-border">
            <h3 className="text-lg font-semibold text-text-default">Últimas Inscrições</h3>
            <ul className="mt-4 -mx-2 space-y-1">
                {recentSubscriptionsData.map((student, index) => (
                    <li key={index}>
                        <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-50/10 transition-colors duration-200">
                            <img 
                                className="w-10 h-10 rounded-full" 
                                src={`https://placehold.co/100x100/b71c1c/FFFFFF?text=${student.nome.charAt(0)}`} 
                                alt="Avatar"
                            />
                            <div>
                                <p className="font-semibold text-sm text-text-default">{student.nome}</p>
                                <p className="text-xs text-text-muted">{Array.isArray(student.curso) ? student.curso.join(', ') : student.curso}</p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivities;