# Checklist de Segurança do TicketFlow

Este arquivo serve como lembrete de segurança para a evolucao do projeto. A v1 usa JavaScript, Express e arquivo JSON, mas alguns riscos ficam mais importantes quando o projeto ganhar banco de dados, login, upload de arquivos e permissoes por usuario.

## Medidas praticas de protecao

Seguranca em aplicacoes web deve ser tratada como um processo continuo. Cada nova feature precisa ser pensada considerando validacao de entrada, autenticacao, autorizacao, tratamento de erros e exposicao de dados.

Cuidados gerais:

- Validar e sanitizar entradas recebidas do usuario.
- Nunca confiar em dados vindos do frontend.
- Rejeitar entradas suspeitas ou fora do formato esperado.
- Usar autenticacao para rotas privadas.
- Usar autorizacao para controlar o que cada perfil pode acessar.
- Manter dependencias atualizadas.
- Realizar testes de seguranca periodicos.
- Revisar configuracoes antes de publicar em producao.

Na v1 do TicketFlow:

- Manter validacao de titulo, descricao, categoria, prioridade e status.
- Evitar expor detalhes internos em respostas de erro.
- Corrigir pontos que possam permitir XSS no frontend.
- Documentar riscos que serao tratados na v2.

Na v2 do TicketFlow:

- Adicionar login com senha criptografada.
- Adicionar perfis de usuario: `usuario`, `tecnico`, `admin`.
- Proteger rotas com token de acesso.
- Usar refresh token, se o fluxo de autenticacao exigir sessoes mais longas.
- Usar banco de dados com ORM ou queries parametrizadas.
- Adicionar regras claras de permissao no backend.
- Adicionar protecoes contra forca bruta no login.

## 1. SQL Injection

Ocorre quando dados enviados pelo usuario sao misturados diretamente em comandos SQL.

Cuidados:

- Nunca montar queries SQL concatenando texto vindo do usuario.
- Usar queries parametrizadas ou ORM seguro, como Prisma.
- Validar os dados recebidos antes de consultar o banco.
- Nao confiar em campos como `id`, `email`, `role`, `status` ou filtros vindos do front.
- Separar os valores enviados pelo usuario do comando SQL.
- Tratar qualquer entrada como potencialmente perigosa ate ser validada.

Exemplo perigoso:

```js
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

Exemplo mais seguro:

```js
const user = await prisma.user.findUnique({
  where: { email }
});
```

## 2. Cross-Site Scripting (XSS)

Ocorre quando um atacante consegue inserir JavaScript malicioso em uma pagina.

Cuidados:

- Nao renderizar HTML vindo do usuario sem tratamento.
- Evitar `innerHTML` com dados digitados pelo usuario.
- Preferir `textContent` quando for exibir texto.
- Sanitizar dados quando for realmente necessario renderizar HTML.
- Validar titulo, descricao e comentarios de chamados.
- Escapar caracteres especiais de HTML ao exibir dados fornecidos pelo usuario.
- Considerar Content Security Policy (CSP) em producao.
- Definir de quais origens scripts, estilos e imagens podem ser carregados.

Ponto de atencao na v1:

- O frontend atual renderiza chamados usando `innerHTML`. Em uma versao mais segura, os dados do usuario devem ser escapados ou renderizados com DOM APIs.

## 3. Cross-Site Request Forgery (CSRF)

Ocorre quando outro site induz o navegador do usuario logado a executar uma acao sem consentimento.

Cuidados:

- Se usar cookies de sessao, configurar `SameSite`, `HttpOnly` e `Secure`.
- Usar tokens CSRF em formularios sensiveis.
- Conferir origem da requisicao quando necessario.
- Para APIs com JWT em `Authorization` header, o risco costuma ser menor que com cookies automaticos.
- Exigir autenticacao para acoes sensiveis.
- Validar no servidor se a requisicao realmente pertence ao usuario autenticado.

## 4. Autenticacao Fraca

Ocorre quando o sistema aceita credenciais fracas ou protege mal as senhas.

Cuidados:

- Nunca salvar senha em texto puro.
- Usar hash forte com `bcrypt` ou `argon2`.
- Exigir senha minima razoavel.
- Exigir senha com combinacao de letras maiusculas, minusculas, numeros e simbolos, se fizer sentido para o produto.
- Criar fluxo de login com token seguro.
- Nao retornar senha, hash ou dados sensiveis na API.
- Implementar bloqueio ou limite de tentativas em login futuramente.
- Bloquear temporariamente ou limitar tentativas apos varios logins malsucedidos.

## 5. Server-Side Code Injection

Ocorre quando entrada do usuario e executada como codigo no servidor.

Cuidados:

- Nunca usar `eval`, `new Function` ou execucao dinamica com dados do usuario.
- Nao passar input do usuario diretamente para comandos de terminal.
- Validar e limitar qualquer campo usado em operacoes internas.

## 6. Configuracoes Incorretas de Seguranca

Ocorre quando ambiente, permissoes ou configuracoes deixam o sistema exposto.

Cuidados:

- Guardar segredos em variaveis de ambiente, nunca no GitHub.
- Manter `.env` no `.gitignore`.
- Configurar CORS apenas para origens confiaveis em producao.
- Usar HTTPS em producao.
- Manter dependencias atualizadas.
- Nao expor mensagens internas de erro para usuarios finais.

## 7. Componentes de Terceiros Nao Confiaveis

Ocorre quando bibliotecas inseguras ou desconhecidas introduzem vulnerabilidades.

Cuidados:

- Instalar apenas pacotes conhecidos e necessarios.
- Verificar manutencao, downloads e reputacao do pacote.
- Rodar auditoria de dependencias periodicamente.
- Remover bibliotecas que nao estao sendo usadas.

Comandos uteis:

```bash
npm audit
npm outdated
```

## 8. Controle de Acesso Insuficiente

Ocorre quando um usuario acessa dados ou acoes que nao deveria.

Cuidados:

- Separar permissoes por perfil: `usuario`, `tecnico`, `admin`.
- Usuario comum deve ver apenas os proprios chamados.
- Tecnico deve alterar apenas chamados permitidos.
- Admin pode gerenciar usuarios, tecnicos e chamados.
- Validar permissao no backend, nunca apenas no frontend.
- Nao confiar em `role` enviado pelo navegador.

## 9. Vulnerabilidades de File Upload

Ocorrem quando arquivos enviados pelo usuario nao sao verificados corretamente.

Cuidados:

- Validar tipo, tamanho e extensao do arquivo.
- Impor limite maximo de tamanho.
- Nao permitir upload de arquivos executaveis.
- Renomear arquivos no servidor.
- Salvar uploads fora da pasta publica quando possivel.
- Verificar MIME type e conteudo do arquivo.
- Usar servico externo seguro para arquivos em producao, se necessario.

## 10. Falhas de Seguranca na API

Ocorrem quando endpoints expõem dados sensiveis ou permitem acoes indevidas.

Cuidados:

- Validar todos os bodies, params e query strings.
- Retornar apenas dados necessarios.
- Usar status HTTP corretos.
- Proteger rotas privadas com autenticacao.
- Proteger rotas por permissao.
- Usar access token para acessar recursos protegidos.
- Usar refresh token quando for necessario renovar sessao sem novo login.
- Implementar rate limit em rotas sensiveis, como login.
- Registrar logs de erros e eventos importantes.

## Checklist rapido antes de criar uma feature

- O dado vem do usuario? Validar.
- O dado sera exibido na tela? Evitar XSS.
- A rota altera dados? Exigir permissao.
- A rota e privada? Exigir autenticacao.
- Tem senha ou token? Nunca expor.
- Tem banco de dados? Usar query segura.
- Tem upload? Validar arquivo.
- Tem pacote novo? Verificar confiabilidade.
- Tem erro? Nao revelar detalhes internos em producao.

## Prioridade para a v2

Quando o TicketFlow migrar para TypeScript, banco de dados e login, priorizar:

1. Autenticacao com senha hash.
2. Autorizacao por perfil.
3. Validacao forte dos dados.
4. Protecao contra XSS no frontend.
5. Uso seguro do banco com ORM ou queries parametrizadas.
6. Variaveis de ambiente e configuracao de producao.
