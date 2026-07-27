# Documentação do Código (Code Guide)

Esta documentação mapeia a estrutura da aplicação e como cada pasta interage para manter o sistema em pé.

**Dica para quem programa em Python/FastAPI:** Pense no Express como o FastAPI, onde o `server.js` é o `main.py`, as rotas são os `APIRouters` e os Controllers são as funções dos seus endpoints (decoradas com `@app.get`).

## Estrutura de Pastas

```text
src/
 ├── server.js              # Inicializador da API
 ├── routes/                # Mapeamento de URLs
 ├── controllers/           # Gerenciadores de fluxo HTTP
 ├── services/              # Regras de Negócio e Dados
 ├── middlewares/           # Funções interceptadoras
 ├── utils/                 # Ferramentas auxiliares
 └── data/                  # "Banco de dados"
```

---

### `src/` (Diretório Raiz)
*   **Responsabilidade:** Conter todo o código da aplicação.
*   **Como Funciona:** Separa o código-fonte da aplicação dos arquivos de configuração (Docker, `.env`, `package.json`) presentes na raiz do projeto.
*   **Como modificar futuramente:** Mantenha essa pasta estritamente focada em lógica de código TypeScript/JavaScript.

### `src/server.js`
*   **Responsabilidade:** Ponto de Entrada (Entrypoint). É o arquivo principal que o Node roda.
*   **Como Funciona:** Inicializa o framework Express, liga as ferramentas globais (CORS, express.json) e diz em qual porta (ex: 3000) o servidor deve escutar. Em FastAPI, seria o local onde se roda o Uvicorn.
*   **Como modificar futuramente:** É aqui que se adiciona pacotes globais como Helmet (segurança) ou bibliotecas de log (Winston/Pino) e registro de novos *routers*.

### `src/routes/`
*   **Responsabilidade:** Definir o mapeamento de Endpoints (URIs).
*   **Como Funciona:** Associa um verbo (GET/POST) e um caminho HTTP (ex: `/`) a um Controlador específico. É o "mapa da cidade". Não há validações nem banco de dados aqui.
*   **Como modificar futuramente:** Se for criado um módulo de Usuários, crie `userRoutes.js` e acople no `server.js`.

### `src/controllers/`
*   **Responsabilidade:** Validação de Entrada/Saída HTTP.
*   **Como Funciona:** (Analogia: É o caixa de um restaurante). Extrai os parâmetros (`req.body`, `req.query`), verifica regras estruturais básicas, aciona o Service para preparar o "prato" e retorna o resultado ao cliente usando HTTP Status (200, 201, 404).
*   **Como modificar futuramente:** Deve permanecer puramente dependente de frameworks HTTP. Se a lógica começar a ficar longa (ex: cálculos, geração de senhas), mova-a para o Service!

### `src/services/`
*   **Responsabilidade:** Centralizar a Regra de Negócios (Core Logic) e o acesso ao armazenamento.
*   **Como Funciona:** (Analogia: É o Cozinheiro). Só é chamado quando os dados já são válidos. Define comportamentos dinâmicos (injetar um UUID V4, forçar status 'Aberto', manipular o array de tickets). **Atenção:** Na arquitetura V1, o serviço também é quem salva o arquivo no HD (com `fs`).
*   **Como modificar futuramente (Migração Crítica):** No V2, a parte que manipula o `fs` deve ser extraída para a pasta `/repositories/`. O Service chamará o Repository em vez do disco rígido local.

### `src/middlewares/`
*   **Responsabilidade:** Interceptar chamadas (Cross-Cutting Concerns).
*   **Como Funciona:** Funções que se metem no meio do fluxo Requisição -> Resposta. No arquivo atual (`errorHandler.js`), se um Controller jogar um Erro (`throw`), o middleware captura a queda e formata uma saída bonita JSON `{"error": ...}` sem deixar o terminal do servidor dar "crash".
*   **Como modificar futuramente:** Usado para criar um `authMiddleware.js` que verifica tokens JWT e bloqueia usuários que não estiverem logados.

### `src/utils/`
*   **Responsabilidade:** Ferramentas, constantes globais e funções utilitárias que não dependem do framework.
*   **Como Funciona:** Arquivos puros JavaScript. O `validation.js` isola os dicionários de Status e Prioridades e possui lógicas condicional (`if/else`) para garantir a consistência das palavras antes de irem pro banco.
*   **Como modificar futuramente:** Ao introduzir bibliotecas tipadas (Joi, Zod ou Pydantic se migrar para Python), esse arquivo de validações baseadas em "if" é deletado em favor dos Schemas visuais.

### `src/data/`
*   **Responsabilidade:** Armazenamento Persistente Simples.
*   **Como Funciona:** Contém o arquivo `chamados.json`. Toda vez que ocorre uma mudança, o Node substitui o conteúdo desse texto por completo.
*   **Como modificar futuramente:** Essa pasta inteira deve ser descartada quando a aplicação evoluir e plugar um banco de dados relacional oficial (PostgreSQL via Prisma).