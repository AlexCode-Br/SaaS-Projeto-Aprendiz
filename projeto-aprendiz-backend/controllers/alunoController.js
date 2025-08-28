// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

// --- CONTROLLERS PARA O CRUD DE ALUNOS ---

// 1. Listar todos os alunos (GET /api/alunos)
exports.listarAlunos = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM Alunos ORDER BY nome ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar alunos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// 2. Adicionar um novo aluno (POST /api/alunos) - Apenas Gestor
exports.criarAluno = async (req, res) => {
  const { nome, email, telefone, igreja_bairro, classe, status } = req.body;

  // Validação simples
  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO Alunos (nome, email, telefone, igreja_bairro, classe, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [nome, email, telefone, igreja_bairro, classe, status || 'ativo']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    if (error.code === '23505') { // Violação de unicidade (email)
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// 3. Atualizar um aluno (PUT /api/alunos/:id) - Apenas Gestor
exports.atualizarAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, igreja_bairro, classe, status } = req.body;

  if (!nome || !email || !status) {
    return res.status(400).json({ error: 'Nome, email e status são obrigatórios.' });
  }

  try {
    const result = await db.query(
      `UPDATE Alunos 
       SET nome = $1, email = $2, telefone = $3, igreja_bairro = $4, classe = $5, status = $6, updated_at = NOW() 
       WHERE id = $7 
       RETURNING *`,
      [nome, email, telefone, igreja_bairro, classe, status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está em uso por outro aluno.' });
    }
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// 4. Deletar um aluno (DELETE /api/alunos/:id) - Apenas Gestor
exports.deletarAluno = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Alunos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    res.status(200).json({ message: 'Aluno deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};