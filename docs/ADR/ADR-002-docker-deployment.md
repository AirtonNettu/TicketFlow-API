# ADR 002: Uso de Docker para Deploy em detrimento a plataformas Serverless (Vercel)

**Data:** Julho de 2026
**Status:** Aceito

## Contexto
Com a finalização das lógicas primárias da V1 da API TicketFlow, surgiu a necessidade de prepará-la para publicação (deployment) externa, permitindo que as requisições fluam livremente a partir de um SPA hospedado, por exemplo, no Netlify.

## Decisão
Criar um arquivo `Dockerfile` focado na imagem `node:18-alpine` com permissões de usuário e mapeamento de volumes persistentes (Persistent Disks) para implantar a aplicação na AWS, Render ou Railway, garantindo as permissões em `src/data`.

## Alternativas Consideradas
1.  **Deploy em Plataformas Serverless de Interface (Vercel.json):** Foi uma tentativa frustrada inicial.
    A Vercel executa código usando *AWS Lambda*. Estas arquiteturas fornecem ambientes de contêineres efervescentes e totalmente "Somente Leitura" (*Read-Only File System*). Tentativas de salvar o `chamados.json` causariam o erro HTTP 500 "EROFS".

## Consequências
*   **Positivas:** Ao empacotar num Container Docker real e autônomo, amarramos a dependência do arquivo JSON físico (`chamados.json`) com sucesso, impedindo "crash" em provedores que reiniciam máquinas do nada. O app rodará igualmente em Windows, Mac, Ubuntu ou no Render.
*   **Negativas:** Para a V1, é exigido um esforço um pouco maior de DevOps por parte de quem vai implantar, mapeando as pastas (Volumes) adequadamente para garantir que a nuvem não apague o arquivo .json durante a reciclagem (restart) de rotina do provedor de serviço.