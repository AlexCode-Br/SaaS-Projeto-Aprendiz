const express = require('express');
const router = express.Router();

// Importa o controller
const informativoController = require('../controllers/informativoController');

// Importa os middlewares
const authMiddleware = require('../middleware/authMiddleware');
const { ehGestor } = require('../middleware/roleMiddleware');

// --- ROTAS DE INFORMATIVOS ---

// GET /api/informativos: Lista todos os informativos.
// Rota protegida: Acessível para gestores e professores autenticados.
router.get('/', authMiddleware, informativoController.listarInformativos);

// POST /api/informativos: Cria um novo informativo.
// Rota protegida e autorizada: Apenas gestores.
router.post('/', authMiddleware, ehGestor, informativoController.criarInformativo);

// PUT /api/informativos/:id: Atualiza um informativo.
// Rota protegida e autorizada: Apenas gestores.
router.put('/:id', authMiddleware, ehGestor, informativoController.atualizarInformativo);

// DELETE /api/informativos/:id: Deleta um informativo.
// Rota protegida e autorizada: Apenas gestores.
router.delete('/:id', authMiddleware, ehGestor, informativoController.deletarInformativo);

module.exports = router;