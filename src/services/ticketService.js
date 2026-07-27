// Serviço de tickets: aqui está a lógica de negócio e a integração com o banco de dados via repository.
const { v4: uuidv4 } = require('uuid');
const ticketRepository = require('../repositories/ticketRepository');
const {
  categories,
  priorities,
  statuses,
  ApiError,
  validateStatus,
} = require('../utils/validation');

// Retorna tickets com filtros e paginacao chamando o repositorio.
async function getAllTickets(filters = {}) {
  return await ticketRepository.getAllTickets(filters);
}

// Busca um ticket pelo ID e retorna um erro se não existir.
async function getTicketById(id) {
  const ticket = await ticketRepository.getTicketById(id);
  if (!ticket) {
    throw new ApiError('Chamado não encontrado', 404);
  }
  return ticket;
}

// Cria um novo ticket com UUID e data de criação.
async function createTicket(payload) {
  const createdAt = new Date().toISOString();
  const ticket = {
    id: uuidv4(),
    titulo: payload.titulo,
    descricao: payload.descricao,
    categoria: payload.categoria,
    prioridade: payload.prioridade,
    status: 'Aberto',
    createdAt,
  };

  return await ticketRepository.createTicket(ticket);
}

// Atualiza um ticket existente com os campos enviados.
async function updateTicket(id, payload) {
  const currentTicket = await ticketRepository.getTicketById(id);
  if (!currentTicket) {
    throw new ApiError('Chamado não encontrado', 404);
  }

  if (payload.categoria && !categories.includes(payload.categoria)) {
    throw new ApiError('Categoria inválida', 400);
  }

  if (payload.prioridade && !priorities.includes(payload.prioridade)) {
    throw new ApiError('Prioridade inválida', 400);
  }

  if (payload.status && !statuses.includes(payload.status)) {
    throw new ApiError('Status inválido', 400);
  }

  const updatedTicket = {
    ...currentTicket,
    ...payload,
  };

  return await ticketRepository.updateTicket(id, updatedTicket);
}

// Atualiza apenas o status de um ticket.
async function updateStatus(id, status) {
  validateStatus(status);
  const currentTicket = await ticketRepository.getTicketById(id);
  if (!currentTicket) {
    throw new ApiError('Chamado não encontrado', 404);
  }

  await ticketRepository.updateStatus(id, status);

  return {
    ...currentTicket,
    status
  };
}

// Remove um ticket do banco.
async function deleteTicket(id) {
  const currentTicket = await ticketRepository.getTicketById(id);
  if (!currentTicket) {
    throw new ApiError('Chamado não encontrado', 404);
  }

  await ticketRepository.deleteTicket(id);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateStatus,
  deleteTicket,
};
