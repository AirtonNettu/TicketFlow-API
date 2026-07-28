# Guia de Desenvolvimento (Development Guide)

Como ingressante no projeto TicketFlow, este guia orientará você sobre como expandir e manter o sistema de forma limpa, seguindo a arquitetura proposta.

## Como Adicionar uma Nova Funcionalidade

Para evitar a desorganização de código (arquivos gigantes), toda nova funcionalidade deve ser quebrada em etapas por camadas.

### Exemplo: Adicionar "Comentários Técnicos" aos Chamados
Você deseja que o Front-end possa submeter atualizações textuais contínuas sobre um chamado sem precisar editar a descrição original inteira.

**Passo a Passo Prático:**

1.  **Definir a Rota (Router):**
    *   No arquivo `ticketRoutes.js`, registre a URI lógica e semântica:
        `router.post('/:id/comments', ticketController.addComment);`
2.  **Criar o Controller:**
    *   No `ticketController.js`, crie o método `async function addComment(req, res, next)`.
    *   Extraia o ID do Ticket `req.params.id` e o texto do `req.body.text`.
    *   Valide (verifique se "text" não está vazio). Se estiver, dispare um Erro 400.
3.  **Criar Regra de Negócio (Service):**
    *   No `ticketService.js`, crie o método responsável por processar a alteração.
    *   Adicione o campo `comentarios` (Array vazia) na estrutura original do Ticket, caso não exista.
    *   Encontre o Ticket pelo ID, crie um novo objeto de comentário (com UUID, Data e Texto), e faça push (`ticket.comentarios.push(...)`).
4.  **Alterar Persistência (Service/Storage):**
    *   Use o método auxiliar para sobre-escrever o arquivo JSON.
5.  **Testar Manualmente ou via Automação:**
    *   Dispare as requisições no Insomnia/Postman simulando fluxos normais e também enviando parâmetros errados (para atestar se os Middlewares caçam os erros).
6.  **Atualizar Documentação:**
    *   Sempre adicione o novo caminho nas ferramentas de visualização, em arquivos README.md ou nas especificações (OpenAPI).

## Como Alterar Arquitetura e Decisões de Base

Mudar o projeto em nível estrutural (exemplo: trocar Express por Fastify, ou mover de Node para TypeScript) exige planejamento focado.

**Onde fazer mudanças e Cuidados:**
*   **Rotas e Controllers:** Se trocar de framework web, apenas estes arquivos e os Middlewares serão descartados. Cuide para que a API (Assinatura das funções de entrada) não mude bruscamente para não quebrar o Frontend do usuário.
*   **Services:** Proteja este arquivo. Ele possui as lógicas da empresa, e elas nunca devem depender das bibliotecas que você baixou no npm. Desacoplar a base de dados desta camada é prioridade.