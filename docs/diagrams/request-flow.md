# Sequence Flow Diagram (Fluxo Completo de Requisição)

Diferente do Diagrama de Componentes que é estático (mostra o que as coisas são), este diagrama é temporal e focado na vida útil de uma requisição HTTP, exemplificando perfeitamente a **Criar Chamado**.

## Diagrama (Mermaid)

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente (Web/Mobile)
    participant S as Servidor Express (Middlewares)
    participant R as Rotas (/tickets)
    participant Ctrl as Controller
    participant Serv as Service (Lógica de Negócios)
    participant FS as File System (chamados.json)

    C->>S: POST /tickets (Título, Categoria)

    S->>S: Passa pelo CORS e Parser JSON (OK)
    S->>R: Redireciona de acordo com verbo POST
    R->>Ctrl: Chama 'createTicket(req, res)'

    Note right of Ctrl: Fase de Validação e Orquestração
    Ctrl->>Ctrl: Invoca 'validateTicketPayload()'

    alt Payload é inválido
        Ctrl-->>S: joga ApiError (400) e cai no Handler
        S-->>C: Retorna JSON de Erro (HTTP 400 Bad Request)
    else Payload é válido
        Ctrl->>Serv: Requisita criação enviando 'body' validado

        Note right of Serv: Fase de Criação e Core Logic
        Serv->>Serv: Anexa Data(Timestamp), injeta UUID V4 novo, e 'Status: Aberto'

        Serv->>FS: Carrega e lê arquivo completo (fs.readFile)
        FS-->>Serv: JSON em String -> Obj

        Serv->>Serv: Adiciona novo ticket na memória (Array.push)

        Note right of Serv: Ponto Crítico I/O
        Serv->>FS: Grava Obj convertido sobrescrevendo TUDO no disco (fs.writeFile)

        FS-->>Serv: Confirma Sucesso Físico

        Serv-->>Ctrl: Devolve Objeto recém finalizado (Criado)
        Ctrl-->>C: Retorna Objeto + Status HTTP 201 (Created)
    end
```

## Explicação Técnica (Visão Engenheiro)
O diagrama de sequência explicita o tempo de vida e os caminhos (Branches - Alternativas). Em um sistema moderno, este desenho ilustra exatamente a jornada síncrona Request/Response bloqueante base do REST. E evidencia um ponto de dor profundo para melhoria e debate técnico ("Ponto Crítico I/O"), que sinaliza que não importa o quão rápido a validação ocorra, o gargalo e lentidão estará ditado pela velocidade de leitura escrita total do arquivo de dados pelo Sistema Operacional físico da máquina.
# Request Flow Diagram

## Diagram

```mermaid
sequenceDiagram
    actor Client
    participant Server as Express Server
    participant Middleware as Middleware (ErrorHandler)
    participant Route as Ticket Routes
    participant Controller as Ticket Controller
    participant Service as Ticket Service
    participant Repo as Ticket Repository
    participant DB as SQLite DB

    Client->>Server: HTTP Request (e.g., POST /tickets)
    Server->>Middleware: Parse JSON Body
    Middleware->>Route: Forward Request
    Route->>Controller: Call appropriate action

    activate Controller
    Controller->>Service: Validate input & call createTicket()

    activate Service
    Service->>Repo: Assign UUID & call DB method

    activate Repo
    Repo->>DB: Execute INSERT SQL
    DB-->>Repo: Return success
    Repo-->>Service: Return created ticket
    deactivate Repo

    Service-->>Controller: Return created ticket
    deactivate Service

    Controller-->>Client: HTTP 201 Created (JSON Response)
    deactivate Controller

    %% Error Handling path if any error occurs
    Note over Controller,Repo: If Error occurs anywhere...
    Controller--xMiddleware: next(error)
    Middleware-->>Client: HTTP 400/500 (JSON Error Response)
```

## Explanation

The Request Flow Diagram is a sequence chart that illustrates exactly how a single HTTP Request (for example, creating a new ticket) travels down the application layers and comes back.
It emphasizes the strictly linear top-down flow of dependencies:
`Client -> Route -> Controller -> Service -> Repository -> Database`.
It also demonstrates how the centralized `ErrorHandler` middleware catches any bubbling errors triggered within the lower levels.
