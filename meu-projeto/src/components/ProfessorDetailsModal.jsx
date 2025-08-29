import React from 'react';

// Componente auxiliar para padronizar a exibição dos campos
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-md text-gray-800">{value || 'Não informado'}</p>
  </div>
);

const ProfessorDetailsModal = ({ isOpen, onClose, professor }) => {
  if (!isOpen || !professor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="p-8">
          {/* Cabeçalho do Modal */}
          <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                  <img className="h-16 w-16 rounded-full object-cover" src={professor.foto_url || `https://ui-avatars.com/api/?name=${professor.nome}`} alt={professor.nome} />
                  <div>
                      <h2 className="text-2xl font-bold text-gray-900">{professor.nome}</h2>
                      <p className="text-gray-500">{professor.disciplina_principal}</p>
                  </div>
              </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Informações de Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <DetailField label="E-mail" value={professor.email} />
              <DetailField label="Telefone" value={professor.telefone} />
              <DetailField label="Status" value={professor.status} />
            </div>
            {/* Aqui poderiam entrar mais seções, como "Cursos Associados", etc. */}
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 text-right rounded-b-lg">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetailsModal;