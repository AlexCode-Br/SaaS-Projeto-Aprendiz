const express = require('express');
const router = express.Router();

// Importa o controller de frequência
const frequenciaController = require('../controllers/frequenciaController');

// Importa o middleware de autenticação
const authMiddleware = require('../middleware/authMiddleware');

// --- ROTAS DE FREQUÊNCIA (Protegidas para Professores e Gestores) ---

// Aplica o middleware a todas as rotas deste arquivo
router.use(authMiddleware);

// GET /api/frequencia: Busca a lista de alunos e seus status de frequência
router.get('/', frequenciaController.buscarFrequencia);

// POST /api/frequencia: Salva ou atualiza a frequência de múltiplos alunos
router.post('/', frequenciaController.salvarFrequencia);

module.exports = router;