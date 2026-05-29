# Sistema de Chamados de Suporte Técnico

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

API REST para gerenciar chamados de suporte técnico. Ideal para portfólio de Assistente de TI, Analista de Suporte e Desenvolvedor Backend Júnior.

## Tecnologias utilizadas

- Node.js
- Express
- JavaScript
- UUID
- Arquitetura em camadas (Routes, Controllers, Services)
- Armazenamento em arquivo JSON

## Estrutura de pastas

```
src/
├── controllers/
│   └── ticketController.js
├── data/
│   └── chamados.json
├── middlewares/
│   └── errorHandler.js
├── routes/
│   └── ticketRoutes.js
├── services/
│   └── ticketService.js
├── utils/
│   └── validation.js
└── server.js
```

## Arquitetura do projeto

- `src/server.js`: ponto de entrada da API. Configura o servidor Express, habilita o parser JSON, registra as rotas e aplica middleware de erro.
- `src/routes/ticketRoutes.js`: define os endpoints HTTP e encaminha as requisições para o controller apropriado.
- `src/controllers/ticketController.js`: recebe a requisição, valida dados de entrada e chama a camada de serviço.
- `src/services/ticketService.js`: contém a lógica de negócio e a persistência em arquivo JSON.
- `src/data/chamados.json`: arquivo de armazenamento dos chamados.
- `src/utils/validation.js`: validação de campos obrigatórios e valores válidos para categoria, prioridade e status.
- `src/middlewares/errorHandler.js`: tratamento centralizado de erros e retornos HTTP.

## Como instalar

```bash
npm install
```

## Como executar

```bash
npm start
```

Para desenvolvimento com reinício automático:

```bash
npm run dev
```

A documentação da API fica disponível em:

- `GET /docs`

## Rotas da API

- `GET /` - Rota raiz com resumo e link para documentação da API
- `GET /docs` - Documentação profissional em HTML da API
- `POST /tickets` - Criar um novo chamado
- `GET /tickets` - Listar todos os chamados
- `GET /tickets/:id` - Buscar chamado por ID
- `PUT /tickets/:id` - Atualizar informações do chamado
- `PATCH /tickets/:id/status` - Atualizar apenas o status
- `DELETE /tickets/:id` - Excluir chamado

## Campos do ticket

O chamado possui os seguintes campos:

- `id`: identificador único gerado automaticamente com UUID
- `titulo`: título resumido do problema
- `descricao`: descrição detalhada do problema
- `categoria`: categoria do tipo de atendimento
- `prioridade`: nível de urgência do chamado
- `status`: situação atual do ticket
- `createdAt`: data/hora de criação no formato ISO 8601

### Valores válidos

- `categoria`: `Hardware`, `Software`, `Rede`, `Impressora`, `Outros`
- `prioridade`: `Baixa`, `Média`, `Alta`
- `status`: `Aberto`, `Em andamento`, `Resolvido`, `Fechado`

## Exemplo de requisições

### Criar chamado

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Impressora não imprime",
    "descricao": "A impressora do setor financeiro não responde",
    "categoria": "Impressora",
    "prioridade": "Alta"
  }'
```

### Atualizar chamado completo

```bash
curl -X PUT http://localhost:3000/tickets/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Impressora falha ao imprimir",
    "descricao": "A impressora do setor financeiro exibe erro de papel",
    "categoria": "Impressora",
    "prioridade": "Média",
    "status": "Em andamento"
  }'
```

### Atualizar status

```bash
curl -X PATCH http://localhost:3000/tickets/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Em andamento"}'
```

### Excluir chamado

```bash
curl -X DELETE http://localhost:3000/tickets/{id}
```

## Respostas de exemplo

Exemplo de resposta bem-sucedida para `GET /tickets` (200):

```json
[{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "titulo": "Impressora não imprime",
  "descricao": "A impressora do setor financeiro não responde",
  "categoria": "Impressora",
  "prioridade": "Alta",
  "status": "Aberto",
  "createdAt": "2026-05-29T12:34:56.789Z"
}]
```

## Licença

Este projeto está licenciado sob a licença MIT — veja o arquivo `LICENSE` para mais detalhes.

## Contribuição

Contribuições são bem-vindas. Abra issues ou envie pull requests no repositório do GitHub.

## Próximas melhorias

- Migrar armazenamento para PostgreSQL
- Adotar Prisma ORM
- Criar ambiente com Docker
- Autenticação JWT
- Dashboard Web
- Controle de usuários e técnicos
