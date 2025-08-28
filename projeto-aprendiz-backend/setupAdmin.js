// Importa as dependências necessárias
const bcrypt = require('bcryptjs');
const db = require('./config/db'); // Nosso módulo de conexão com o DB

/**
 * Script para criar ou atualizar o usuário administrador inicial no banco de dados.
 */
async function setupAdminUser() {
  const adminEmail = 'admin@icm.org.br';
  const plainPassword = 'admin123';

  try {
    // Criptografa a senha padrão
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(plainPassword, salt);

    // 1. Verificar se o usuário administrador já existe (TABELA CORRIGIDA PARA MINÚSCULAS)
    const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1', [adminEmail]);

    if (userExists.rows.length > 0) {
      // Se o usuário existir, atualiza a senha dele para garantir que está correta (TABELA CORRIGIDA PARA MINÚSCULAS)
      await db.query(
        'UPDATE usuarios SET senha_hash = $1 WHERE email = $2',
        [senha_hash, adminEmail]
      );
      console.log('Senha do utilizador administrador foi atualizada com sucesso!');
    } else {
      // Se não existir, insere o novo usuário administrador (TABELA CORRIGIDA PARA MINÚSCULAS)
      await db.query(
        `INSERT INTO usuarios (nome, email, senha_hash, papel) 
         VALUES ($1, $2, $3, $4)`,
        ['Admin Regional', adminEmail, senha_hash, 'gestor']
      );
      console.log('Utilizador administrador criado com sucesso!');
    }

  } catch (error) {
    console.error('Ocorreu um erro ao configurar o utilizador administrador:', error);
  } finally {
    // É crucial fechar a conexão com o banco de dados para que o script termine
    await db.pool.end();
  }
}

// Executa a função
setupAdminUser();