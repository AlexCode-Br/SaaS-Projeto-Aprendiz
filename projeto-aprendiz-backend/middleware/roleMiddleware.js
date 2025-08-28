/**
 * Middleware para verificar se o usuário autenticado tem o papel de 'gestor'.
 */
const ehGestor = (req, res, next) => {
  if (req.user && req.user.papel === 'gestor') {
    next();
  } else {
    res.status(403).json({ error: 'Acesso negado. Apenas gestores podem realizar esta ação.' });
  }
};

/**
 * Middleware para verificar se o usuário autenticado tem o papel de 'professor'.
 */
const ehProfessor = (req, res, next) => {
    if (req.user && req.user.papel === 'professor') {
        next();
    } else {
        res.status(403).json({ error: 'Acesso negado. Apenas professores podem realizar esta ação.' });
    }
};

module.exports = {
  ehGestor,
  ehProfessor, // Exporta a nova função
};