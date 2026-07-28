# Guia de Migração e Evolução Arquitetural (Migration Guide)

Este documento dita como a equipe de engenharia pode conduzir o projeto TicketFlow API de um protótipo didático para um sistema corporativo de alto desempenho de forma metódica e livre de acidentes.

## Estratégia de Migração Segura e Profissional (O Padrão Ouro)

Sistemas em produção não podem ser desligados para "ganharem pintura nova".

*   **Fase 1 (Sustentação):** Mantenha o sistema JSON atual funcionando. Identifique pontos cegos colocando *Testes de Regressão* (Testes que atestam a funcionalidade antiga, travando seus comportamentos corretos).
*   **Fase 2 (Nova Infraestrutura Paralela):** Levante a nova arquitetura de persistência. Suba um contêiner PostgreSQL via Docker, adicione o ORM. Escreva a nova lógica nos Repositórios sem plugar nas Rotas.
*   **Fase 3 (Rotas Paralelas / Versionamento API):** Migrar a API via "Versionamento". Rotas que batiam no JSON continuam em `/tickets`. Crie um sufixo ou prefixo novo `/v2/tickets` acoplado ao banco SQL novo. O aplicativo cliente aponta para V2.
*   **Fase 4 (Simulação e Equivalência):** Garantir que a saída JSON da V2 seja estruturalmente idêntica à V1 (Compatibilidade de interface), a menos que documentado.
*   **Fase 5 (Descomissionamento):** Apague os arquivos `chamados.json` e as rotas antigas.

---

## 1. Migração Parcial Intra-Node (Refatoração de Acesso aos Dados)

A transição mandatória para elevar o código e consertar o acoplamento perigoso e falhas de "Race Condition".

*   **Arquitetura Atual:** `Service -> (Biblioteca fs) -> JSON`
*   **Evolução Alvo:** `Service -> TicketRepository -> PostgreSQL (via ORM)`

**Como executar:**
*   Crie a pasta `src/repositories`. O Repositório encapsula estritamente código de banco de dados (`SELECT, INSERT, UPDATE, DELETE`).
*   Injete o Repositório no Serviço. O serviço deve pedir "Salva isso!" de forma genérica, sem saber se vai pra nuvem ou pra disco rígido.
*   **Riscos:** Transformação de dados (Tipagem). O UUID e as datas vindas de um Postgres podem ter formatos diferentes do texto puro guardado no JSON (Timezones).

---

## 2. Mudança Completa de Arquitetura (Clean / Hexagonal)

A separação extrema entre "Mecanismos HTTP/Frameworks Web" e "Regras de Negócio", que ficam no centro geográfico intocado do código.

*   **O que muda:** O Serviço perde contato total com os Controllers do Express. Introduzem-se as camadas de "Casos de Uso" (Use Cases) e "Entidades" puras, e Adaptadores para conectar o Express a elas.
*   **Benefícios:** Se o Express.js parar de ser atualizado (como já aconteceu na comunidade Node), a equipe migra para o NestJS/Fastify alterando cerca de 10% do sistema total (apenas as pontas/bordas, não o miolo do aplicativo).

---

## 3. Mudança de Linguagem e Framework (Ex: Python + FastAPI)

Caso a empresa determine que todo o ecossistema deve passar de JS/TS para ecossistema Python (visando integrações em AI ou cultura do time):

*   **O que permanece intacto:**
    *   As regras de negócios da aplicação TicketFlow.
    *   A modelagem mental de banco de dados.
    *   As URLs das rotas (`/tickets/:id`).
    *   O contrato visual de saída: o Frontend SPA React/Vue continuará consumindo sem perceber a mudança por trás dos panos.
*   **O que muda profundamente:**
    *   **Sintaxe e Tipagem Pydantic:** Os Utils (que verificam chaves de Objetos JS através de extensos if/elses em `utils/validation.js`) somem. O FastAPI junto do Python Pydantic geram schemas imutáveis automaticamente.
    *   **Ferramentas de ORM:** Prisma/Sequelize dão lugar ao SQLAlchemy ou Tortoise ORM.
    *   **Inversão de Dependências Dinâmicas (DI):** Bibliotecas como `Depends()` do FastAPI forçam que você crie o Serviço fora do endpoint e o injete por argumento, padronizando a separação de escopos que é tão flexível/insegura no Express puro.