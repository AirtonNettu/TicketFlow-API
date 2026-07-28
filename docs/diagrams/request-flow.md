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
