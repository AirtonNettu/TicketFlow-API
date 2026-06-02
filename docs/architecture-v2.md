# Arquitetura TicketFlow v2

Este documento descreve a arquitetura planejada para a v2 do TicketFlow. A v2 sera reconstruida com TypeScript, banco de dados, autenticacao, autorizacao por papeis, notificacoes assicronas e frontend moderno.

## Objetivo da v2

Transformar o TicketFlow em uma aplicacao completa de gerenciamento de chamados, com separacao clara entre usuario comum, tecnico e admin/gerente.

Principais objetivos:

- Migrar de JavaScript para TypeScript.
- Trocar armazenamento JSON por PostgreSQL.
- Adicionar autenticacao com JWT.
- Adicionar autorizacao por papeis.
- Separar responsabilidades em servicos.
- Usar fila de mensagens para notificacoes.
- Criar frontend React profissional.
- Preparar deploy em Railway e Vercel.

## Stack tecnica

Backend:

- Node.js
- TypeScript
- Express ou Fastify
- Clean Architecture

Banco e ORM:

- PostgreSQL
- Prisma ORM
- Um schema por servico no mesmo cluster PostgreSQL

Autenticacao:

- JWT access token curto, com duracao aproximada de 15 minutos.
- Refresh token rotativo, com duracao aproximada de 7 dias.
- Senhas com bcrypt, cost 12.

Filas:

- Redis
- BullMQ

Frontend:

- React
- Axios
- React Query

Deploy:

- Railway para backend, banco e Redis.
- Vercel para frontend.
- GitHub Actions para CI.

## Visao geral dos componentes

```txt
Clientes
  Frontend Web
  App Mobile
  Cliente API

API Gateway
  Rate limit
  Roteamento
  HTTPS
  Validacao inicial de autenticacao

Auth Service
  Login
  Cadastro
  Access token
  Refresh token
  Hash de senha

User Service
  Usuarios
  Tecnicos
  Admins
  Perfis
  Soft delete

Ticket Service
  Chamados
  Status
  Prioridade
  Categorias
  Comentarios
  SLA

Notification Service
  E-mail
  Notificacao in-app
  Webhook

Message Bus
  Redis
  BullMQ

Bancos
  DB users
  DB tickets
  DB notifications
```

## Comunicacao entre servicos

Os servicos principais nao devem chamar uns aos outros diretamente como primeira opcao. A comunicacao entre User Service, Ticket Service e Notification Service sera feita por eventos em fila.

Exemplos de eventos:

- `user.created`
- `user.role_updated`
- `ticket.created`
- `ticket.assigned`
- `ticket.status_changed`
- `ticket.comment_added`
- `notification.email_requested`

Vantagens:

- Reduz acoplamento.
- Permite escalar Notification Service separado dos demais.
- Evita que falhas em notificacoes travem criacao ou atualizacao de chamados.
- Facilita adicionar novos consumidores no futuro.

## API Gateway

O API Gateway centraliza a entrada das requisicoes antes dos servicos internos.

Responsabilidades:

- Roteamento para os servicos internos.
- HTTPS em producao.
- Rate limiting.
- Validacao inicial de token.
- Bloqueio de origens ou clientes indevidos.
- Padronizacao de logs de requisicao.

Rotas exemplo:

```txt
/auth/*      -> Auth Service
/users/*     -> User Service
/tickets/*   -> Ticket Service
/reports/*   -> Ticket Service ou Reports module
```

## Auth Service

Responsavel por autenticacao e emissao de tokens.

Responsabilidades:

- Cadastro de usuario.
- Login.
- Geracao de access token.
- Geracao e rotacao de refresh token.
- Logout.
- Hash de senha com bcrypt.
- Validacao de credenciais.
- Protecao contra tentativas abusivas.

Regras:

- Nunca retornar senha ou hash.
- Nunca salvar senha em texto puro.
- Access token deve ter vida curta.
- Refresh token deve ser rotativo.
- Refresh tokens antigos devem ser invalidados apos rotacao.

## User Service

Responsavel por usuarios e papeis.

Papeis:

- `usuario`
- `tecnico`
- `admin`

Responsabilidades:

- Listar usuarios.
- Obter perfil autenticado.
- Alterar papel de usuario.
- Soft delete de usuarios.
- Controlar usuarios tecnicos e admins.

Regras:

- Usuario comum nao pode listar todos os usuarios.
- Tecnico nao pode promover usuarios.
- Apenas admin pode alterar papel.
- Apenas admin pode remover usuarios.

## Ticket Service

Responsavel pelo ciclo de vida dos chamados.

Status planejados:

- `Aberto`
- `Em andamento`
- `Resolvido`
- `Fechado`

Prioridades planejadas:

- `Baixa`
- `Media`
- `Alta`

Responsabilidades:

- Criar chamado.
- Listar chamados.
- Listar chamados do usuario autenticado.
- Filtrar por status, prioridade, categoria e tecnico.
- Atribuir tecnico.
- Atualizar status.
- Adicionar comentarios.
- Calcular SLA e prazo.

Regras:

- Usuario comum cria chamado e ve apenas seus proprios chamados.
- Usuario comum pode comentar nos proprios chamados.
- Tecnico ve tickets permitidos e pode assumir ou atualizar status.
- Admin ve todos os tickets e pode reatribuir responsaveis.

## Notification Service

Responsavel por notificacoes assicronas.

Tipos:

- E-mail.
- In-app.
- Webhook.

Responsabilidades:

- Consumir eventos da fila.
- Criar notificacoes internas.
- Enviar e-mails.
- Registrar historico de notificacoes.
- Reprocessar notificacoes com falha.

Eventos de exemplo:

- Ao criar chamado, notificar tecnicos ou admin.
- Ao atribuir tecnico, notificar tecnico.
- Ao mudar status, notificar usuario dono do chamado.
- Ao comentar, notificar envolvidos.

## Banco de dados

Planejamento:

- PostgreSQL como banco principal.
- Prisma como ORM.
- Um schema por servico dentro do mesmo cluster.

Schemas planejados:

```txt
users
tickets
notifications
```

Observacoes:

- Cada servico deve cuidar dos seus proprios dados.
- Evitar acesso direto de um servico ao schema de outro.
- Usar eventos para sincronizar informacoes necessarias.

## Frontend

Responsabilidades:

- Tela de login.
- Tela de cadastro.
- Dashboard do usuario comum.
- Dashboard do tecnico.
- Painel admin/gerente.
- Listagem e filtros de chamados.
- Criacao de chamados.
- Comentarios.
- Atualizacao de status.
- Relatorios.

Ferramentas:

- React.
- Axios para chamadas HTTP.
- React Query para cache, loading, refetch e mutations.

## Deploy

Planejamento:

- Backend, PostgreSQL e Redis no Railway.
- Frontend na Vercel.
- CI com GitHub Actions.

CI minimo:

- Instalar dependencias.
- Rodar lint.
- Rodar testes.
- Rodar build.

## Riscos de arquitetura

Pontos de atencao:

- Microservicos aumentam complexidade de setup.
- Redis e BullMQ exigem cuidado com falhas e retentativas.
- Refresh token rotativo precisa de implementacao cuidadosa.
- API Gateway precisa ser simples no inicio para nao atrasar o projeto.
- Cada servico precisa ter responsabilidade bem definida.

## Ordem de implementacao

1. Base do monorepo TypeScript.
2. Infra local com PostgreSQL e Redis.
3. Prisma e migrations iniciais.
4. Auth Service.
5. User Service.
6. Ticket Service.
7. Message Bus com BullMQ.
8. Notification Service.
9. Reports.
10. Frontend.
11. API Gateway.
12. CI/CD e deploy.
