// Importa o pacote 'pg' que é o driver do PostgreSQL para Node.js
const { Pool } = require('pg');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Cria uma nova instância do Pool de conexões com o banco de dados.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Exporta um objeto com o método 'query' e a própria instância do 'pool'.
// O 'query' será usado em nosso app Express.
// O 'pool' será usado em scripts para poder encerrar a conexão.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool,
};