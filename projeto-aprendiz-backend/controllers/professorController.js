// Importa as dependências
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// --- CONTROLLERS PARA O CRUD DE PROFESSORES ---

/**
 * Lista todos os professores com seus respectivos cursos.
 * GET /api/professores
 */
exports.listarProfessores = async (req, res) => {
  try {
    // Query complexa para buscar professores, seus dados de usuário e agregar os cursos em um array JSON.
    const query = `
      SELECT
          p.id,
          u.nome,
          u.email,
          COALESCE(
              json_agg(
                  json_build_object(
                      'id', c.id,
                      'nome_curso', c.nome_curso,
                      'local', c.local
                  )
              ) FILTER (WHERE c.id IS NOT NULL), '[]'::json
          ) as cursos
      FROM Professores p
      JOIN Usuarios u ON p.usuario_id = u.id
      LEFT JOIN Professores_Cursos pc ON p.id = pc.professor_id
      LEFT JOIN Cursos c ON pc.curso_id = c.id
      GROUP BY p.id, u.nome, u.email
      ORDER BY u.nome;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar professores:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Cria um novo professor.
 * Este processo envolve 3 etapas dentro de uma transação:
 * 1. Criar um registro em 'Usuarios'.
 * 2. Criar um registro em 'Professores' vinculado ao usuário.
 * 3. Associar o professor aos cursos em 'Professores_Cursos'.
 * POST /api/professores
 */
exports.criarProfessor = async (req, res) => {
  const { nome, email, cursos } = req.body; // 'cursos' deve ser um array de IDs [1, 2, 3]

  // Validação
  if (!nome || !email || !Array.isArray(cursos)) {
    return res.status(400).json({ error: 'Nome, email e um array de cursos são obrigatórios.' });
  }

  const client = await db.pool.connect(); // Pega uma conexão do pool para a transação

  try {
    await client.query('BEGIN'); // Inicia a transação

    // Etapa 1: Criar o usuário com uma senha padrão
    const senhaPadrao = 'Mudar123';
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senhaPadrao, salt);
    
    const novoUsuarioResult = await client.query(
      `INSERT INTO Usuarios (nome, email, senha_hash, papel) 
       VALUES ($1, $2, $3, 'professor') 
       RETURNING id`,
      [nome, email, senha_hash]
    );
    const novoUsuarioId = novoUsuarioResult.rows[0].id;

    // Etapa 2: Criar o professor vinculado ao usuário
    const novoProfessorResult = await client.query(
      'INSERT INTO Professores (usuario_id) VALUES ($1) RETURNING id',
      [novoUsuarioId]
    );
    const novoProfessorId = novoProfessorResult.rows[0].id;

    // Etapa 3: Associar o professor aos cursos (se houver cursos)
    if (cursos.length > 0) {
      const insertsCursos = cursos.map(cursoId => {
        return client.query(
          'INSERT INTO Professores_Cursos (professor_id, curso_id) VALUES ($1, $2)',
          [novoProfessorId, cursoId]
        );
      });
      await Promise.all(insertsCursos);
    }
    
    await client.query('COMMIT'); // Confirma a transação

    res.status(201).json({
      message: 'Professor criado com sucesso!',
      professor: { id: novoProfessorId, nome, email, cursos }
    });

  } catch (error) {
    await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
    console.error('Erro ao criar professor:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    client.release(); // Libera a conexão de volta para o pool
  }
};

/**
 * Atualiza um professor.
 * PUT /api/professores/:id
 */
exports.atualizarProfessor = async (req, res) => {
  const { id } = req.params; // ID do Professor
  const { nome, email, cursos } = req.body; // Cursos é um array de IDs

  if (!nome || !email || !Array.isArray(cursos)) {
    return res.status(400).json({ error: 'Nome, email e um array de cursos são obrigatórios.' });
  }

  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Encontrar o usuario_id correspondente ao professor_id
    const professorResult = await client.query('SELECT usuario_id FROM Professores WHERE id = $1', [id]);
    if (professorResult.rowCount === 0) {
      throw new Error('Professor não encontrado');
    }
    const usuarioId = professorResult.rows[0].usuario_id;

    // 2. Atualizar os dados na tabela Usuarios
    await client.query(
      'UPDATE Usuarios SET nome = $1, email = $2, updated_at = NOW() WHERE id = $3',
      [nome, email, usuarioId]
    );

    // 3. Atualizar as associações de cursos (delete-then-insert)
    await client.query('DELETE FROM Professores_Cursos WHERE professor_id = $1', [id]);

    if (cursos.length > 0) {
      const insertsCursos = cursos.map(cursoId => {
        return client.query(
          'INSERT INTO Professores_Cursos (professor_id, curso_id) VALUES ($1, $2)',
          [id, cursoId]
        );
      });
      await Promise.all(insertsCursos);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Professor atualizado com sucesso!' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar professor:', error);
    if (error.message === 'Professor não encontrado') {
        return res.status(404).json({ error: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está em uso.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
};

/**
 * Deleta um professor.
 * A deleção do usuário em cascata removerá o registro do professor.
 * DELETE /api/professores/:id
 */
exports.deletarProfessor = async (req, res) => {
  const { id } = req.params; // ID do Professor

  try {
    // 1. Encontrar o usuario_id para deletar o usuário correto
    const professorResult = await db.query('SELECT usuario_id FROM Professores WHERE id = $1', [id]);
    
    if (professorResult.rowCount === 0) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }
    const usuarioId = professorResult.rows[0].usuario_id;

    // 2. Deletar o registro da tabela Usuarios.
    // O ON DELETE CASCADE configurado no schema cuidará de deletar o registro em Professores e Professores_Cursos.
    await db.query('DELETE FROM Usuarios WHERE id = $1', [usuarioId]);

    res.status(200).json({ message: 'Professor deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar professor:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};