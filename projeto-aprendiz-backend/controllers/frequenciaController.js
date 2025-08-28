// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

/**
 * Busca a lista de alunos de um curso específico em uma data,
 * juntamente com o status de frequência já registrado para aquele dia.
 * GET /api/frequencia?cursoId=X&data=YYYY-MM-DD
 */
exports.buscarFrequencia = async (req, res) => {
  const { cursoId, data } = req.query;

  // Validação dos query parameters
  if (!cursoId || !data) {
    return res.status(400).json({ error: 'Os parâmetros cursoId e data são obrigatórios.' });
  }

  try {
    // Esta query busca todos os alunos inscritos no curso (via tabela Inscricoes)
    // e faz um LEFT JOIN com a tabela Frequencias para encontrar um registro
    // que corresponda ao aluno, curso e data específicos.
    // Se não houver registro, o status será NULL.
    const query = `
      SELECT
        a.id,
        a.nome,
        f.status
      FROM Alunos a
      JOIN Inscricoes i ON a.id = i.aluno_id
      LEFT JOIN Frequencias f ON a.id = f.aluno_id AND f.curso_id = $1 AND f.data_aula = $2
      WHERE i.curso_id = $1
      ORDER BY a.nome;
    `;
    
    const { rows } = await db.query(query, [cursoId, data]);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao buscar frequência:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Salva ou atualiza os registros de frequência para uma turma em uma data.
 * Utiliza o comando ON CONFLICT (UPSERT) para otimizar a operação.
 * POST /api/frequencia
 */
exports.salvarFrequencia = async (req, res) => {
  const { cursoId, data, alunos } = req.body;

  // Validação dos dados recebidos
  if (!cursoId || !data || !Array.isArray(alunos)) {
    return res.status(400).json({ error: 'cursoId, data e um array de alunos são obrigatórios.' });
  }

  const client = await db.pool.connect(); // Pega uma conexão do pool para a transação

  try {
    await client.query('BEGIN'); // Inicia a transação

    // Prepara todas as queries de UPSERT
    const queries = alunos.map(aluno => {
      const { alunoId, status } = aluno;
      if (!alunoId || !status) {
        throw new Error('Cada aluno no array deve ter "alunoId" e "status".');
      }
      
      const upsertQuery = `
        INSERT INTO Frequencias (aluno_id, curso_id, data_aula, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (aluno_id, curso_id, data_aula)
        DO UPDATE SET status = EXCLUDED.status;
      `;
      return client.query(upsertQuery, [alunoId, cursoId, data, status]);
    });

    // Executa todas as queries em paralelo dentro da transação
    await Promise.all(queries);

    await client.query('COMMIT'); // Confirma a transação

    res.status(200).json({ message: 'Frequência salva com sucesso!' });

  } catch (error) {
    await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
    console.error('Erro ao salvar frequência:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao salvar a frequência.' });
  } finally {
    client.release(); // Libera a conexão de volta para o pool
  }
};