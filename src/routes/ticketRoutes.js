/**
 * Ticket Routes
 *
 * Responsabilidade: Mapear URLs REST e métodos HTTP (GET, POST, PUT, DELETE, PATCH)
 * para os métodos corretos do Controller correspondente.
 * Esta camada atua estritamente como um roteador de tráfego, garantindo o isolamento
 * entre a definição da API HTTP e o código que a executa.
 */
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
