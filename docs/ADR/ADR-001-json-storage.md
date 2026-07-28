# ADR 001: Uso de JSON como persistência

**Data:** Julho de 2026
**Status:** Aceito e Ativo (para a V1 Educacional)

## Contexto
O projeto TicketFlow precisava de uma base de armazenamento persistente que fosse amigável para iniciantes. A complexidade de instalar, provisionar e entender credenciais de bancos de dados como MongoDB ou PostgreSQL limitaria a acessibilidade a usuários tentando rodar ou entender o software pela primeira vez. O foco atual do projeto era apenas as lógicas HTTP e manipulação JavaScript.

## Decisão
Foi decidido usar o sistema de arquivos nativo do Node.js (módulo `fs.promises`) para gravar inteiramente o estado da aplicação em um arquivo `src/data/chamados.json` a cada evento POST, PUT, DELETE, etc.

## Alternativas Consideradas
1.  **SQLite (via TypeORM ou Sequelize):** Foi descartado nesta primeira iteração devido à necessidade de introduzir SQL, drivers adicionais em C++ que podiam quebrar em certas plataformas, e configurações adicionais que tiravam a atenção do aprendizado puro do Express.
2.  **Banco em Memória (Arrays Globais apenas):** Descartado porque todo o registro era apagado ao cancelar e reiniciar o servidor, inviabilizando testes com Front-End em dias diferentes.

## Consequências
*   **Positivas:** Sem dependências externas. Para fazer um backup ou inspecionar o banco visualmente com VS Code, o estudante apenas olha o texto.
*   **Negativas (Problemas de Engenharia Grave):** É impossível manter integridade atômica ou lidar com *Race Conditions* (Concorrência). Desempenho decairá consideravelmente (I/O bloqueante lendo e transformando strings com JSON.parse) se o arquivo bater a marca de 10 megabytes. Impede que a aplicação sofra "Scale out" em balanceadores de carga.