// Define as rotas da API de chamados e conecta cada rota ao controller responsável.
// Esta camada não implementa a lógica de negócio, apenas mapeia endpoint -> ação.
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Criar um novo chamado
router.post('/', ticketController.createTicket);

// Listar todos os chamados
router.get('/', ticketController.getAllTickets);

// Buscar um chamado por ID
router.get('/:id', ticketController.getTicketById);

// Atualizar um chamado completo
router.put('/:id', ticketController.updateTicket);

// Atualizar apenas o status de um chamado
router.patch('/:id/status', ticketController.updateStatus);

// Excluir um chamado
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
