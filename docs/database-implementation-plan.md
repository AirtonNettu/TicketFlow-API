# Plano futuro: banco de dados

## Estado atual antes do git

Arquivos modificados nesta etapa:

- `README.pt-BR.md`
- `public/app.js`
- `src/controllers/ticketController.js`
- `src/middlewares/errorHandler.js`
- `src/server.js`
- `src/services/ticketService.js`
- `src/utils/validation.js`

Principais mudanças feitas:

- `GET /tickets` passou a aceitar filtros e paginacao.
- A listagem agora retorna `{ data, pagination }` em vez de retornar apenas um array.
- Foram adicionados filtros por `status`, `categoria/category` e `prioridade/priority`.
- Foram adicionados parametros de paginacao: `page` e `limit`.
- Foi criada a funcao `validateTicketFilters` para validar os filtros da query string.
- `ApiError` passou a aceitar `code` e `details`.
- O middleware de erro passou a retornar um formato padronizado:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "mensagem do erro",
    "details": []
  }
}
```

- O frontend em `public/app.js` foi ajustado para ler `result.data` quando a API retorna paginacao.
- A documentacao em `README.pt-BR.md` e `/docs` foi atualizada com exemplos de filtros, paginacao e erros.

## Objetivo da proxima etapa

Substituir a persistencia atual em arquivo JSON por um banco de dados, mantendo a API funcionando do jeito atual.

## Plano sugerido

1. Escolher o banco para a primeira versao.
   - Para aprendizado e simplicidade: SQLite.
   - Para algo mais proximo de producao: PostgreSQL.

2. Criar uma camada de repositorio.
   - Exemplo: `src/repositories/ticketRepository.js`.
   - Essa camada ficaria responsavel por buscar, criar, atualizar e deletar tickets.
   - O `ticketService` deixaria de ler/escrever arquivo diretamente.

3. Criar o schema da tabela `tickets`.
   - Campos provaveis:
     - `id`
     - `titulo`
     - `descricao`
     - `categoria`
     - `prioridade`
     - `status`
     - `createdAt`
     - `updatedAt`

4. Migrar as operacoes atuais.
   - `createTicket`
   - `getAllTickets` com filtros e paginacao
   - `getTicketById`
   - `updateTicket`
   - `updateTicketStatus`
   - `deleteTicket`

5. Preservar o contrato da API.
   - Manter o retorno de listagem como `{ data, pagination }`.
   - Manter o formato padronizado de erro.
   - Manter validacoes atuais.

6. Adicionar configuracao por ambiente.
   - Criar `.env.example`.
   - Definir variaveis como `DATABASE_URL` ou caminho do SQLite.

7. Adicionar scripts de banco.
   - Exemplo:
     - `npm run db:migrate`
     - `npm run db:seed`

8. Testar manualmente os endpoints principais.
   - Criar ticket.
   - Listar com e sem filtros.
   - Buscar por ID.
   - Atualizar ticket.
   - Atualizar status.
   - Deletar ticket.

## Observacao importante

Antes de implementar banco de dados, vale commitar o estado atual para deixar a evolucao segura:

```bash
git add .
git commit -m "Add ticket filtering pagination and standard errors"
```
