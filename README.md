# Support Ticket System

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

REST API to manage technical support tickets. Ideal for a portfolio aimed at IT Support Assistant, Support Analyst and Junior Backend Developer positions.

## Technologies

- Node.js
- Express
- JavaScript
- UUID
- Layered architecture (Routes, Controllers, Services)
- JSON file storage (initial version)

## Project structure

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

## Architecture

- `src/server.js`: application entrypoint. Configures Express server, registers routes and error middleware.
- `src/routes/ticketRoutes.js`: HTTP endpoints mapping to controller actions.
- `src/controllers/ticketController.js`: request handling and input validation; delegates to services.
- `src/services/ticketService.js`: business logic and persistence (JSON file).
- `src/data/chamados.json`: data storage for tickets.
- `src/utils/validation.js`: input validation and allowed values for category, priority and status.
- `src/middlewares/errorHandler.js`: centralized error handling.

## Install

```bash
npm install
```

## Run

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

API documentation is available at:

- `GET /docs`

## API routes

- `GET /` - Root with link to documentation
- `GET /docs` - Professional HTML documentation
- `POST /tickets` - Create a new ticket
- `GET /tickets` - List all tickets
- `GET /tickets/:id` - Get ticket by ID
- `PUT /tickets/:id` - Update a ticket
- `PATCH /tickets/:id/status` - Update ticket status only
- `DELETE /tickets/:id` - Delete a ticket

## Ticket fields

Tickets include the following fields:

- `id`: unique identifier generated with UUID
- `titulo`: brief title of the issue
- `descricao`: detailed description of the issue
- `categoria`: ticket category
- `prioridade`: ticket priority
- `status`: current ticket status
- `createdAt`: creation date/time in ISO 8601 format

### Valid values

- `categoria`: `Hardware`, `Software`, `Rede`, `Impressora`, `Outros`
- `prioridade`: `Baixa`, `Média`, `Alta`
- `status`: `Aberto`, `Em andamento`, `Resolvido`, `Fechado`

## Example requests

### Create ticket

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

### Update ticket (full)

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

### Update status

```bash
curl -X PATCH http://localhost:3000/tickets/{id}/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Em andamento"}'
```

### Delete ticket

```bash
curl -X DELETE http://localhost:3000/tickets/{id}
```

## Example responses

Success response for `GET /tickets` (200):

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

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

## Contributing

Contributions are welcome. Please open issues or submit pull requests on the GitHub repository.

## Next improvements

- Migrate storage to PostgreSQL
- Adopt Prisma ORM
- Create a Docker environment
- Add JWT authentication
- Web dashboard
- User and technician management
