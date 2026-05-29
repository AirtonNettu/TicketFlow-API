// Controller de tickets: recebe as requisições HTTP, valida dados e delega a lógica de negócio.
// Este arquivo não faz persistência em disco; ele apenas organiza a entrada e saída da API.
const ticketService = require('../services/ticketService');
const { validateTicketPayload, validateStatus, ApiError } = require('../utils/validation');

// Cria um novo chamado a partir do body da requisição.
async function createTicket(req, res, next) {
  try {
    validateTicketPayload(req.body, true);
    const ticket = await ticketService.createTicket(req.body);
    return res.status(201).json(ticket);
  } catch (error) {
    return next(error);
  }
}

// Retorna todos os chamados armazenados.
async function getAllTickets(req, res, next) {
  try {
    const tickets = await ticketService.getAllTickets();
    return res.json(tickets);
  } catch (error) {
    return next(error);
  }
}

// Busca um chamado específico pelo ID passado na rota.
async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    return res.json(ticket);
  } catch (error) {
    return next(error);
  }
}

// Atualiza os campos de um chamado existente.
async function updateTicket(req, res, next) {
  try {
    const allowedUpdates = ['titulo', 'descricao', 'categoria', 'prioridade', 'status'];
    const receivedFields = Object.keys(req.body);

    if (receivedFields.length === 0) {
      throw new ApiError('Nenhum campo foi enviado para atualização', 400);
    }

    // Assegura que apenas os campos permitidos sejam atualizados.
    receivedFields.forEach((field) => {
      if (!allowedUpdates.includes(field)) {
        throw new ApiError(`Campo não permitido: ${field}`, 400);
      }
    });

    validateTicketPayload(req.body, false);
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    return res.json(ticket);
  } catch (error) {
    return next(error);
  }
}

// Atualiza somente o status do chamado.
async function updateStatus(req, res, next) {
  try {
    validateStatus(req.body.status);
    const ticket = await ticketService.updateStatus(req.params.id, req.body.status);
    return res.json(ticket);
  } catch (error) {
    return next(error);
  }
}

// Deleta um chamado existente.
async function deleteTicket(req, res, next) {
  try {
    await ticketService.deleteTicket(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  updateStatus,
  deleteTicket,
};
