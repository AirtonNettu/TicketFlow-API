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
  const status = err.statusCode || 500;

  // Sentinel: Fail securely. Do not leak internal system details on 500 errors.
  const isInternalError = status >= 500;
  const message = isInternalError ? 'Erro interno do servidor' : (err.message || 'Erro interno do servidor');
  const code = err.code || (isInternalError ? 'INTERNAL_ERROR' : 'BAD_REQUEST');
  const details = isInternalError ? [] : (Array.isArray(err.details) ? err.details : []);

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
