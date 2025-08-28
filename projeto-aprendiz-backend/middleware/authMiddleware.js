// Importa a dependência para manipulação de JSON Web Tokens
const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rotas, verificando a validade de um token JWT.
 */
module.exports = function (req, res, next) {
  // Pega o token do cabeçalho 'Authorization' da requisição
  const authHeader = req.header('Authorization');

  // 1. Verifica se o cabeçalho de autorização existe
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado. Token não fornecido.' });
  }

  // O token geralmente vem no formato "Bearer <token>"
  // Nós separamos a string e pegamos apenas a parte do token
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token mal formatado.' });
  }
  const token = tokenParts[1];

  try {
    // 2. Verifica e valida o token usando o segredo
    // Se o token for inválido ou expirado, jwt.verify lançará um erro
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Se o token for válido, anexa o payload decodificado (dados do usuário) ao objeto 'req'
    // Isso torna os dados do usuário (id, nome, papel) acessíveis nas rotas protegidas
    req.user = decoded;

    // Chama a próxima função de middleware ou o controller da rota
    next();
  } catch (error) {
    // Se jwt.verify falhar, retorna um erro de token inválido
    console.error('Erro de autenticação:', error.message);
    res.status(401).json({ error: 'Não autorizado. Token inválido.' });
  }
};