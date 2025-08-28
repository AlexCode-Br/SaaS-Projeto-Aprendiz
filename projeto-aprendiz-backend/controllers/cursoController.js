// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

// --- CONTROLLERS PARA O CRUD DE CURSOS ---

/**
 * Lista todos os cursos disponíveis.
 * Acessível por qualquer usuário autenticado.
 * GET /api/cursos
 */
exports.listarCursos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Cursos ORDER BY nome_curso, local ASC');
    res.status(200).json(result.rows);
  } catch (error)
 {
    console.error('Erro ao listar cursos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Cria um novo curso.
 * Acessível apenas por usuários com o papel 'gestor'.
 * POST /api/cursos
 */
exports.criarCurso = async (req, res) => {
  const { nome_curso, local } = req.body;

  // Validação dos campos obrigatórios
  if (!nome_curso || !local) {
    return res.status(400).json({ error: 'Nome do curso e local são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO Cursos (nome_curso, local) VALUES ($1, $2) RETURNING *',
      [nome_curso, local]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Atualiza um curso existente.
 * Acessível apenas por usuários com o papel 'gestor'.
 * PUT /api/cursos/:id
 */
exports.atualizarCurso = async (req, res) => {
  const { id } = req.params;
  const { nome_curso, local } = req.body;

  // Validação dos campos
  if (!nome_curso || !local) {
    return res.status(400).json({ error: 'Nome do curso e local são obrigatórios.' });
  }

  try {
    const result = await db.query(
      'UPDATE Cursos SET nome_curso = $1, local = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [nome_curso, local, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Deleta um curso.
 * Acessível apenas por usuários com o papel 'gestor'.
 * DELETE /api/cursos/:id
 */
exports.deletarCurso = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Cursos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Curso não encontrado.' });
    }

    res.status(200).json({ message: 'Curso deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    // Trata o erro de violação de chave estrangeira (se um curso com alunos for deletado)
    if (error.code === '23503') {
        return res.status(409).json({ error: 'Não é possível deletar o curso, pois existem alunos ou professores inscritos nele.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};