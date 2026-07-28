# Guia de Aprendizado: Engenharia de Software com TicketFlow

Seja bem-vindo(a) ao **Guia de Aprendizado do TicketFlow**. Este documento foi escrito sob a perspectiva de um Arquiteto de Software Sênior ensinando as bases da engenharia backend moderna.

O objetivo não é apenas mostrar o código, mas ensinar **como e por que** pensamos dessa forma. Aqui você terá duas perspectivas:
1. **Visão Iniciante:** Conceitos explicados de forma simples e didática.
2. **Visão Profissional:** Como decisões são tomadas na vida real por engenheiros de software experientes.

---

## 1. O problema que o TicketFlow resolve

**Visão Iniciante:** Imagine uma empresa com 500 funcionários. Quando o computador de alguém quebra, ou a internet cai, essa pessoa precisa pedir ajuda. Se todos mandarem mensagens no WhatsApp do cara da TI, ele vai enlouquecer e esquecer as coisas. O TicketFlow é o sistema onde o funcionário "abre um chamado" e a equipe de TI consegue organizar quem pediu o quê e qual a prioridade.

**Visão Profissional:** Sistemas de Help Desk (Service Desk) resolvem problemas de rastreabilidade, SLAs (Acordos de Nível de Serviço) e gargalos operacionais. O TicketFlow atua como um sistema de registro (System of Record) para requisições de TI. Ele entrega valor ao negócio centralizando a comunicação, gerando métricas de resolução e garantindo auditoria de processos técnicos.

---

## 2. Como pensar antes de programar

**Visão Iniciante:** Antes de construir uma casa, você precisa da planta. Se você começar colocando tijolos de forma aleatória, a casa cai. Na programação, antes de escrever o código, nós pensamos no que precisa ser feito, quais ferramentas usar e como testar.

**Visão Profissional:** Engenheiros seniores não pulam direto para o código. O ciclo de vida do desenvolvimento de software (SDLC) existe para mitigar riscos. O fluxo mental é:
`Problema de Negócio → Levantamento de Requisitos → Design da Arquitetura → Escolha de Tecnologias → Implementação → Testes Automatizados → CI/CD/Deploy`.
Pular o design resulta em débito técnico severo e refatorações custosas no futuro.

---

## 3. Explicação da arquitetura atual

**Visão Iniciante:** O sistema é como um restaurante:
- O **Cliente** (Frontend/Navegador) é a pessoa fazendo o pedido.
- As **Rotas (Routes)** são o garçom anotando o pedido e a mesa.
- O **Controller** é o gerente do salão, conferindo se o pedido faz sentido (ex: "temos esse prato no menu?").
- O **Service** é o Chef de cozinha, ele faz a comida seguindo a receita (regras de negócio).
- O **Database** é a despensa, onde os ingredientes (dados) estão guardados.

**Visão Profissional:** O TicketFlow adota uma **Arquitetura em Camadas (Layered Architecture)**.
- **Routes:** Mapeia a interface HTTP (verbos/URLs) para as ações dos Controllers.
- **Controllers:** Camada de apresentação da API. Desacopla o payload HTTP e lida com requests, validações de I/O e formatação da response.
- **Services:** Onde reside a Lógica de Domínio. É agnóstico de infraestrutura HTTP.
- **Repositories:** Isola a Lógica de Persistência, encapsulando consultas SQL.
Essa separação obedece ao Princípio de Responsabilidade Única (Single Responsibility Principle - SRP) do SOLID.

---

## 4. Fluxo completo de uma requisição

Vamos mapear o que acontece no exato milissegundo em que um chamado é criado:

1. **Frontend envia HTTP Request:** Um JSON é enviado no corpo da requisição POST `/tickets`.
2. **API recebe (Node/Express):** O servidor web escuta na porta 3000 e intercepta a chamada.
3. **Route identifica:** O roteador vê que o verbo é POST para `/tickets` e manda para `ticketController.createTicket`.
4. **Controller valida:** O controller olha o JSON, valida se "titulo" e "descricao" existem. Se não existirem, lança um erro (400 Bad Request) antes mesmo de processar. Se tudo estiver certo, chama o `TicketService`.
5. **Service aplica regras:** O serviço gera um ID único (UUID), define a data de criação e adiciona o status padrão "Aberto". Feito isso, invoca o repositório.
6. **Banco salva (Repository):** O repositório monta a query `INSERT INTO tickets...` em SQL e manda pro SQLite.
7. **API retorna resposta:** A base de dados diz OK, o serviço retorna os dados criados para o controller, que envia de volta ao cliente um `201 Created` contendo o chamado.

---

## 5. Por que separar camadas?

**Visão Iniciante:** Por que não escrever tudo num arquivo só, chamado `index.js`? Porque se o arquivo tiver 5000 linhas, você vai demorar dias para achar onde alterar a validação do status. Separar o código em "gavetas" facilita arrumar o que quebra.

**Visão Profissional:**
- **Separação de Responsabilidades:** Cada módulo faz uma única coisa.
- **Manutenção:** Se a validação HTTP mudar, mexo no Controller, o Service continua intacto.
- **Testabilidade:** Consigo testar (Unit Tests) a regra de negócios (Service) injetando um banco de dados falso (Mock) no lugar do Repositório, sem precisar subir o servidor web.
- **Escalabilidade:** Se eu quiser que a criação de chamado seja feita por uma fila (RabbitMQ) em vez de HTTP, basta criar um consumidor de fila e apontar direto para o Service.

---

## 6. Decisões arquiteturais

Como engenheiros, tudo é sobre *Trade-offs* (perdas e ganhos):

1. **Node.js & Express**
   - *Problema:* Precisávamos de algo rápido para I/O assíncrono.
   - *Escolha:* Node.js.
   - *Consequência:* Desenvolvimento muito ágil em JavaScript, excelente ecossistema (NPM), porém, por ser single-threaded, não seria a melhor escolha se a API gerasse vídeos ou cálculos pesados de CPU.
2. **SQLite (Banco atual)**
   - *Problema:* Necessidade de persistência sem configuração complexa.
   - *Escolha:* SQLite (via SQL relacional).
   - *Consequência:* Ganha-se integridade SQL e paginação sem a dor de gerir contêineres e um servidor externo como no Postgres. No entanto, o SQLite local bloqueia em cenários de gravação de alta concorrência.
3. **Docker (Planejado)**
   - *Problema:* O clássico "na minha máquina funciona, no servidor não".
   - *Escolha:* Empacotar a aplicação em contêineres Docker.
   - *Consequência:* Facilita o deploy, exige aprendizado de rede e volumes dockerizados.
4. **Prisma ORM e PostgreSQL (Planejado para v2)**
   - *Problema:* Escrever SQL na mão é verboso e arriscado (SQL Injection se mal parametrizado). O SQLite também limita o ganho de escala horizontal.
   - *Escolha:* Usar Postgres hospedado (cloud) com Prisma.
   - *Consequência:* Migração de banco mais madura e deploy simplificado em provedores como AWS/Railway.

---

## 7. Como um engenheiro evolui esse sistema

Sistemas reais não nascem prontos e complexos. Eles evoluem. A jornada do TicketFlow segue exatamente essa premissa:

1. **API Simples com JSON:** Na V1, gravávamos em arquivos `.json` apenas para validar as Rotas e os Controllers.
2. **Banco Relacional (SQLite):** Na fase atual, introduzimos Repositórios e um banco real para garantir persistência robusta.
3. **Autenticação (V2):** Nem todo mundo pode apagar um chamado. Inseriremos JWT (Tokens) para identificar quem é quem.
4. **Autorização/RBAC (V2):** Usuários normais não podem atribuir chamados, Técnicos e Admins sim.
5. **Cloud (V3):** Colocaremos essa API para rodar em produção (Railway, AWS).
6. **Escala (V3):** Quando milhões de requisições baterem, adicionaremos Redis (Cache) ou quebraremos o sistema em microserviços.

---

## 8. Como explicar o projeto em uma entrevista

Se perguntarem sobre o seu projeto de portfólio, use o framework S.T.A.R (Situação, Tarefa, Ação, Resultado).

**Roteiro de resposta:**
*"Desenvolvi uma API REST para gerenciamento de chamados de Suporte (Help Desk). O problema que resolvi foi estruturar dados desorganizados através de endpoints HTTP padronizados.*
*A arquitetura escolhida foi em Camadas (Routes, Controllers, Services e Repositories). Utilizei Node.js com Express e SQLite para persistência.*
*O maior desafio que encontrei no meio do caminho foi garantir que o Controller não ficasse com regras de negócio, então implementei Injeção/Uso de Repositórios.*
*Como próximo passo, planejo adicionar autenticação JWT e migrar o banco de dados para PostgreSQL usando Docker, visando deploy em produção."*

---

## 9. Perguntas que um entrevistador faria (E como responder)

**P: Por que você separou Controller e Service?**
R: Para seguir o Single Responsibility Principle. O Controller deve apenas validar parâmetros HTTP e retornar o formato (JSON). O Service guarda as regras do negócio ("Posso fechar este chamado hoje?"). Se eu quiser rodar meu código via um script CLI amanhã e não via API Web, basta chamar o Service! Se tudo estivesse no Controller, eu ficaria acoplado ao objeto de requisição (req/res) do Express.

**P: Por que não colocou tudo em uma rota?**
R: Organização, escalabilidade de equipe (várias pessoas mexendo no mesmo arquivo causa conflitos de Git - Merge Conflicts) e testabilidade prejudicada.

**P: Como você migraria hoje para PostgreSQL?**
R: Como usei o Repository Pattern, a camada de Serviços não faz ideia de qual banco estou usando. Bastaria eu reescrever os métodos dentro do `ticketRepository.js` (ou criar um novo `pgTicketRepository.js`) instalando a biblioteca do Postgres (`pg`), e tudo continuaria funcionando, porque o contrato das funções continuaria o mesmo.

**P: Como faria o deploy da API?**
R: Eu criaria um `Dockerfile` da aplicação. Depois, faria o push dessa imagem para o Docker Hub (ou ECR na AWS), e a provisionaria via um serviço de hospedagem como Railway, Render, ou ECS, conectando a um banco Postgres gerenciado.

---

## 10. Glossário de conceitos

- **API REST (Representational State Transfer):** Um conjunto de regras para sistemas conversarem via internet usando JSON e URLs semânticas (ex: `GET /tickets`).
- **HTTP (Hypertext Transfer Protocol):** O protocolo de base para a troca de dados na Web. Utiliza métodos como GET (Buscar), POST (Criar), PUT (Atualizar) e DELETE (Excluir).
- **Middleware:** Uma função que fica no "meio" do caminho da requisição HTTP (ex: verificação de segurança) antes de chegar na Rota.
- **Controller:** Ponto de entrada do código da API. Ele controla o fluxo (entrada → resposta).
- **Service:** Onde a regra de negócio/coração da empresa vive.
- **Repository:** Onde estão os códigos que conversam exclusivamente com Bancos de Dados.
- **ORM (Object-Relational Mapping):** Ferramenta (como Prisma ou Sequelize) que converte tabelas de banco de dados em objetos de programação.
- **Banco Relacional (SQL):** Bancos organizados em tabelas que se relacionam. Ex: SQLite, PostgreSQL, MySQL.
- **JWT (JSON Web Token):** Um token criptografado para garantir que a pessoa acessando a API é quem diz ser (Autenticação).
- **CI/CD:** Continuous Integration (Testes automatizados a cada commit) e Continuous Deployment (Código vai direto pra produção de forma segura).
- **Cloud:** Servidores alugados sob demanda pela internet (AWS, Azure, Google Cloud).
