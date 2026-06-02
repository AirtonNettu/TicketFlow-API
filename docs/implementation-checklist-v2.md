# Checklist de Implementacao TicketFlow v2

Este checklist organiza a v2 por sprints. A ideia e construir a arquitetura completa por etapas, validando cada parte antes de seguir.

## Sprint 1 - Base do projeto

- [ ] Criar monorepo TypeScript com pnpm workspaces.
- [ ] Criar estrutura inicial de apps e packages.
- [ ] Configurar ESLint.
- [ ] Configurar Prettier.
- [ ] Configurar `tsconfig` base.
- [ ] Criar Docker Compose com PostgreSQL e Redis.
- [ ] Configurar Prisma ORM.
- [ ] Criar schema base para users.
- [ ] Criar schema base para tickets.
- [ ] Criar schema base para notifications.
- [ ] Criar migrations iniciais.
- [ ] Criar seed de dados.
- [ ] Criar health check dos servicos.

## Sprint 2 - Auth Service

- [ ] Criar Auth Service em TypeScript.
- [ ] Criar endpoint `POST /auth/register`.
- [ ] Criar endpoint `POST /auth/login`.
- [ ] Criar endpoint `POST /auth/refresh`.
- [ ] Criar endpoint `POST /auth/logout`.
- [ ] Implementar bcrypt com cost 12.
- [ ] Implementar access token com expiracao curta.
- [ ] Implementar refresh token rotativo.
- [ ] Salvar refresh token de forma segura.
- [ ] Invalidar refresh token antigo apos rotacao.
- [ ] Criar middleware JWT guard reutilizavel.
- [ ] Criar middleware/decorator de papeis.
- [ ] Validar `JWT_SECRET` e variaveis de ambiente no startup.
- [ ] Adicionar rate limit no login.

## Sprint 3 - User Service

- [ ] Criar User Service em TypeScript.
- [ ] Criar CRUD de usuarios com validacao.
- [ ] Criar endpoint `GET /users/me`.
- [ ] Criar endpoint `GET /users`.
- [ ] Criar endpoint `PATCH /users/:id/role`.
- [ ] Criar endpoint `DELETE /users/:id`.
- [ ] Implementar soft delete.
- [ ] Permitir `GET /users` apenas para admin.
- [ ] Permitir `PATCH /users/:id/role` apenas para admin.
- [ ] Impedir que usuario comum altere proprio papel.
- [ ] Publicar evento `user.created`.
- [ ] Publicar evento `user.role_updated`.

## Sprint 4 - Ticket Service

- [ ] Criar Ticket Service em TypeScript.
- [ ] Criar endpoint `POST /tickets`.
- [ ] Criar endpoint `GET /tickets`.
- [ ] Criar endpoint `GET /tickets/mine`.
- [ ] Criar endpoint `GET /tickets/:id`.
- [ ] Criar endpoint `PATCH /tickets/:id/assign`.
- [ ] Criar endpoint `PATCH /tickets/:id/status`.
- [ ] Criar endpoint `POST /tickets/:id/comments`.
- [ ] Adicionar filtros por status, prioridade, categoria e tecnico.
- [ ] Adicionar paginacao.
- [ ] Criar maquina de estados para status.
- [ ] Adicionar campo de SLA.
- [ ] Calcular prazo de SLA no banco.
- [ ] Garantir que usuario comum veja apenas proprios chamados.
- [ ] Garantir que tecnico acesse apenas tickets permitidos.
- [ ] Publicar evento `ticket.created`.
- [ ] Publicar evento `ticket.assigned`.
- [ ] Publicar evento `ticket.status_changed`.
- [ ] Publicar evento `ticket.comment_added`.

## Sprint 5 - Notifications + Reports

- [ ] Configurar BullMQ com Redis.
- [ ] Criar filas de notificacao.
- [ ] Criar Notification Service.
- [ ] Criar worker de e-mail com Nodemailer ou Resend.
- [ ] Criar notificacoes in-app.
- [ ] Criar tabela de notificacoes.
- [ ] Criar endpoint `GET /notifications`.
- [ ] Criar endpoint `PATCH /notifications/:id/read`.
- [ ] Consumir evento `ticket.created`.
- [ ] Consumir evento `ticket.assigned`.
- [ ] Consumir evento `ticket.status_changed`.
- [ ] Consumir evento `ticket.comment_added`.
- [ ] Criar endpoint `GET /reports/tickets`.
- [ ] Relatorio de volume de chamados.
- [ ] Relatorio de tempo medio de resolucao.
- [ ] Relatorio de SLA.
- [ ] Relatorio por tecnico.
- [ ] Relatorio por prioridade.

## Sprint 6 - Frontend + Deploy

- [ ] Criar frontend React.
- [ ] Configurar Axios.
- [ ] Configurar React Query.
- [ ] Criar tela de login.
- [ ] Criar tela de cadastro.
- [ ] Criar dashboard do usuario comum.
- [ ] Criar dashboard do tecnico.
- [ ] Criar painel admin.
- [ ] Criar tela de listagem de chamados.
- [ ] Criar filtros por papel.
- [ ] Criar formulario de abertura de chamado.
- [ ] Criar tela de detalhes do chamado.
- [ ] Criar area de comentarios.
- [ ] Criar acoes de atribuir tecnico e mudar status.
- [ ] Criar painel de usuarios para admin.
- [ ] Criar tela de relatorios.
- [ ] Criar API Gateway com Express ou Nginx + reverse proxy.
- [ ] Configurar rate limit no gateway.
- [ ] Configurar CORS.
- [ ] Configurar HTTPS em producao.
- [ ] Configurar CI com GitHub Actions.
- [ ] Rodar lint no CI.
- [ ] Rodar testes no CI.
- [ ] Rodar build no CI.
- [ ] Fazer deploy backend no Railway.
- [ ] Fazer deploy PostgreSQL no Railway.
- [ ] Fazer deploy Redis no Railway.
- [ ] Fazer deploy frontend na Vercel.

## Checklist de seguranca da v2

- [ ] Validar inputs com Zod.
- [ ] Nao retornar senha nem hash.
- [ ] Usar bcrypt com cost 12.
- [ ] Usar access token curto.
- [ ] Usar refresh token rotativo.
- [ ] Invalidar refresh token em logout.
- [ ] Proteger rotas autenticadas.
- [ ] Proteger rotas por papel.
- [ ] Aplicar rate limit em login.
- [ ] Configurar CORS corretamente.
- [ ] Guardar segredos em `.env`.
- [ ] Validar variaveis de ambiente no startup.
- [ ] Evitar SQL Injection usando Prisma corretamente.
- [ ] Evitar XSS no frontend.
- [ ] Padronizar erros sem expor detalhes internos.

## Criterios de conclusao da v2

- [ ] Usuario comum consegue cadastrar, logar e abrir chamado.
- [ ] Usuario comum consegue ver os proprios chamados.
- [ ] Tecnico consegue ver, assumir e atualizar chamados.
- [ ] Admin consegue gerenciar usuarios e visualizar relatorios.
- [ ] Notificacoes sao disparadas por eventos.
- [ ] API Gateway roteia requisicoes para os servicos.
- [ ] Frontend consome a API com autenticao.
- [ ] Projeto tem README atualizado.
- [ ] Projeto roda localmente com Docker Compose.
- [ ] Projeto esta publicado em ambiente de producao.
