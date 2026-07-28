/**
 * Error Handling Middleware
 *
 * Responsabilidade: Consolidar a estratégia de captura de exceções em um único ponto.
 * Evita vazamento de erros de sintaxe e quebra bruta do Node.js.
 * Padrão essencial em APIs para garantir que o cliente HTTP receba um JSON consistente
 * sempre que ocorrer uma falha, mesmo que imprevista.
 */
const { ApiError } = require('../utils/validation');

/**
 * Intercepta chamadas a rotas inexistentes.
 * É injetado no final da fila do Express. Se nenhuma rota validar o path,
 * ele dispara um erro 404 padronizado para o próximo middleware.
 */
function notFoundHandler(req, res, next) {
  next(new ApiError('Rota não encontrada', 404, 'NOT_FOUND'));
}

/**
 * Trata as exceções (Error) propagadas pela aplicação via 'next(error)'.
 * Formata os erros customizados (ApiError) ou mascara erros nativos inesperados
 * com HTTP 500 (Internal Server Error) para evitar vazamento de StackTrace.
 */
function errorHandler(err, req, res, next) {
  // Log internal errors for debugging, since we will mask them to the client
  if (!err.statusCode || err.statusCode >= 500) {
    console.error('🚨 [Internal Error]:', err);
  }

  const status = err.statusCode || 500;
  // Prevent information leakage: Only expose messages for operational ApiErrors.
  // For system/internal errors (500), force a generic message.
  const isApiError = err.name === 'ApiError' || err instanceof ApiError || err.statusCode < 500;
  const message = isApiError ? (err.message || 'Erro na requisição') : 'Erro interno do servidor';
  const code = err.code || (status >= 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const details = Array.isArray(err.details) ? err.details : [];

  return res.status(status).json({
    error: {
      code,
      message,
      details,
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
