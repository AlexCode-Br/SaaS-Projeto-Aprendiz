const express = require('express');
const router = express.Router();

// Importa o controller
const relatorioController = require('../controllers/relatorioController');

// Importa o middleware de autenticação
const authMiddleware = require('../middleware/authMiddleware');

// --- ROTAS DE RELATÓRIOS (Protegidas para Professores e Gestores) ---

// Aplica o middleware a todas as rotas deste arquivo
router.use(authMiddleware);

// GET /api/relatorios/frequencia: Gera relatório de frequência
router.get('/frequencia', relatorioController.gerarRelatorioFrequencia);

// GET /api/relatorios/evasao: Gera relatório de evasão
router.get('/evasao', relatorioController.gerarRelatorioEvasao);

module.exports = router;