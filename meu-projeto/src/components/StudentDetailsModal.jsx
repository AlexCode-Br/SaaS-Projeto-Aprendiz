import React from 'react';

// Componente para renderizar um campo de detalhe
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-md text-gray-800">{value || 'Não informado'}</p>
  </div>
);

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeInUp">
        <div className="p-8">
          {/* Cabeçalho do Modal */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detalhes do Aluno</h2>
              <p className="text-gray-500 mt-1">Informações completas de {student.nome}.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            {/* Seção Dados Pessoais */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Dados Pessoais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailField label="Nome Completo" value={student.nome} />
                <DetailField label="CPF" value={student.cpf} />
                <DetailField label="Data de Nascimento" value={new Date(student.data_nascimento).toLocaleDateString()} />
                <DetailField label="E-mail" value={student.email} />
                <DetailField label="Telefone" value={student.telefone} />
                <DetailField label="Status" value={student.status} />
              </div>
            </div>

            {/* Seção Endereço */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Endereço</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailField label="CEP" value={student.cep} />
                <DetailField label="Logradouro" value={`${student.logradouro}, ${student.numero}`} />
                <DetailField label="Bairro" value={student.bairro} />
                <DetailField label="Cidade / UF" value={`${student.cidade} / ${student.estado}`} />
              </div>
            </div>

            {/* Seção Histórico de Cursos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Histórico de Cursos</h3>
              <ul className="space-y-3">
                {/* Mock: idealmente viria da API */}
                <li className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-800">{student.curso_nome}</p>
                  <p className="text-sm text-gray-500">Status: <span className="font-medium text-green-600">Cursando</span></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Rodapé do Modal */}
        <div className="bg-gray-50 px-8 py-4 text-right rounded-b-lg">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;