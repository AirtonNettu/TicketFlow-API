// Utilitários de validação para o sistema de tickets.
// Define os valores válidos e lança erros com mensagens amigáveis quando algo estiver incorreto.
const categories = ['Hardware', 'Software', 'Rede', 'Impressora', 'Outros'];
const priorities = ['Baixa', 'Média', 'Alta'];
const statuses = ['Aberto', 'Em andamento', 'Resolvido', 'Fechado'];

class ApiError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Valida o payload de criação ou atualização de chamados.
// Quando requireAllFields é true, exige todos os campos obrigatórios.
function validateTicketPayload(payload, requireAllFields = true) {
  const requiredFields = ['titulo', 'descricao', 'categoria', 'prioridade'];

  if (requireAllFields) {
    requiredFields.forEach((field) => {
      if (!payload[field]) {
        throw new ApiError(`Campo obrigatório ausente: ${field}`, 400);
      }
    });
  }

  if (payload.categoria && !categories.includes(payload.categoria)) {
    throw new ApiError('Categoria inválida. Valores válidos: Hardware, Software, Rede, Impressora, Outros.', 400);
  }

  if (payload.prioridade && !priorities.includes(payload.prioridade)) {
    throw new ApiError('Prioridade inválida. Valores válidos: Baixa, Média, Alta.', 400);
  }

  if (payload.status && !statuses.includes(payload.status)) {
    throw new ApiError('Status inválido. Valores válidos: Aberto, Em andamento, Resolvido, Fechado.', 400);
  }
}

// Valida apenas o campo status.
function validateStatus(status) {
  if (!status) {
    throw new ApiError('Status é obrigatório', 400);
  }

  if (!statuses.includes(status)) {
    throw new ApiError('Status inválido. Valores válidos: Aberto, Em andamento, Resolvido, Fechado.', 400);
  }
}

module.exports = {
  categories,
  priorities,
  statuses,
  ApiError,
  validateTicketPayload,
  validateStatus,
};
