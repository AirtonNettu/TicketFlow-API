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
- `GET /tickets` — Listar todos os chamados
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

## Licença

Este projeto está licenciado sob a licença MIT. Consulte `LICENSE` para o texto oficial em inglês.

---

Se preferir, eu posso manter o `README.md` em inglês e este arquivo como versão PT-BR (recomendado para portfólio).