# C4 Model - Context Diagram (Level 1)

Este diagrama representa a visão "Aérea" ou global do TicketFlow. Ele foca unicamente em responder: Quem usa esse software, e para qual finalidade central? É totalmente abstraído de tecnologia.

## Diagrama (Mermaid)

```mermaid
flowchart TB
    %% Atores
    UserColaborador(Colaborador da Empresa\n[Pessoa])
    UserSuporte(Técnico de TI / Helpdesk\n[Pessoa])

    %% Sistema Principal
    SystemTicketFlow(TicketFlow System\n[Sistema de Software]\n\nPlataforma de gerenciamento centralizado de incidentes e requisições técnicas de TI.)

    %% Relações
    UserColaborador -- "Relata problemas, abre\nchamados e acompanha soluções" --> SystemTicketFlow
    UserSuporte -- "Visualiza filas, prioriza\ntarefas e atualiza status para Resolvido" --> SystemTicketFlow

    classDef person fill:#08427b,stroke:#052e56,color:#fff,rx:5px,ry:5px
    classDef system fill:#1168bd,stroke:#0b4884,color:#fff,rx:5px,ry:5px
    class UserColaborador,UserSuporte person
    class SystemTicketFlow system
```

## Explicação Técnica (Visão Engenheiro)
O nível de Contexto é desenhado primordialmente para o Product Owner e os tomadores de decisão (Stakeholders) validarem o negócio (Domínio). Note a ausência deliberada da menção "Node.js" ou "JSON".
As arestas (linhas) evidenciam comportamentos de negócio, definindo com clareza as Personas: o usuário gerador de demanda (Colaborador) e o resolvedor (TI).
# C4 Context Diagram

Este diagrama representa a visão "Aérea" ou global do TicketFlow. Ele foca unicamente em responder: Quem usa esse software, e para qual finalidade central? É totalmente abstraído de tecnologia.

## Diagrama (Mermaid)

```mermaid
flowchart TB
    %% Atores
    UserColaborador(Colaborador da Empresa\n[Pessoa])
    UserSuporte(Técnico de TI / Helpdesk\n[Pessoa])

    %% Sistema Principal
    SystemTicketFlow(TicketFlow System\n[Sistema de Software]\n\nPlataforma de gerenciamento centralizado de incidentes e requisições técnicas de TI.)

    %% Relações
    UserColaborador -- "Relata problemas, abre\nchamados e acompanha soluções" --> SystemTicketFlow
    UserSuporte -- "Visualiza filas, prioriza\ntarefas e atualiza status para Resolvido" --> SystemTicketFlow

    classDef person fill:#08427b,stroke:#052e56,color:#fff,rx:5px,ry:5px
    classDef system fill:#1168bd,stroke:#0b4884,color:#fff,rx:5px,ry:5px
    class UserColaborador,UserSuporte person
    class SystemTicketFlow system
```

## Explicação Técnica (Visão Engenheiro)
O nível de Contexto é desenhado primordialmente para o Product Owner e os tomadores de decisão (Stakeholders) validarem o negócio (Domínio). Note a ausência deliberada da menção "Node.js" ou "JSON".
As arestas (linhas) evidenciam comportamentos de negócio, definindo com clareza as Personas: o usuário gerador de demanda (Colaborador) e o resolvedor (TI).