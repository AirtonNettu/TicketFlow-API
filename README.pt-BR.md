# Sistema de Chamados de Suporte Técnico (Português)

API REST para gerenciar chamados de suporte técnico — versão em Português para leitores brasileiros.

## Tecnologias

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

## Rotas principais

- `GET /` — Rota raiz (link para documentação)
- `GET /docs` — Documentação em HTML
- `POST /tickets` — Criar um novo chamado
- `GET /tickets` — Listar chamados com filtros e paginação
- `GET /tickets/:id` — Obter chamado por ID
- `PUT /tickets/:id` — Atualizar chamado completo
- `PATCH /tickets/:id/status` — Atualizar apenas o status
- `DELETE /tickets/:id` — Excluir chamado

## Campos do chamado

- `id` (UUID)
- `titulo` (string)
- `descricao` (string)
- `categoria` (Hardware, Software, Rede, Impressora, Outros)
- `prioridade` (Baixa, Média, Alta)
- `status` (Aberto, Em andamento, Resolvido, Fechado)
- `createdAt` (ISO 8601)

## Exemplos

Criar chamado:

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

Listar chamados filtrando por status, prioridade e paginação:

```bash
curl "http://localhost:3000/tickets?status=Aberto&prioridade=Alta&page=1&limit=10"
```

Resposta da listagem:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

Erros seguem o padrão:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Dados inválidos",
    "details": []
  }
}
```

## Licença

Este projeto está licenciado sob a licença MIT. Consulte `LICENSE` para o texto oficial em inglês.

---

Se preferir, eu posso manter o `README.md` em inglês e este arquivo como versão PT-BR (recomendado para portfólio).


## TicketFlow v2

A versão 2 do TicketFlow está planejada como uma reconstrução completa do projeto, com foco em TypeScript, banco de dados, autenticação, autorização por perfis e arquitetura mais robusta.

A proposta da v2 inclui:

- Backend com Node.js, TypeScript e Express/Fastify
- Arquitetura baseada em serviços: Auth, Users, Tickets e Notifications
- API Gateway para autenticação, rate limit, HTTPS e roteamento
- PostgreSQL com Prisma ORM
- Autenticação com JWT, access token e refresh token
- Senhas protegidas com bcrypt
- Perfis de acesso: usuário, técnico e admin/gerente
- Redis + BullMQ para notificações assíncronas
- Frontend com React, Axios e React Query
- Deploy com Railway e Vercel
- CI/CD com GitHub Actions

A documentação inicial da v2 está disponível em:

- [`docs/architecture-v2.md`](docs/architecture-v2.md)
- [`docs/api-contracts-v2.md`](docs/api-contracts-v2.md)
- [`docs/implementation-checklist-v2.md`](docs/implementation-checklist-v2.md)
- [`docs/security-checklist.md`](docs/security-checklist.md)

A v1 permanece como uma versão focada nos fundamentos de JavaScript, Node.js, Express, rotas, controllers, services, validação e persistência em JSON.
