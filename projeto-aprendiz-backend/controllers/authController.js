// Importa as dependências necessárias
const db = require('../config/db'); // Conexão com o banco de dados
const bcrypt = require('bcryptjs'); // Para comparação de senhas hash
const jwt = require('jsonwebtoken'); // Para geração de tokens

/**
 * Controller para autenticar um usuário e gerar um token JWT.
 */
exports.login = async (req, res) => {
  // CORREÇÃO: Usa 'password' para corresponder ao que o frontend envia.
  const { email, password } = req.body;

  // 1. Valida se email e senha foram fornecidos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // 2. Busca o usuário no banco de dados pelo email
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = result.rows[0];

    // Se o usuário não for encontrado, retorna erro de credenciais inválidas
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Compara a senha fornecida com o hash armazenado no banco
    const senhaCorreta = await bcrypt.compare(password, usuario.senha_hash);

    // Se a senha não corresponder, retorna erro de credenciais inválidas
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 4. Se a senha estiver correta, gera um token JWT
    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      papel: usuario.papel,
    };

    // Assina o token com o segredo definido no .env e define um tempo de expiração
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h', // O token expira em 8 horas
    });

    // 5. Retorna o token e os dados do usuário formatados corretamente
    // CORREÇÃO FINAL: Adiciona o objeto 'user' com a propriedade 'role' na resposta.
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.papel, // Envia 'papel' como 'role'
      },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};