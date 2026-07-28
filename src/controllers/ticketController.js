/**
 * Ticket Controller
 *
 * Responsabilidade: Intermediar as requisições HTTP (Rotas) e a Regra de Negócio (Services).
 * Garante que a entrada (req.body, req.query) obedece aos contratos esperados antes de
 * acionar o processamento pesado. Em caso de falha, repassa o erro para o middleware central.
 */
const ticketService = require('../services/ticketService');
const {
  validateTicketPayload,
  validateStatus,
  validateTicketFilters,
  ApiError,
} = require('../utils/validation');

/**
 * Responsável pela criação de um novo chamado (Ticket).
 *
 * Fluxo:
 * 1. Extrai o payload da requisição (req.body).
 * 2. Invoca validateTicketPayload para garantir presença e integridade dos campos obrigatórios.
 * 3. Repassa os dados validados ao Service para geração de ID, Timestamp e persistência.
 * 4. Retorna o objeto criado com HTTP Status 201 (Created).
 */
async function createTicket(req, res, next) {
  try {
    validateTicketPayload(req.body, true);
    const ticket = await ticketService.createTicket(req.body);
    return res.status(201).json(ticket);
  } catch (error) {
    return next(error);
  }
}

/**
 * Responsável por listar chamados aplicando paginação e filtros dinâmicos.
 *
 * Fluxo:
 * 1. Extrai a query string da requisição (req.query).
 * 2. Valida se os filtros solicitados (status, prioridade) são permitidos.
 * 3. Delega ao Service a busca e o fatiamento (slice) dos dados em memória.
 * 4. Retorna a lista paginada e os metadados (total, páginas) com HTTP Status 200.
 */
async function getAllTickets(req, res, next) {
  try {
    const filters = validateTicketFilters(req.query);
    const tickets = await ticketService.getAllTickets(filters);
    return res.json(tickets);
  } catch (error) {
    return next(error);
  }
}

/**
 * Recupera os detalhes de um chamado específico através do seu UUID.
 *
 * Fluxo:
 * 1. Extrai o parâmetro de rota :id (req.params.id).
 * 2. Solicita ao Service a busca desse ID na base de dados.
 * 3. Se não existir, o Service lançará uma ApiError(404), que será capturada pelo 'catch'.
 * 4. Retorna o objeto encontrado.
 */
async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    return res.json(ticket);
  } catch (error) {
    return next(error);
  }
}

/**
 * Substituição total ou parcial (PUT) de um chamado existente.
 *
 * Fluxo:
 * 1. Verifica se a requisição contém um corpo válido.
 * 2. Impede ataques de Injeção bloqueando campos não mapeados em 'allowedUpdates' (ex: forçar mudança de ID).
 * 3. Valida os dados aceitos (sem exigir que todos estejam presentes, requireAllFields = false).
 * 4. Delega a sobreposição de dados (merge) ao Service.
 */
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

/**
 * Operação atômica (PATCH) focada apenas na evolução do status do ticket.
 *
 * Fluxo:
 * 1. Valida de forma isolada se a string de status enviada é válida no ciclo de vida (ex: "Em andamento").
 * 2. Delega ao Service a localização do ticket e alteração apenas da propriedade status.
 */
async function updateStatus(req, res, next) {
  try {
    validateStatus(req.body.status);
    const ticket = await ticketService.updateStatus(req.params.id, req.body.status);
    return res.json(ticket);
  } catch (error) {
    return next(error);
  }
}

/**
 * Exclusão lógica/física de um ticket pelo ID.
 *
 * Fluxo:
 * 1. Passa o ID ao Service.
 * 2. Se o registro for deletado com sucesso do banco (JSON),
 *    retorna HTTP Status 204 (No Content) indicando que a ação foi concluída sem corpo de resposta.
 */
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
