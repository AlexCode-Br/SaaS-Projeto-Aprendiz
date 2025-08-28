const express = require('express');
const router = express.Router();

// Importa o controller
const professorController = require('../controllers/professorController');

// Importa os middlewares
const authMiddleware = require('../middleware/authMiddleware');
const { ehGestor } = require('../middleware/roleMiddleware');

// --- ROTAS DE PROFESSORES (TODAS PROTEGIDAS PARA GESTORES) ---

// Aplica os middlewares a todas as rotas deste arquivo
router.use(authMiddleware);
router.use(ehGestor);

// GET /api/professores: Lista todos os professores.
router.get('/', professorController.listarProfessores);

// POST /api/professores: Cria um novo professor.
router.post('/', professorController.criarProfessor);

// PUT /api/professores/:id: Atualiza um professor.
router.put('/:id', professorController.atualizarProfessor);

// DELETE /api/professores/:id: Deleta um professor.
router.delete('/:id', professorController.deletarProfessor);

module.exports = router;