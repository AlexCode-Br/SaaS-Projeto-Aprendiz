// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

// --- CONTROLLERS PARA O CRUD DE INFORMATIVOS ---

/**
 * Lista todos os informativos.
 * Os informativos são ordenados pelos fixados primeiro, e depois pelos mais recentes.
 * GET /api/informativos
 */
exports.listarInformativos = async (req, res) => {
  try {
    const query = 'SELECT * FROM Informativos ORDER BY fixado DESC, data_envio DESC';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar informativos:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Cria um novo informativo.
 * Acessível apenas por 'gestor'.
 * POST /api/informativos
 */
exports.criarInformativo = async (req, res) => {
  const { titulo, conteudo, data_envio, categoria, fixado } = req.body;

  // Validação dos campos obrigatórios
  if (!titulo || !conteudo || !data_envio || !categoria) {
    return res.status(400).json({ error: 'Título, conteúdo, data de envio e categoria são obrigatórios.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO Informativos (titulo, conteudo, data_envio, categoria, fixado) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [titulo, conteudo, data_envio, categoria, fixado || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao criar informativo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Atualiza um informativo existente.
 * Acessível apenas por 'gestor'.
 * PUT /api/informativos/:id
 */
exports.atualizarInformativo = async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, data_envio, categoria, fixado } = req.body;

  // Validação
  if (!titulo || !conteudo || !data_envio || !categoria) {
    return res.status(400).json({ error: 'Título, conteúdo, data de envio e categoria são obrigatórios.' });
  }

  try {
    const result = await db.query(
      `UPDATE Informativos 
       SET titulo = $1, conteudo = $2, data_envio = $3, categoria = $4, fixado = $5, updated_at = NOW() 
       WHERE id = $6 
       RETURNING *`,
      [titulo, conteudo, data_envio, categoria, fixado || false, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Informativo não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao atualizar informativo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Deleta um informativo.
 * Acessível apenas por 'gestor'.
 * DELETE /api/informativos/:id
 */
exports.deletarInformativo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM Informativos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Informativo não encontrado.' });
    }

    res.status(200).json({ message: 'Informativo deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar informativo:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};