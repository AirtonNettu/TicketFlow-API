# ADR 003: Possível Migração Futura para Banco de Dados Relacional (PostgreSQL)

**Data:** Julho de 2026
**Status:** Proposto (Visando Implementação na V2)

## Contexto
O TicketFlow deve dar suporte corporativo à equipe de TI. No roadmap de longo prazo, a arquitetura com banco em JSON (conforme catalogado na ADR-001) atingiu o teto das capacidades e tornou-se insegura frente a solicitações que acontecem ao mesmo milissegundo de clientes paralelos, exigindo escalonamento e transações.

## Decisão (A Ser Homologada)
Abandonar as chamadas nativas em Arquivo TXT e adotar o ecossistema robusto do banco de dados relacional **PostgreSQL**, acessado preferencialmente através de um moderno Mapeador Objeto-Relacional (ORM) tipado estaticamente, como o **Prisma**. Além disso, isolaremos essa complexidade inserindo a Camada "Repository".

## Alternativas Consideradas
1.  **MongoDB (NoSQL):** Inicialmente tentador, dado que o Mongo reflete 1:1 o documento JSON em que o TicketFlow já opera. No entanto, rejeitado pois Chamados de TI demandam estruturas relacionais rigorosas, checagens de chaves estrangeiras ("Qual técnico resolveu qual chamado?"), e garantias ACID absolutas em operações financeiras e de auditoria, tornando o SQL clássico (Postgres) indiscutivelmente superior.

## Consequências
*   **Positivas:** Escalabilidade infinita na arquitetura backend. A API Node.js/Express passa a ser "Stateless" (sem nenhum estado armazenado nela própria). Mil Servidores podem ser ligados atrás de um balanceador (AWS ALB) e conversar perfeitamente com um servidor robusto isolado do Postgres na AWS RDS. Concorrências serão resolvidas através dos bloqueios de banco natural (row locks).
*   **Negativas:** Aumenta muito o escopo e complexidade local do projeto (Necessidade de rodar Docker-Compose local para levantar o Postgres, e migrar (Migration Tables) o banco antes da aplicação sequer iniciar).