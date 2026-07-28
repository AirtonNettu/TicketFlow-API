# Sistema de Chamados de Suporte Técnico (TicketFlow API)

![license](https://img.shields.io/badge/license-MIT-green.svg)
![node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

API REST para gerenciar chamados de suporte técnico. Ideal para portfólio de cargos como Assistente de Suporte de TI, Analista de Suporte e Desenvolvedor Backend Júnior.

## Visão Geral do Projeto (Project Overview)

A API TicketFlow foi criada para resolver o problema de requisições de suporte de TI desorganizadas e descentralizadas. Este sistema fornece uma API robusta para criar, rastrear, filtrar e gerenciar chamados, garantindo que nenhuma requisição seja perdida ou atrasada.
O principal objetivo desta API é servir como um backend confiável para um ambiente de Help Desk ou Service Desk. O público-alvo inclui analistas de suporte gerenciando operações internas, bem como estudantes de engenharia de software buscando um projeto completo de API REST construído com Node.js.

## Tecnologias

- Node.js
- Express
- JavaScript
- UUID
- SQLite (Migração de Storage v2)
- Arquitetura em camadas (Rotas, Controllers, Services, Repositories)

## Visão Geral da Arquitetura (Architecture Overview)

O sistema segue uma arquitetura em camadas para separar responsabilidades, tornando mais fácil de testar, manter e escalar.

**Fluxo da Requisição (Request Flow):**
1. **Cliente** faz uma requisição HTTP para a API.
2. A requisição passa por **Middlewares** (ex: tratamento de erros, parsing).
3. A **Rota (Route)** encaminha a requisição para o **Controller** correto.
4. O **Controller** valida a entrada e delega a lógica de negócios para o **Service**.
5. O **Service** processa as regras e chama o **Repository** (camada de dados).
6. A **Camada de Dados** interage com o **Banco de Dados SQLite** para ler ou escrever dados.
7. O resultado retorna para o cliente como uma resposta HTTP.

Para uma compreensão visual mais profunda, consulte nossos diagramas localizados na pasta `docs/diagrams/`:
- [Diagrama de Contexto C4 (C4 Context Diagram)](docs/diagrams/c4-context.md)
- [Diagrama de Container C4 (C4 Container Diagram)](docs/diagrams/c4-container.md)
- [Diagrama de Componente C4 (C4 Component Diagram)](docs/diagrams/c4-component.md)
- [Diagrama de Fluxo de Requisição (Request Flow Diagram)](docs/diagrams/request-flow.md)

## Decisões Arquiteturais (Architectural Decisions)

### Evolução do Armazenamento de Dados (De JSON para SQLite)

**v1: Storage JSON**
- Inicialmente, este projeto utilizava um simples arquivo JSON (`chamados.json`) para persistência de dados. Isso foi escolhido para manter o projeto extremamente leve, fácil de entender e sem dependências externas para iniciantes.
- **Problema:** Embora ótimo para aprendizado, manipular um arquivo JSON para requisições concorrentes em um cenário real leva a condições de corrida, baixo desempenho e falta de recursos de consulta complexos.

**v2: Persistência com SQLite**
- Conforme a arquitetura evoluiu, a camada de persistência foi migrada para **SQLite**.
- **Benefícios:** O SQLite fornece uma engine de banco de dados SQL real baseada em arquivo. Evita a sobrecarga de configurar um servidor de banco de dados separado (como PostgreSQL), oferecendo a robustez do SQL (conformidade ACID, consultas complexas e paginação real).
- **Impacto Arquitetural:** Essa migração foi suave graças à Arquitetura em Camadas. Ao criar a camada de `Repository`, a camada de `Service` permaneceu completamente agnóstica sobre como os dados eram armazenados.

### Arquitetura em Camadas (Layered Architecture)
- **Rotas:** Mapeia endpoints HTTP para as ações do controller.
- **Controllers:** Lida com requisições e respostas HTTP, extraindo parâmetros e validando a sintaxe do payload.
- **Services:** Contém a lógica de negócios principal (ex: verificar se um ticket existe antes de atualizá-lo).
- **Repositories (Camada de Dados):** Lida com a comunicação direta com o banco de dados.
- **Middlewares:** Centraliza preocupações transversais, como tratamento de erros.

### Docker (Integração Futura)
O Docker será introduzido para padronizar os ambientes de desenvolvimento e implantação.
- **Motivo:** Elimina o problema "funciona na minha máquina", empacotando o aplicativo e suas dependências (Node.js, Storage engine) em um único contêiner.
- **Benefícios:** Simplifica pipelines de CI/CD e processos de deploy.

## Resultados de Aprendizado (Learning Outcomes)

Ao estudar e contribuir para este projeto, você pode esperar praticar e aprender:
- Projetar e implementar uma **API RESTful**.
- Lidar com métodos **HTTP**, códigos de status e payloads JSON.
- **Desenvolvimento Backend** com Node.js e Express.
- Aplicar uma **Arquitetura em Camadas** e o **Repository Pattern**.
- Evolução arquitetural passando de **armazenamento JSON para DB relacional (SQLite)**.
- **Separação de Responsabilidades (Separation of Concerns)**.
- Escrever **Documentação Técnica** profissional e diagramas arquiteturais.

## Estrutura do projeto

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

## Instalação

```bash
npm install
```

## Configuração do Banco de Dados

```bash
cp .env.example .env
npm run db:migrate
npm run db:seed
```

## Execução

```bash
npm start &
```

Para desenvolvimento com auto-reload:

```bash
npm run dev &
```

A documentação da API está disponível em:

- `GET /docs`

## Rotas da API

- `GET /` - Raiz com link para documentação
- `GET /docs` - Documentação HTML profissional
- `POST /tickets` - Criar um novo chamado
- `GET /tickets` - Listar todos os chamados (suporta parâmetros de consulta `page`, `limit`, `status`, `categoria`, `prioridade`)
- `GET /tickets/:id` - Buscar chamado por ID
- `PUT /tickets/:id` - Atualizar um chamado (completo)
- `PATCH /tickets/:id/status` - Atualizar apenas o status do chamado
- `DELETE /tickets/:id` - Excluir um chamado

## Campos do chamado

Os chamados incluem os seguintes campos:

- `id`: identificador único gerado com UUID
- `titulo`: título breve do problema
- `descricao`: descrição detalhada do problema
- `categoria`: categoria do chamado
- `prioridade`: prioridade do chamado
- `status`: status atual do chamado
- `createdAt`: data/hora de criação no formato ISO 8601

### Valores válidos

- `categoria`: `Hardware`, `Software`, `Rede`, `Impressora`, `Outros`
- `prioridade`: `Baixa`, `Média`, `Alta`
- `status`: `Aberto`, `Em andamento`, `Resolvido`, `Fechado`

## Exemplos de requisição

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

### Atualizar chamado (completo)

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

## Exemplos de resposta

Resposta de sucesso para `GET /tickets` (200):

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

## Licença

Este projeto está licenciado sob a Licença MIT — veja o arquivo `LICENSE` para detalhes.
