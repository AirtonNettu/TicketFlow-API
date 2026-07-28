# Documentação Arquitetural (Architecture)

## Arquitetura Atual
O TicketFlow API foi estruturado usando uma versão simplificada do padrão de **Arquitetura em Camadas (Layered Architecture)** aliada aos princípios de **REST API** e o modelo tradicional de requisição/resposta (Request/Reply) do Node.js/Express.

### Padrões Utilizados: Por que e para quê?

**1. Layered Architecture (Arquitetura em Camadas)**
*   **O que é:** Dividir o sistema em níveis empilhados onde cada nível tem uma função exclusiva e comunica-se apenas com as camadas adjacentes (Routes -> Controllers -> Services).
*   **Por que foi usado:** Facilita a manutenção. Se você precisa mudar o modo de comunicação para o banco, altera só a base (Service/Data). O Route não quebra.
*   **Limitação Atual:** O banco de dados está "grudado" fisicamente ao Serviço de Domínio, violando levemente o princípio. Será corrigido no futuro usando *Repository Pattern*.

**2. REST API**
*   **O que é:** Estilo arquitetural para troca de dados na web utilizando os verbos HTTP de forma semântica (GET para ler, POST para criar, PUT/PATCH para atualizar). Retorna os dados em estado neutro (JSON), agnóstico à interface.
*   **Por que foi usado:** É o padrão web dominante. Um celular iOS ou um site em Angular conseguem consumir esta API igualmente.

**3. Middleware Pattern (O Padrão Interceptador)**
*   **O que é:** Funções injetadas no fluxo "Pausa/Continue" do Express. Elas manipulam a requisição antes de atingir o controller, ou mascaram respostas na saída.
*   **Por que foi usado:** Lógicas universais (como checar erro 404 e parsear JSONs) ficariam duplicadas em todas as rotas. O Middleware concentra tudo no nível do Servidor.

**4. Separation of Concerns (SoC / Separação de Preocupações)**
*   **O que é:** Cada pasta ou arquivo resolve apenas um problema. Rotas só mapeiam. Utils só validam.
*   **Vantagem:** Evita arquivos *God Class* gigantescos com 2000 linhas de código.

---

## O Fluxo de Execução entre Componentes

Toda requisição feita à API é uma jornada, seguindo uma via expressa controlada, fluindo estritamente da entrada até o armazenamento e devolvendo uma resposta.

**Caminho Principal:**
`Cliente HTTP -> Server(Middlewares) -> Routes -> Controllers -> Services -> Persistência (JSON)`

### Exemplos do Fluxo Completo

#### 1. Criar Ticket (POST /tickets)
1. O Front-end dispara `POST http://localhost:3000/tickets` contendo `{"titulo": "Falta energia"}`.
2. O `server.js` lê os Middlewares globais e passa para a rota de `tickets`.
3. O roteador (`ticketRoutes.js`) encaminha o método `POST` para `ticketController.createTicket`.
4. O `Controller` repassa para o `Utils`, verificando se os campos básicos vieram.
5. Tudo OK, os dados chegam no `Service`. Ele gera o ID e carimba a data.
6. O `Service` carrega todo o arquivo `chamados.json`, adiciona o novo na memória, e sobrescreve o arquivo no HD.
7. Com o HD atualizado com sucesso, o Service devolve a resposta validada para o Controller que retorna o status code `201 Created` via HTTP para o Front-end.

#### 2. Atualizar Status (PATCH /tickets/:id/status)
1. Cliente envia `{"status": "Em andamento"}`.
2. Roteador repassa o PATCH para `updateStatus`.
3. O `Utils` verifica se "Em andamento" é uma palavra válida (pois "Em Processo" geraria um erro 400).
4. O `Service` puxa a lista, procura o índice através do ID passado na URL. Se não achar, lança "Erro 404".
5. Se achar, altera apenas a chave `status`, e sobrescreve todo o arquivo `JSON`.

#### 3. Deletar Ticket (DELETE /tickets/:id)
1. Cliente dispara a requisição sem corpo (`body` vazio).
2. O `Service` puxa a lista completa e procura o índice.
3. Se não achar, erro 404. Se achar, faz uma operação `.splice()` (Remove item da Array em memória).
4. A array sem o elemento é gravada no arquivo.
5. O `Controller` retorna status `204 No Content` provando que a destruição foi executada com sucesso.