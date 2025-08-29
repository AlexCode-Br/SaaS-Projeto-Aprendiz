import React from 'react';

// Dados mockados
const activities = [
    { id: 1, text: "Nova aluna, Maria Silva, matriculada em Desenvolvimento Web." },
    { id: 2, text: "Professor Carlos Andrade adicionado à plataforma." },
    { id: 3, text: "Curso de Design UI/UX atualizado com novas aulas." },
    { id: 4, text: "Novo aluno, João Pereira, matriculado em Marketing Digital." },
];

const RecentActivities = () => {
    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1 h-3 w-3 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">{activity.text}</p>
                </div>
            ))}
        </div>
    );
};

export default RecentActivities;