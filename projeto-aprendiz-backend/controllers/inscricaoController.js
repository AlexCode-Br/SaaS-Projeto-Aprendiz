// Importa a configuração de conexão com o banco de dados
const db = require('../config/db');

/**
 * Controller para criar uma nova inscrição.
 * Recebe o nome do curso, busca seu ID, e então insere um novo aluno
 * e sua inscrição em uma única transação.
 */
exports.criarInscricao = async (req, res) => {
  // Extrai os dados do corpo da requisição (agora esperando 'curso' em vez de 'curso_id')
  const { nome, email, telefone, igreja_bairro, classe, curso } = req.body;

  // 1. Validação dos campos obrigatórios atualizada
  if (!nome || !email || !telefone || !igreja_bairro || !classe || !curso) {
    return res.status(400).json({ 
      error: 'Todos os campos são obrigatórios: nome, email, telefone, igreja_bairro, classe e curso.' 
    });
  }

  try {
    // PASSO ADICIONAL: Buscar o ID do curso a partir do nome fornecido
    const cursoResult = await db.query('SELECT id FROM Cursos WHERE nome_curso = $1', [curso]);

    // Valida se o curso foi encontrado
    if (cursoResult.rowCount === 0) {
      return res.status(404).json({ error: `O curso "${curso}" não foi encontrado.` });
    }
    
    const curso_id = cursoResult.rows[0].id;

    // 2. Inserção dos dados em uma transação para garantir a consistência
    // Primeiro, insere o novo aluno na tabela 'Alunos' e retorna o 'id' gerado
    const alunoResult = await db.query(
      `INSERT INTO Alunos (nome, email, telefone, igreja_bairro, classe, status) 
       VALUES ($1, $2, $3, $4, $5, 'ativo') 
       RETURNING id`,
      [nome, email, telefone, igreja_bairro, classe]
    );

    const novoAlunoId = alunoResult.rows[0].id;

    // Em seguida, usa o ID do novo aluno e o ID do curso encontrado para criar a inscrição
    await db.query(
      'INSERT INTO Inscricoes (aluno_id, curso_id) VALUES ($1, $2)',
      [novoAlunoId, curso_id]
    );

    // 3. Retorna uma mensagem de sucesso
    res.status(201).json({ 
      message: 'Inscrição realizada com sucesso!',
      aluno: {
        id: novoAlunoId,
        nome,
        email
      }
    });

  } catch (error) {
    console.error('Erro ao criar inscrição:', error);
    
    // Tratamento de erro para e-mail duplicado (código de violação de unicidade do PostgreSQL)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    // Para outros erros, retorna um erro genérico de servidor
    res.status(500).json({ error: 'Ocorreu um erro interno ao processar a inscrição.' });
  }
};