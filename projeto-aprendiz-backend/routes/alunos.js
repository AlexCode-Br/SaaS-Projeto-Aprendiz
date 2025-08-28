const express = require('express');
const router = express.Router();

// Importa o controller com a lógica de negócio
const alunoController = require('../controllers/alunoController');

// Importa os middlewares
const authMiddleware = require('../middleware/authMiddleware');
const { ehGestor } = require('../middleware/roleMiddleware');

// --- ROTAS DE ALUNOS ---

// GET /api/alunos: Lista todos os alunos.
// Rota protegida: Apenas usuários autenticados (professores ou gestores) podem acessar.
router.get('/', authMiddleware, alunoController.listarAlunos);

// POST /api/alunos: Cria um novo aluno.
// Rota protegida e autorizada: Apenas gestores autenticados podem criar alunos.
router.post('/', authMiddleware, ehGestor, alunoController.criarAluno);

// PUT /api/alunos/:id: Atualiza um aluno existente.
// Rota protegida e autorizada: Apenas gestores autenticados podem atualizar.
router.put('/:id', authMiddleware, ehGestor, alunoController.atualizarAluno);

// DELETE /api/alunos/:id: Deleta um aluno.
// Rota protegida e autorizada: Apenas gestores autenticados podem deletar.
router.delete('/:id', authMiddleware, ehGestor, alunoController.deletarAluno);

module.exports = router;