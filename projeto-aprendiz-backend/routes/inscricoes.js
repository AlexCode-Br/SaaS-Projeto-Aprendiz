// Importa o framework Express
const express = require('express');

// Cria um objeto de roteador do Express
const router = express.Router();

// Importa o controller de inscrição
const inscricaoController = require('../controllers/inscricaoController');

// Define a rota POST para a raiz ('/') deste roteador.
// Quando uma requisição POST for feita para /api/inscricoes,
// a função criarInscricao do controller será executada.
router.post('/', inscricaoController.criarInscricao);

// Exporta o roteador para ser usado no arquivo principal do servidor
module.exports = router;