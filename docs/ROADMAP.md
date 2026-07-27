# Roadmap de Evolução Arquitetural (TicketFlow V2)

Para transpor este projeto educacional e simples para o escopo de uso corporativo rigoroso, as seguintes ferramentas e padrões devem ser introduzidos.

## 1. PostgreSQL (Substituir o JSON)
*   **Por que evoluir:** O armazenamento atual trava toda a lista na memória, escala horrivelmente, causa perdas simultâneas graves, e impede a inicialização redundante (múltiplos pods/servidores da mesma API).
*   **Benefício:** Integridade relacional, travamento seguro de arquivos (transações ACID), e capacidade de ser hospedado independentemente do servidor (nuvem gerenciada).

## 2. Padrão Repository e ORM (Prisma / TypeORM)
*   **Por que evoluir:** Retirar as operações de inserção física ou concatenação manual de queries de dentro dos Serviços.
*   **Benefício:** A ORM (Object-Relational Mapping) traz tipagem (Typescript) onde se sabe perfeitamente quais métodos estão disponíveis. O Repository Pattern permite trocar facilmente o banco no futuro sem dor.

## 3. Autenticação (JWT) e RBAC (Role-Based Access Control)
*   **Por que evoluir:** No modelo V1, um usuário sem identificação acessa e deleta o ticket de um analista administrativo.
*   **Benefício:** Com *JSON Web Tokens*, garante-se o Login stateful sem armazenar sessões físicas no backend. O *Role-Based Access* barra na porta do roteador (middlewares de controle de permissão) quem tenta fazer POST/DELETE sem ter a patente "ADMIN" ou "TECNICO".

## 4. Testes Automatizados (Unit & E2E) e CI/CD
*   **Por que evoluir:** Cada atualização manual acarreta bugs que são pegos apenas pelo usuário final.
*   **Benefício:** Implementação com Jest e Supertest para certificar que novas rotas não danifiquem as antigas (Regressão). Adoção do GitHub Actions (Continuous Integration) para que o código jamais suba ao servidor (Deploy) se os testes falharem.

## 5. Migração Definitiva para Cloud Serverless & Containers e Observabilidade
*   **Por que evoluir:** Subir o app de forma manual com "npm start" dentro de um EC2 isolado não acompanha altas demandas.
*   **Benefício:** Arquitetura 100% *Stateless* onde a camada computacional pode ir para o Vercel ou ECS, e a gravação ocorre em banco externo. Logs em console darão lugar a Bibliotecas Profissionais de Telemetria e *Log Aggregation* (ex: Datadog, ELK).