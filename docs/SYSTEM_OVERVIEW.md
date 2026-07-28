# Visão Geral do Sistema (System Overview)

## O que é o TicketFlow?

**Visão para Iniciantes:**
Imagine que o seu computador da empresa quebrou e você precisa avisar a TI. Em vez de mandar um e-mail que pode se perder ou enviar um WhatsApp e ser esquecido, você usa um sistema para registrar o pedido e acompanhar. O TicketFlow é a central telefônica inteligente que anota, organiza e distribui os pedidos de socorro!

**Visão para Engenheiros:**
O TicketFlow é uma API RESTful (Interface de Programação de Aplicações) desenvolvida em Node.js. Seu propósito é centralizar a criação, leitura, atualização e exclusão (CRUD) de tickets de suporte técnico. Ele padroniza a comunicação entre clientes (Frontends SPA, Mobile Apps) e a camada de persistência.

## Qual problema ele resolve?
Ele resolve o problema de comunicação descentralizada e não padronizada em suporte de TI, centralizando os incidentes em um sistema com metadados estruturados (categoria, prioridade, status, data de criação e UUIDs).

## Quem são os usuários?
*   **Funcionários/Colaboradores:** Consumidores do serviço que precisam relatar incidentes ou requisitar hardware/software.
*   **Técnicos de Suporte (Helpdesk):** Equipe que atua ativamente na triagem, priorização e resolução técnica, consumindo os tickets abertos e atualizando seus status.

## Objetivo da Aplicação
Prover um conjunto de endpoints HTTP confiáveis, rápidos e padronizados para garantir que nenhuma solicitação técnica seja perdida, fornecendo suporte assíncrono para os times da empresa.

## Funcionalidades Atuais
*   **Criar Ticket:** Permite abrir um novo chamado com título, descrição, categoria (Hardware, Software, etc.) e prioridade. O sistema define ID e status inicial automaticamente.
*   **Listar Tickets:** Recupera chamados de forma filtrável e com paginação.
*   **Buscar Detalhe do Ticket:** Recupera um único chamado usando seu identificador único.
*   **Atualizar Chamado Completo:** Permite correções de título, descrição e categorias.
*   **Atualizar Status Atômico (PATCH):** Fluxo isolado exclusivo para mover o chamado entre as etapas do ciclo de vida (Aberto -> Em Andamento -> Resolvido).
*   **Excluir Chamado:** Remove fisicamente o chamado da base de dados.

## Requisitos
### Funcionais (O que o sistema TEM que fazer)
*   O sistema deve permitir a criação de um ticket com ID único gerado.
*   O sistema deve retornar erro 400 (Bad Request) se a categoria ou prioridade não existirem na lista de valores permitidos.
*   O sistema deve permitir filtrar a lista de chamados por `status`, `prioridade` e `categoria`.
*   O sistema deve paginar a lista de chamados (trazendo lotes definidos, ex: 10 por página).

### Não Funcionais (Como o sistema DEVE ser)
*   A API deve responder em formato JSON (padrão REST).
*   O sistema deve ser tolerante a erros sintáticos, retornando formatado ao invés de derrubar o servidor.
*   O acesso entre domínios (Frontend e Backend isolados) deve ser garantido via CORS.
*   (Limitação atual) O banco de dados deve ser persistido através da serialização no File System local (`chamados.json`).