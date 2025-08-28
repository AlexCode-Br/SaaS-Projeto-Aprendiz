const express = require('express');
const router = express.Router();

// Importa o controller de cursos
const cursoController = require('../controllers/cursoController');

// Importa os middlewares de autenticação e autorização
const authMiddleware = require('../middleware/authMiddleware');
const { ehGestor } = require('../middleware/roleMiddleware');

// --- ROTAS DE CURSOS ---

// GET /api/cursos: Lista todos os cursos.
// Rota protegida: Qualquer usuário autenticado pode listar.
router.get('/', authMiddleware, cursoController.listarCursos);

// POST /api/cursos: Cria um novo curso.
// Rota protegida e autorizada: Apenas gestores podem criar.
router.post('/', authMiddleware, ehGestor, cursoController.criarCurso);

// PUT /api/cursos/:id: Atualiza um curso.
// Rota protegida e autorizada: Apenas gestores podem atualizar.
router.put('/:id', authMiddleware, ehGestor, cursoController.atualizarCurso);

// DELETE /api/cursos/:id: Deleta um curso.
// Rota protegida e autorizada: Apenas gestores podem deletar.
router.delete('/:id', authMiddleware, ehGestor, cursoController.deletarCurso);

module.exports = router;