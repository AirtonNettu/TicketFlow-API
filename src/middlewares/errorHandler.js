// Middleware para tratamento de erros. Utilizado pelo Express para capturar e responder erros de forma centralizada.
const { ApiError } = require('../utils/validation');

// Captura rotas que não existem e transforma em erro HTTP 404.
function notFoundHandler(req, res, next) {
  next(new ApiError('Rota não encontrada', 404));
}

// Retorna o erro como JSON. Se o erro não definir statusCode, utiliza 500.
function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  return res.status(status).json({ error: message });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
