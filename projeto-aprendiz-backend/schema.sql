-- Apaga as tabelas existentes para garantir um estado limpo (opcional, útil em desenvolvimento)
DROP TABLE IF EXISTS Frequencias, Inscricoes, Professores_Cursos, TicketsSuporte, Professores, Alunos, Cursos, Usuarios;

-- Apaga os tipos ENUM existentes (se aplicável)
DROP TYPE IF EXISTS papel_usuario;
DROP TYPE IF EXISTS status_aluno;
DROP TYPE IF EXISTS status_frequencia;
DROP TYPE IF EXISTS status_ticket;

-- Criação dos tipos ENUM para garantir a integridade dos dados
CREATE TYPE papel_usuario AS ENUM ('gestor', 'professor');
CREATE TYPE status_aluno AS ENUM ('ativo', 'inativo');
CREATE TYPE status_frequencia AS ENUM ('presente', 'falta', 'justificada');
CREATE TYPE status_ticket AS ENUM ('aberto', 'pendente', 'resolvido');

-- Tabela de Usuários: armazena as credenciais de login e o tipo de usuário.
CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    papel papel_usuario NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Alunos: armazena os dados cadastrais dos alunos.
CREATE TABLE Alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    igreja_bairro VARCHAR(100),
    classe VARCHAR(100),
    status status_aluno NOT NULL DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Professores: vincula um usuário ao perfil de professor.
CREATE TABLE Professores (
    id SERIAL PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) 
        REFERENCES Usuarios(id)
        ON DELETE CASCADE
);

-- Tabela de Cursos: armazena os cursos oferecidos.
CREATE TABLE Cursos (
    id SERIAL PRIMARY KEY,
    nome_curso VARCHAR(255) NOT NULL,
    local VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ligação Professores_Cursos: mapeia quais professores lecionam quais cursos.
CREATE TABLE Professores_Cursos (
    id SERIAL PRIMARY KEY,
    professor_id INT NOT NULL,
    curso_id INT NOT NULL,
    CONSTRAINT fk_professor
        FOREIGN KEY(professor_id) 
        REFERENCES Professores(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_curso
        FOREIGN KEY(curso_id) 
        REFERENCES Cursos(id)
        ON DELETE CASCADE,
    UNIQUE (professor_id, curso_id) -- Garante que um professor não seja associado ao mesmo curso duas vezes
);

-- Tabela de Inscrições: registra a matrícula de um aluno em um curso.
CREATE TABLE Inscricoes (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_inscricao TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_aluno
        FOREIGN KEY(aluno_id) 
        REFERENCES Alunos(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_curso
        FOREIGN KEY(curso_id) 
        REFERENCES Cursos(id)
        ON DELETE CASCADE,
    UNIQUE (aluno_id, curso_id) -- Garante que um aluno não se inscreva no mesmo curso duas vezes
);

-- Tabela de Frequências: armazena o registro de presença dos alunos nas aulas.
CREATE TABLE Frequencias (
    id SERIAL PRIMARY KEY,
    aluno_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_aula DATE NOT NULL,
    status status_frequencia NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_aluno
        FOREIGN KEY(aluno_id) 
        REFERENCES Alunos(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_curso
        FOREIGN KEY(curso_id) 
        REFERENCES Cursos(id)
        ON DELETE CASCADE,
    UNIQUE (aluno_id, curso_id, data_aula) -- Garante um único registro de frequência por aluno, por curso, por dia
);

-- Tabela de Informativos: armazena os comunicados gerais.
CREATE TABLE Informativos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMPTZ NOT NULL,
    categoria VARCHAR(100),
    fixado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Tickets de Suporte: gerencia as solicitações de suporte dos usuários.
CREATE TABLE TicketsSuporte (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    assunto VARCHAR(255) NOT NULL,
    mensagem TEXT NOT NULL,
    status status_ticket NOT NULL DEFAULT 'aberto',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_usuario
        FOREIGN KEY(usuario_id) 
        REFERENCES Usuarios(id)
        ON DELETE CASCADE
);