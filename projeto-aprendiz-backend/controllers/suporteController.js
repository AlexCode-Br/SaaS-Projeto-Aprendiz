// controllers/suporteController.js

const db = require('../config/db');

// Função para um professor criar um novo ticket
exports.criarTicket = async (req, res) => {
    const { assunto, mensagem } = req.body;
    // Pega o ID do professor a partir do token JWT que foi validado pelo middleware
    const usuarioId = req.user.id; 

    if (!assunto || !mensagem) {
        return res.status(400).json({ message: 'Assunto e mensagem são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO TicketsSuporte (usuario_id, assunto, mensagem, status)
            VALUES ($1, $2, $3, 'Aberto')
            RETURNING *;
        `;
        const values = [usuarioId, assunto, mensagem];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar ticket:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para listar tickets
exports.listarTickets = async (req, res) => {
    // Pega o ID e o papel do usuário a partir do token
    const { id, papel } = req.user; 

    try {
        let query;
        let values = [];

        if (papel === 'gestor') {
            // Gestor vê todos os tickets, com o nome do professor
            query = `
                SELECT ts.*, u.nome as professor_nome 
                FROM TicketsSuporte ts
                JOIN Usuarios u ON ts.usuario_id = u.id
                ORDER BY ts.id DESC;
            `;
        } else {
            // Professor vê apenas os seus próprios tickets
            query = `
                SELECT * FROM TicketsSuporte 
                WHERE usuario_id = $1 
                ORDER BY id DESC;
            `;
            values.push(id);
        }

        const result = await db.query(query, values);
        res.json(result.rows);

    } catch (error) {
        console.error('Erro ao listar tickets:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

// Função para um gestor atualizar o status de um ticket
exports.atualizarStatusTicket = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'O novo status é obrigatório.' });
    }

    try {
        const query = `
            UPDATE TicketsSuporte 
            SET status = $1 
            WHERE id = $2 
            RETURNING *;
        `;
        const values = [status, id];
        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Ticket não encontrado.' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Erro ao atualizar ticket:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};