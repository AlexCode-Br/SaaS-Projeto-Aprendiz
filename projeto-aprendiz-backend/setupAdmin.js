// Importa as dependências necessárias
const bcrypt = require('bcryptjs');
const db = require('./config/db'); // Nosso módulo de conexão com o DB

/**
 * Script para criar o usuário administrador inicial no banco de dados.
 */
async function createAdminUser() {
  const adminEmail = 'admin@icm.org.br';

  try {
    // 1. Verificar se o usuário administrador já existe
    const userExists = await db.query('SELECT * FROM Usuarios WHERE email = $1', [adminEmail]);

    if (userExists.rows.length > 0) {
      console.log('Utilizador administrador já existe.');
      return; // Encerra a função se o usuário já existir
    }

    // 2. Criptografar a senha padrão
    const plainPassword = 'admin123';
    const salt = await bcrypt.genSalt(10); // Gera um "sal" para a criptografia
    const senha_hash = await bcrypt.hash(plainPassword, salt);

    // 3. Inserir o novo usuário administrador na tabela
    await db.query(
      `INSERT INTO Usuarios (nome, email, senha_hash, papel) 
       VALUES ($1, $2, $3, $4)`,
      ['Admin Regional', adminEmail, senha_hash, 'gestor']
    );

    // 4. Imprimir mensagem de sucesso
    console.log('Utilizador administrador criado com sucesso!');

  } catch (error) {
    console.error('Ocorreu um erro ao criar o utilizador administrador:', error);
  } finally {
    // É crucial fechar a conexão com o banco de dados para que o script termine
    await db.pool.end();
  }
}

// Executa a função
createAdminUser();