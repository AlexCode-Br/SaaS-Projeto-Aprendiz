const express = require('express');
const router = express.Router();

// Importa as funções do controller
const suporteController = require('../controllers/suporteController');

// Importa os middlewares
const authMiddleware = require('../middleware/authMiddleware');
const { ehGestor, ehProfessor } = require('../middleware/roleMiddleware'); 

// Rota para um professor criar um novo ticket
// POST /api/suporte/tickets
router.post('/tickets', authMiddleware, ehProfessor, suporteController.criarTicket);

// Rota para listar tickets (a lógica de quem vê o quê está no controller)
// GET /api/suporte/tickets
router.get('/tickets', authMiddleware, suporteController.listarTickets);

// Rota para um gestor atualizar o status de um ticket
// PUT /api/suporte/tickets/:id
router.put('/tickets/:id', authMiddleware, ehGestor, suporteController.atualizarStatusTicket);

module.exports = router;