// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

/**
 * Gera um relatório de frequência com filtros dinâmicos.
 * GET /api/relatorios/frequencia
 */
exports.gerarRelatorioFrequencia = async (req, res) => {
  const { cursoId, alunoId, dataInicio, dataFim } = req.query;

  try {
    let query = `
      SELECT 
        f.id, 
        f.data_aula, 
        f.status, 
        a.nome as aluno_nome, 
        c.nome_curso, 
        c.local 
      FROM Frequencias f
      JOIN Alunos a ON f.aluno_id = a.id
      JOIN Cursos c ON f.curso_id = c.id
    `;
    
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (cursoId) {
      conditions.push(`f.curso_id = $${paramIndex++}`);
      params.push(cursoId);
    }
    if (alunoId) {
      conditions.push(`f.aluno_id = $${paramIndex++}`);
      params.push(alunoId);
    }
    if (dataInicio) {
      conditions.push(`f.data_aula >= $${paramIndex++}`);
      params.push(dataInicio);
    }
    if (dataFim) {
      conditions.push(`f.data_aula <= $${paramIndex++}`);
      params.push(dataFim);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY f.data_aula DESC, a.nome ASC';

    const { rows } = await db.query(query, params);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao gerar relatório de frequência:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

/**
 * Gera um relatório de evasão, listando alunos com frequência abaixo de 75%.
 * GET /api/relatorios/evasao
 */
exports.gerarRelatorioEvasao = async (req, res) => {
  const { cursoId } = req.query;

  try {
    // Usamos Common Table Expressions (CTEs) para tornar a query mais legível e modular.
    let query = `
      WITH
      CursoAulas AS (
        -- 1. Contar o total de dias de aula para cada curso
        SELECT curso_id, COUNT(DISTINCT data_aula) as total_aulas
        FROM Frequencias
        GROUP BY curso_id
      ),
      AlunoPresencas AS (
        -- 2. Contar o total de presenças de cada aluno em cada curso
        SELECT aluno_id, curso_id, COUNT(*) as aulas_presente
        FROM Frequencias
        WHERE status = 'presente'
        GROUP BY aluno_id, curso_id
      )
      -- 3. Juntar tudo e calcular a porcentagem
      SELECT
        a.id as aluno_id,
        a.nome as aluno_nome,
        a.telefone,
        c.id as curso_id,
        c.nome_curso,
        c.local,
        COALESCE(ap.aulas_presente, 0) as aulas_presente,
        COALESCE(ca.total_aulas, 0) as total_aulas,
        CASE
          WHEN COALESCE(ca.total_aulas, 0) = 0 THEN 0
          ELSE ROUND((COALESCE(ap.aulas_presente, 0) * 100.0) / ca.total_aulas)
        END as porcentagem_frequencia
      FROM Alunos a
      JOIN Inscricoes i ON a.id = i.aluno_id
      JOIN Cursos c ON i.curso_id = c.id
      LEFT JOIN CursoAulas ca ON ca.curso_id = c.id
      LEFT JOIN AlunoPresencas ap ON ap.aluno_id = a.id AND ap.curso_id = c.id
    `;
    
    const conditions = [
      `COALESCE(ca.total_aulas, 0) > 0`, // Considerar apenas cursos que já tiveram aulas
      `(CASE WHEN COALESCE(ca.total_aulas, 0) = 0 THEN 0 ELSE (COALESCE(ap.aulas_presente, 0) * 1.0) / ca.total_aulas END) < 0.75` // Filtro de evasão < 75%
    ];
    const params = [];

    if (cursoId) {
      conditions.push(`c.id = $1`);
      params.push(cursoId);
    }
    
    query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY porcentagem_frequencia ASC, a.nome ASC';

    const { rows } = await db.query(query, params);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Erro ao gerar relatório de evasão:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};