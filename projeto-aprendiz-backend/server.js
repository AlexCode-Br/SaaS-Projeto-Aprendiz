// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// --- IMPORTAÇÃO DAS ROTAS ---
const authRoutes = require('./routes/auth');
const inscricoesRoutes = require('./routes/inscricoes');
const alunosRoutes = require('./routes/alunos');
const cursosRoutes = require('./routes/cursos');
const professoresRoutes = require('./routes/professores');
const informativosRoutes = require('./routes/informativos');
const frequenciaRoutes = require('./routes/frequencia');
const relatoriosRoutes = require('./routes/relatorios');
const suporteRoutes = require('./routes/suporte');

// Cria a instância do aplicativo Express
const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rota principal para teste
app.get('/', (req, res) => {
    res.send('API do Projeto Aprendiz está no ar!');
});

// --- USO DAS ROTAS ---
// CORREÇÃO: O prefixo para as rotas de autenticação foi corrigido para '/api/auth'.
app.use('/api/auth', authRoutes); // Rota -> /api/auth/login
app.use('/api/inscricoes', inscricoesRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/professores', professoresRoutes);
app.use('/api/informativos', informativosRoutes);
app.use('/api/frequencia', frequenciaRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/suporte', suporteRoutes);

// Define a porta do servidor, buscando do ambiente ou usando 3000 como padrão
const PORT = process.env.PORT || 3000;

// Inicia o servidor e o faz escutar na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});