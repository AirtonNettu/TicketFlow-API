// Serviço de tickets: aqui está a lógica de negócio e a persistência em arquivo JSON.
// Este módulo lê e grava no arquivo `src/data/chamados.json` e retorna os resultados para o controller.
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  categories,
  priorities,
  statuses,
  ApiError,
  validateStatus,
} = require('../utils/validation');

const dataFile = path.join(__dirname, '..', 'data', 'chamados.json');

// Lê o arquivo JSON e converte em array de tickets.
async function readData() {
  try {
    const file = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Se o arquivo não existir, retorna lista vazia para iniciar.
      return [];
    }
    throw error;
  }
}

// Grava a lista de tickets no arquivo JSON.
async function writeData(tickets) {
  await fs.writeFile(dataFile, JSON.stringify(tickets, null, 2), 'utf8');
}

// Retorna todos os tickets.
async function getAllTickets() {
  return readData();
}

// Busca um ticket pelo ID e retorna um erro se não existir.
async function getTicketById(id) {
  const tickets = await readData();
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) {
    throw new ApiError('Chamado não encontrado', 404);
  }
  return ticket;
}

// Cria um novo ticket com UUID e data de criação.
async function createTicket(payload) {
  const tickets = await readData();
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

  tickets.push(ticket);
  await writeData(tickets);
  return ticket;
}

// Atualiza um ticket existente com os campos enviados.
async function updateTicket(id, payload) {
  const tickets = await readData();
  const index = tickets.findIndex((item) => item.id === id);
  if (index === -1) {
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
    ...tickets[index],
    ...payload,
  };

  tickets[index] = updatedTicket;
  await writeData(tickets);
  return updatedTicket;
}

// Atualiza apenas o status de um ticket.
async function updateStatus(id, status) {
  validateStatus(status);
  const tickets = await readData();
  const index = tickets.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new ApiError('Chamado não encontrado', 404);
  }

  tickets[index].status = status;
  await writeData(tickets);
  return tickets[index];
}

// Remove um ticket do arquivo JSON.
async function deleteTicket(id) {
  const tickets = await readData();
  const index = tickets.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new ApiError('Chamado não encontrado', 404);
  }

  tickets.splice(index, 1);
  await writeData(tickets);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateStatus,
  deleteTicket,
};
