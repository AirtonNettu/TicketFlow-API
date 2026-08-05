/**
 * Ponto de entrada (Entrypoint) da aplicação Express.
 *
 * Responsabilidade: Orquestrar a inicialização do servidor, aplicar configurações globais
 * (CORS, Body Parser), inicializar o roteador principal e engatar os interceptadores de erro.
 * Não deve conter nenhuma regra de negócio.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const ticketRoutes = require('./routes/ticketRoutes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Habilita o Cross-Origin Resource Sharing. Essencial para que SPAs (React/Vue)
// rodando em outras portas/domínios possam consumir esta API via navegador.
// Sentinel: Configuracao de CORS restrita para evitar vazamento de dados.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permite chamadas sem origin (ex: mobile, curl) ou origins especificos
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Habilita o parse automático de corpos de requisição (req.body)
// que chegam com o Content-Type 'application/json'.
app.use(express.json());

// Rota raiz com informações básicas da API.
app.get('/', (req, res) => {
  return res.json({
    message: 'API Sistema de Chamados de Suporte Técnico',
    documentation: '/docs',
  });
});

// Rota de documentação profissional em HTML para o consumidor da API.
app.get('/docs', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Documentação API - Sistema de Chamados</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f6fb; color: #202940; margin: 0; padding: 0; }
    .container { max-width: 960px; margin: 0 auto; padding: 24px; }
    h1, h2, h3 { color: #1c3d7d; }
    .card { background: #ffffff; border-radius: 10px; box-shadow: 0 10px 25px rgba(29, 41, 73, 0.08); margin-bottom: 20px; padding: 20px; }
    pre { background: #f0f4ff; border-radius: 8px; padding: 16px; overflow-x: auto; }
    code { color: #1c3d7d; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { padding: 12px 14px; border-bottom: 1px solid #e3e8f0; text-align: left; }
    th { background: #eef2ff; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #e0e7ff; color: #1e3a8a; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>Sistema de Chamados de Suporte Técnico</h1>
      <p>Documentação leve da API REST para gerenciamento de chamados de TI.</p>
      <p><strong>Base URL:</strong> <code>http://localhost:3000</code></p>
      <p><strong>Versão:</strong> 1.0.0</p>
    </div>

    <div class="card">
      <h2>Rotas da API</h2>
      <table>
        <thead>
          <tr><th>Método</th><th>Endpoint</th><th>Descrição</th></tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/tickets</td><td>Criar um novo chamado</td></tr>
          <tr><td>GET</td><td>/tickets</td><td>Listar chamados com filtros e paginação</td></tr>
          <tr><td>GET</td><td>/tickets/:id</td><td>Buscar chamado por ID</td></tr>
          <tr><td>PUT</td><td>/tickets/:id</td><td>Atualizar chamado completo</td></tr>
          <tr><td>PATCH</td><td>/tickets/:id/status</td><td>Atualizar apenas o status</td></tr>
          <tr><td>DELETE</td><td>/tickets/:id</td><td>Excluir chamado</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Valores válidos</h2>
      <table>
        <thead>
          <tr><th>Campo</th><th>Valores Válidos</th></tr>
        </thead>
        <tbody>
          <tr><td>categoria</td><td>Hardware, Software, Rede, Impressora, Outros</td></tr>
          <tr><td>prioridade</td><td>Baixa, Média, Alta</td></tr>
          <tr><td>status</td><td>Aberto, Em andamento, Resolvido, Fechado</td></tr>
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Exemplos de requisição</h2>
      <h3>Criar chamado</h3>
      <pre><code>POST /tickets
{
  "titulo": "Impressora não imprime",
  "descricao": "A impressora do setor financeiro não responde",
  "categoria": "Impressora",
  "prioridade": "Alta"
}</code></pre>
      <h3>Atualizar status</h3>
      <pre><code>PATCH /tickets/:id/status
{
  "status": "Em andamento"
}</code></pre>
      <h3>Listar chamados filtrados</h3>
      <pre><code>GET /tickets?status=Aberto&prioridade=Alta&page=1&limit=10</code></pre>
    </div>
  </div>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

// Serve uma interface visual simples (HTML/JS) embarcada para fins de demonstração,
// mapeando a pasta 'public' física para o caminho web '/app'.
app.use('/app', express.static(path.join(__dirname, '..', 'public')));

// Injeta o mapeamento de sub-rotas da entidade "tickets".
// Todas as rotas dentro do 'ticketRoutes' receberão o prefixo '/tickets'.
app.use('/tickets', ticketRoutes);

// Acopla os Middlewares de erro no final do fluxo.
// Qualquer rota não capturada anteriormente cairá no 'notFoundHandler'.
// Qualquer exceção (throw/next) cairá no 'errorHandler' para formatação padronizada.
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
