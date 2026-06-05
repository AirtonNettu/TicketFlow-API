// Middleware para tratamento de erros. Utilizado pelo Express para capturar e responder erros de forma centralizada.
const { ApiError } = require('../utils/validation');

// Captura rotas que não existem e transforma em erro HTTP 404.
function notFoundHandler(req, res, next) {
  next(new ApiError('Rota não encontrada', 404, 'NOT_FOUND'));
}

// Retorna o erro como JSON padronizado. Se o erro não definir statusCode, utiliza 500.
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
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
