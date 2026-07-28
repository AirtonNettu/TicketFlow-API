/**
 * Ticket Service
 *
 * Responsabilidade: Regras de negócio da aplicação e comunicação direta com a camada de dados.
 * É aqui que a lógica puramente focada no domínio "Chamado" reside.
 * Atualmente, devido à arquitetura inicial do projeto, esta camada acopla o domínio
 * com a infraestrutura de dados (Filesystem). Em uma evolução (V2), a persistência
 * deve ser delegada a um Repository.
 */
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

/**
 * Lê o banco de dados JSON e desserializa em memória.
 *
 * Fluxo:
 * 1. Tenta acessar o arquivo no sistema.
 * 2. Se o arquivo não existir (ENOENT), entende-se que é o "primeiro uso" e retorna um array vazio.
 * 3. Se houver outro erro (permissão, corrupção do JSON), propaga a falha.
 *
 * Trade-off atual: Como o JSON inteiro é lido na memória, isso não escala para arquivos muito grandes.
 */
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

/**
 * Sobrescreve o banco de dados JSON com o array de tickets modificado.
 *
 * Fluxo:
 * 1. Extrai o caminho do diretório pai.
 * 2. Garante a criação da pasta 'src/data' dinamicamente usando fs.mkdir(recursive), evitando falha no primeiro deploy.
 * 3. Converte a estrutura de dados para String JSON (formatada com 2 espaços).
 * 4. Sobrescreve o arquivo inteiro de uma só vez (Blocking potential em cenários de alta concorrência).
 */
async function writeData(tickets) {
  // Garante que a pasta exista antes de gravar
  const dataDir = path.dirname(dataFile);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // ignora erro se a pasta já existe
    if (err.code !== 'EEXIST') throw err;
  }

  await fs.writeFile(dataFile, JSON.stringify(tickets, null, 2), 'utf8');
}

/**
 * Retorna uma lista paginada e opcionalmente filtrada de chamados.
 *
 * Fluxo:
 * 1. Carrega toda a base em memória.
 * 2. Aplica reduções em cascata (Array.filter) baseados nos atributos de status, categoria e prioridade.
 * 3. Calcula o offset de paginação matematicamente (limit * (page - 1)).
 * 4. Fatiar o array (Array.slice) retornando apenas os dados da página solicitada e metadados úteis para o front-end montar sua interface.
 */
async function getAllTickets(filters = {}) {
  const tickets = await readData();
  let filteredTickets = tickets;

  if (filters.status) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.status === filters.status);
  }

  if (filters.categoria) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.categoria === filters.categoria);
  }

  if (filters.prioridade) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.prioridade === filters.prioridade);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const total = filteredTickets.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = filteredTickets.slice(start, start + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
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

/**
 * Criação da entidade de Chamado.
 *
 * Fluxo:
 * 1. Carrega os dados existentes.
 * 2. Anexa ao payload os identificadores essenciais do domínio:
 *    - UUID V4 (para não usar IDs sequenciais adivinháveis).
 *    - Status 'Aberto' implícito (não se confia no status vindo do cliente na criação).
 *    - Timestamp em formato ISO 8601.
 * 3. Inclui na lista, salva o disco e retorna a entidade materializada.
 */
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
