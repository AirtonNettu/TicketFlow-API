# Contratos de API TicketFlow v2

Este documento lista os principais endpoints planejados para a v2 do TicketFlow, com papeis de acesso e descricoes. Os contratos podem evoluir durante a implementacao.

## Papeis

### usuario

Pode:

- Abrir chamados.
- Ver os proprios chamados.
- Adicionar comentarios nos proprios chamados.
- Fechar chamado resolvido, se a regra de negocio permitir.

Nao pode:

- Ver chamados de outros usuarios.
- Atribuir tecnico.
- Alterar papel de usuarios.
- Ver relatorios globais.

### tecnico

Pode:

- Ver tickets permitidos.
- Assumir ou receber chamados.
- Atualizar status.
- Alterar prioridade, se permitido pela regra de negocio.
- Adicionar solucao e comentarios.

Nao pode:

- Gerenciar usuarios.
- Alterar papeis.
- Remover usuarios.

### admin

Pode:

- Gerenciar usuarios e tecnicos.
- Configurar categorias e SLA.
- Ver todos os chamados.
- Atribuir chamados.
- Ver relatorios e metricas.
- Ter acesso total ao sistema.

## Auth

### POST /auth/register

Acesso: publico

Descricao: cadastra usuario com senha protegida por bcrypt.

Body:

```json
{
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "password": "Senha@123"
}
```

Resposta:

```json
{
  "id": "uuid",
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "role": "usuario"
}
```

### POST /auth/login

Acesso: publico

Descricao: autentica usuario e retorna access token e refresh token.

Body:

```json
{
  "email": "carlos@email.com",
  "password": "Senha@123"
}
```

Resposta:

```json
{
  "accessToken": "jwt",
  "refreshToken": "token",
  "user": {
    "id": "uuid",
    "name": "Carlos Souza",
    "email": "carlos@email.com",
    "role": "usuario"
  }
}
```

### POST /auth/refresh

Acesso: autenticado por refresh token

Descricao: renova o access token e rotaciona o refresh token.

Body:

```json
{
  "refreshToken": "token"
}
```

Resposta:

```json
{
  "accessToken": "new-jwt",
  "refreshToken": "new-token"
}
```

### POST /auth/logout

Acesso: autenticado

Descricao: invalida refresh token ativo.

Body:

```json
{
  "refreshToken": "token"
}
```

## Users

### GET /users/me

Acesso: autenticado

Descricao: retorna o perfil do usuario autenticado.

Resposta:

```json
{
  "id": "uuid",
  "name": "Carlos Souza",
  "email": "carlos@email.com",
  "role": "usuario",
  "active": true
}
```

### GET /users

Acesso: admin

Descricao: lista usuarios.

Query params:

```txt
role=usuario|tecnico|admin
active=true|false
page=1
limit=20
```

### PATCH /users/:id/role

Acesso: admin

Descricao: altera papel de um usuario.

Body:

```json
{
  "role": "tecnico"
}
```

### DELETE /users/:id

Acesso: admin

Descricao: remove usuario via soft delete.

Resposta: `204 No Content`

## Tickets

### POST /tickets

Acesso: usuario

Descricao: abre novo chamado.

Body:

```json
{
  "title": "Computador nao liga",
  "description": "O computador do setor financeiro nao inicia.",
  "category": "Hardware",
  "priority": "Alta"
}
```

Resposta:

```json
{
  "id": "uuid",
  "title": "Computador nao liga",
  "description": "O computador do setor financeiro nao inicia.",
  "category": "Hardware",
  "priority": "Alta",
  "status": "Aberto",
  "createdById": "uuid",
  "assignedToId": null,
  "createdAt": "2026-06-02T12:00:00.000Z"
}
```

### GET /tickets

Acesso: tecnico, admin

Descricao: lista chamados com filtros e paginacao.

Query params:

```txt
status=Aberto
priority=Alta
category=Hardware
assignedToId=uuid
createdById=uuid
page=1
limit=20
```

### GET /tickets/mine

Acesso: usuario

Descricao: lista chamados do usuario autenticado.

### GET /tickets/:id

Acesso: usuario dono do chamado, tecnico responsavel, admin

Descricao: retorna detalhes de um chamado.

### PATCH /tickets/:id/status

Acesso: tecnico, admin

Descricao: atualiza status do chamado.

Body:

```json
{
  "status": "Em andamento"
}
```

### PATCH /tickets/:id/assign

Acesso: tecnico, admin

Descricao: atribui tecnico responsavel ao chamado.

Body:

```json
{
  "technicianId": "uuid"
}
```

### POST /tickets/:id/comments

Acesso: usuario dono do chamado, tecnico responsavel, admin

Descricao: adiciona comentario ao chamado.

Body:

```json
{
  "message": "Foi feito contato com o usuario."
}
```

## Reports

### GET /reports/tickets

Acesso: admin

Descricao: retorna metricas gerais de chamados.

Query params:

```txt
from=2026-06-01
to=2026-06-30
technicianId=uuid
```

Resposta:

```json
{
  "total": 120,
  "open": 30,
  "inProgress": 20,
  "resolved": 50,
  "closed": 20,
  "byPriority": {
    "Baixa": 40,
    "Media": 50,
    "Alta": 30
  },
  "averageResolutionTimeHours": 18.5,
  "slaBreached": 7
}
```

## Notifications

### GET /notifications

Acesso: autenticado

Descricao: lista notificacoes in-app do usuario autenticado.

### PATCH /notifications/:id/read

Acesso: dono da notificacao

Descricao: marca notificacao como lida.

## Eventos

Eventos publicados na fila:

```txt
user.created
user.role_updated
ticket.created
ticket.assigned
ticket.status_changed
ticket.comment_added
notification.email_requested
```

Exemplo de evento `ticket.created`:

```json
{
  "event": "ticket.created",
  "ticketId": "uuid",
  "createdById": "uuid",
  "priority": "Alta",
  "createdAt": "2026-06-02T12:00:00.000Z"
}
```

## Padrao de erro

Todas as APIs devem retornar erros em formato padronizado.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados invalidos",
    "details": [
      {
        "field": "email",
        "message": "Email invalido"
      }
    ]
  }
}
```

Status HTTP esperados:

- `200 OK`
- `201 Created`
- `204 No Content`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `429 Too Many Requests`
- `500 Internal Server Error`
