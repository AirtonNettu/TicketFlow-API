# C4 Model - Component Diagram (Level 3)

Este diagrama disseca a arquitetura lógica interna exclusivamente do container principal do projeto: A API Back-end Node.js. Ele documenta as responsabilidades dos diretórios e pastas no escopo de *Micro-Arquitetura*.

## Diagrama (Mermaid)

```mermaid
flowchart TB
    %% Externa
    WebApp[Clientes REST Front-end\n[Container Externo]]

    subgraph NodeAPI [TicketFlow API (Container Express)]
        Router("Rotas (ticketRoutes)\n[Component: Express.Router]\n\nRealiza o mapeamento de URIs HTTP (ex: /tickets/:id) e direciona tráfego.")
        Controller("Controladores (ticketController)\n[Component: JS Module]\n\nValida estritamente a entrada (Query/Body), responde com HTTP Status codes adequados.")
        Service("Serviço de Negócio (ticketService)\n[Component: JS Module]\n\nNúcleo. Aplica carimbos lógicos, regras, e efetua manipulação pesada e transformação de arrays.")
        Utils("Validações Globais (utils)\n[Component: Utilities]\n\nIsola os domínios limitantes (Arrays de Categorias, Prioridades permitidas).")
        ErrorHandler("Interceptador Global (middlewares)\n[Component: Express Middleware]\n\nEvita quedas por exceção e devolve falhas (404, 500) padronizadas em JSON.")
    end

    %% Externa (DB)
    DB("chamados.json\n[File System Storage]")

    %% Fluxo de relações e dependências
    WebApp -- "Requests \n(POST, GET, PUT)" --> ErrorHandler
    ErrorHandler -- "Filtro inicial / Segue viagem" --> Router
    Router -- "Delega a responsabilidade" --> Controller
    Controller -- "Verifica dicionários permitidos" --> Utils
    Controller -- "Injeta Payload validado" --> Service
    Service -- "Verifica dicionários permitidos" --> Utils

    %% Tratamento de Queda de erros
    Router -. "throw Exception / next(err)" .-> ErrorHandler
    Controller -. "throw Exception / next(err)" .-> ErrorHandler
    Service -. "throw Exception / next(err)" .-> ErrorHandler
    ErrorHandler -. "Response /error" .-> WebApp

    %% Acesso de Dados (Hardcoupled no V1)
    Service -- "I/O (Gravação direta no SSD)\n fs.writeFile" --> DB

    classDef external fill:#999,stroke:#666,color:#fff,rx:5px,ry:5px
    classDef component fill:#85bbf0,stroke:#5b82a8,color:#222,rx:5px,ry:5px

    class WebApp,DB external
    class Router,Controller,Service,Utils,ErrorHandler component
```

## Explicação Técnica (Visão Engenheiro)
Aqui mapeamos a estrutura "Camada a Camada" implementada. Note como o fluxo flui da "Esquerda para Direita/Cima para baixo" unidirecionalmente, o Router nunca conversa com o DB diretamente (evitando Acoplamento Espaguete). Todas as exceções lançadas por "Controllers" ou "Services" sobem pela cadeia silenciosamente captadas pelo *ErrorHandler*.
O *Anti-pattern* flagrante desta versão 1 encontra-se no fato de que a caixa `Service` salta diretamente para o Banco de dados `DB`, que deveria no futuro (Clean Arch) ser isolada através da injeção de uma caixa intermediária verde (*Ticket Repository*).