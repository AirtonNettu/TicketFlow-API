# Support Ticket System (TicketFlow API)

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

REST API to manage technical support tickets. Ideal for a portfolio aimed at IT Support Assistant, Support Analyst and Junior Backend Developer positions.

## Project Overview

The TicketFlow API was created to solve the problem of unorganized and decentralized IT support requests. This system provides a robust API to create, track, filter, and manage tickets, ensuring that no request is lost or delayed.
The main goal of this API is to serve as a reliable backend for a Help Desk or Service Desk environment. The target audience includes support analysts managing internal operations, as well as software engineering students looking for a comprehensive REST API project built with Node.js.

## Technologies

- Node.js
- Express
- JavaScript
- UUID
- SQLite (v2 Storage Migration)
- Layered architecture (Routes, Controllers, Services, Repositories)

## Architecture Overview

The system follows a layered architecture to separate concerns, making it easier to test, maintain, and scale.

**Request Flow:**
1. **Client** makes an HTTP request to the API.
2. The request passes through **Middlewares** (e.g., error handling, parsing).
3. The **Route** forwards the request to the correct **Controller**.
4. The **Controller** validates the input and delegates business logic to the **Service**.
5. The **Service** processes the rules and calls the **Repository** or Storage interface.
6. The **Database Layer** interacts with the **SQLite Database** to read or write data.
7. The result flows back to the client as an HTTP response.

For a deeper visual understanding, refer to our diagrams located in the `docs/diagrams/` folder:
- [C4 Context Diagram](docs/diagrams/c4-context.md)
- [C4 Container Diagram](docs/diagrams/c4-container.md)
- [C4 Component Diagram](docs/diagrams/c4-component.md)
- [Request Flow Diagram](docs/diagrams/request-flow.md)

## Architectural Decisions

### Evolution of Data Storage (JSON to SQLite)

**v1: JSON Storage**
- Initially, this project utilized a simple JSON file (`chamados.json`) for data persistence. This was chosen to keep the project extremely lightweight, easy to understand, and dependency-free for beginners.
- **Problem:** While great for learning, manipulating a JSON file for concurrent requests in a real-world scenario leads to race conditions, poor performance on reads/writes, and lacks complex querying capabilities.

**v2: SQLite Persistence**
- As the architecture evolved, the persistence layer was migrated to **SQLite**.
- **Benefits:** SQLite provides a real SQL database engine that is file-based. It avoids the overhead of setting up a separate database server (like PostgreSQL) while offering the robustness of SQL (ACID compliance, robust filtering, and true pagination).
- **Architectural Impact:** This migration was smooth because of the Layered Architecture. By creating a `Repository` layer, the `Service` layer remained completely agnostic to how the data was stored.

### Layered Architecture
- **Routes:** Maps HTTP endpoints to controller actions.
- **Controllers:** Handles HTTP requests and responses, extracting parameters and validating payload syntax.
- **Services:** Contains the core business logic (e.g., verifying if a ticket exists before updating it).
- **Repositories (Data Layer):** Handles direct communication with the database or file storage.
- **Middlewares:** Centralizes cross-cutting concerns like error handling.

### Docker (Future Integration)
Docker will be introduced to standardize the development and deployment environments.
- **Reason:** It eliminates the "it works on my machine" problem by bundling the app and its dependencies (Node.js, Storage engine) into a single container.
- **Benefits:** Simplifies CI/CD pipelines and deployment processes.

## Learning Outcomes

By studying and contributing to this project, you can expect to practice and learn:
- Designing and implementing a **RESTful API**.
- Handling **HTTP** methods, status codes, and JSON payloads.
- **Backend development** with Node.js and Express.
- Applying a **Layered Architecture** and separating concerns.
- Understanding the architectural evolution from **JSON storage to a relational DB (SQLite)**.
- Git workflow and version control.
- Writing professional **Technical Documentation** (C4 Model, architectural guides).

## Project structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   └── ticketController.js
├── data/
│   └── database.sqlite
├── db/
│   ├── migrate.js
│   └── seed.js
├── middlewares/
│   └── errorHandler.js
├── repositories/
│   └── ticketRepository.js
├── routes/
│   └── ticketRoutes.js
├── services/
│   └── ticketService.js
├── utils/
│   └── validation.js
└── server.js
```

## Install

```bash
npm install
```

## Database Setup

```bash
cp .env.example .env
npm run db:migrate
npm run db:seed
```

## Run

```bash
npm start &
```

For development with auto-reload:

```bash
npm run dev &
```

API documentation is available at:

- `GET /docs`

## API routes

- `GET /` - Root with link to documentation
- `GET /docs` - Professional HTML documentation
- `POST /tickets` - Create a new ticket
- `GET /tickets` - List all tickets (supports `page`, `limit`, `status`, `categoria`, `prioridade` query params)
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
{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "titulo": "Impressora não imprime",
      "descricao": "A impressora do setor financeiro não responde",
      "categoria": "Impressora",
      "prioridade": "Alta",
      "status": "Aberto",
      "createdAt": "2026-05-29T12:34:56.789Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
