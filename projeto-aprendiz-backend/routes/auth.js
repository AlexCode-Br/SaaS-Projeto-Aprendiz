// Importa o framework Express
const express = require('express');

// Cria um objeto de roteador do Express
const router = express.Router();

// Importa o controller de autenticação
const authController = require('../controllers/authController');

// Define a rota POST para /login.
// Quando uma requisição POST for feita para /api/auth/login,
// a função 'login' do authController será executada.
router.post('/login', authController.login);

// Exporta o roteador para ser usado no arquivo principal do servidor
module.exports = router;