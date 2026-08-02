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
  let message = 'Erro interno do servidor';

  // Apenas repassamos mensagens reais de erro se forem erros conhecidos/operacionais
  if (err.name === 'ApiError' || err instanceof ApiError || status < 500) {
    message = err.message || 'Erro interno do servidor';
  } else {
    // Registra o erro não tratado no servidor para fins de depuração e auditoria
    console.error('[ERRO NÃO TRATADO]', err);
  }

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
