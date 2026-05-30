/*
  ══════════════════════════════════════════════════════
  APP.JS — Lógica do frontend do TicketFlow
  
  Este arquivo é responsável por:
  1. Buscar tickets da API (fetchTickets)
  2. Atualizar os cards de estatísticas (updateStats)
  3. Renderizar a lista de chamados (renderTickets)
  4. Criar novos chamados via formulário (createTicket)
  5. Reagir a eventos do usuário (submit, click)
  ══════════════════════════════════════════════════════
*/
 
 
/*
  ──────────────────────────────────────────────────────
  fetchTickets()
  
  Busca todos os tickets da API usando fetch (requisição HTTP assíncrona).
  fetch é nativo do navegador — não precisa de biblioteca externa.
  
  async/await: forma moderna de lidar com operações assíncronas.
  Sem isso precisaríamos usar .then().catch() que é mais difícil de ler.
  ──────────────────────────────────────────────────────
*/
async function fetchTickets() {
  const res = await fetch('/tickets');
  /*
    fetch('/tickets'): faz um GET para http://localhost:3000/tickets
    O caminho relativo '/tickets' funciona porque o frontend está
    servido pelo mesmo servidor Node.js na porta 3000.
    
    await: pausa a função aqui até a resposta chegar.
    Sem await, res seria uma Promise não resolvida (objeto vazio).
  */
 
  if (!res.ok) return [];
  /*
    res.ok: true se o status HTTP for 200-299 (sucesso).
    Se der erro (404, 500...), retornamos array vazio para não quebrar a UI.
  */
 
  return res.json();
  /*
    res.json(): converte o texto JSON da resposta em objeto JavaScript.
    Também é assíncrono — retornamos a Promise direto (o chamador usa await).
  */
}
 
 
/*
  ──────────────────────────────────────────────────────
  prioridadeClass(p)
  
  Recebe uma string de prioridade e retorna a classe CSS correta.
  Centraliza a lógica de cores — se mudar uma cor, muda em um só lugar.
  ──────────────────────────────────────────────────────
*/
function prioridadeClass(p) {
  if (p === 'Alta')  return 'badge-alta';
  if (p === 'Média') return 'badge-media';
  return 'badge-baixa'; /* fallback para 'Baixa' ou qualquer outro valor */
}
 
 
/*
  ──────────────────────────────────────────────────────
  statusClass(s)
  
  Mesma ideia da prioridadeClass, mas para o status do ticket.
  Retorna a classe CSS correspondente à cor do status.
  ──────────────────────────────────────────────────────
*/
function statusClass(s) {
  if (s === 'Aberto')       return 'badge-aberto';
  if (s === 'Em andamento') return 'badge-andamento';
  if (s === 'Resolvido')    return 'badge-resolvido';
  return 'badge-fechado'; /* fallback para 'Fechado' */
}
 
 
/*
  ──────────────────────────────────────────────────────
  updateStats(tickets)
  
  Recebe o array de tickets e atualiza os números nos cards de métricas.
  
  Técnica: filter() conta quantos tickets satisfazem uma condição.
  Ex: tickets.filter(t => t.status === 'Aberto') retorna apenas os abertos.
  .length pega o tamanho desse array filtrado = contagem.
  ──────────────────────────────────────────────────────
*/
function updateStats(tickets) {
  /* Conta por STATUS */
  document.getElementById('stat-abertos').textContent =
    tickets.filter(t => t.status === 'Aberto').length;
  /*
    getElementById: busca o elemento HTML pelo id.
    .textContent: altera o texto visível do elemento.
    Isso atualiza o número grande nos cards de stat sem recarregar a página.
  */
 
  document.getElementById('stat-andamento').textContent =
    tickets.filter(t => t.status === 'Em andamento').length;
 
  document.getElementById('stat-fechados').textContent =
    tickets.filter(t => t.status === 'Fechado').length;
 
  /* Conta por PRIORIDADE */
  document.getElementById('stat-alta').textContent =
    tickets.filter(t => t.prioridade === 'Alta').length;
 
  document.getElementById('stat-media').textContent =
    tickets.filter(t => t.prioridade === 'Média').length;
 
  document.getElementById('stat-baixa').textContent =
    tickets.filter(t => t.prioridade === 'Baixa').length;
}
 
 
/*
  ──────────────────────────────────────────────────────
  renderTickets(list)
  
  Recebe o array de tickets e injeta o HTML na página.
  
  Técnica: Template Literals (crase `) permitem escrever HTML
  com variáveis JS dentro usando ${expressão}.
  .map() transforma cada ticket em uma string HTML.
  .join('') junta todas as strings em uma só (sem separador).
  ──────────────────────────────────────────────────────
*/
function renderTickets(list) {
  const container = document.getElementById('tickets');
  /* container: referência ao <div id="tickets"> do HTML */
 
  const count = document.getElementById('tickets-count');
  /* count: referência ao <p id="tickets-count"> no cabeçalho da seção */
 
  /* Atualiza o contador de chamados */
  count.textContent = `${list.length} chamado${list.length !== 1 ? 's' : ''} registrado${list.length !== 1 ? 's' : ''}`;
  /*
    Operador ternário: condição ? valor_se_true : valor_se_false
    list.length !== 1 ? 's' : '' → adiciona 's' no plural
    Resultado: "1 chamado registrado" ou "3 chamados registrados"
  */
 
  /* Estado vazio: sem chamados */
  if (!list.length) {
    container.innerHTML = '<div class="empty">Nenhum chamado registrado.</div>';
    return; /* para a função aqui */
  }
 
  /*
    .slice(): cria uma cópia do array (não modifica o original).
    .reverse(): inverte a ordem (mais recente primeiro).
    Fazemos slice() antes de reverse() para não alterar a ordem do array original
    que updateStats() ainda pode precisar.
  */
  const html = list.slice().reverse().map(t => {
    /*
      Formata a data: converte ISO string em formato legível em português.
      Ex: "2026-05-30T07:58:27.000Z" → "30 de mai., 07:58"
    */
    const data = new Date(t.createdAt).toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
 
    /*
      Template Literal: monta o HTML de cada ticket como string.
      Cada ticket vira um .ticket-item com suas informações.
      As classes de badge são definidas pelas funções prioridadeClass() e statusClass().
    */
    return `
      <div class="ticket-item">
        <div class="ticket-head">
          <div class="ticket-titulo">${t.titulo}</div>
          <span class="badge ${prioridadeClass(t.prioridade)}">${t.prioridade.toUpperCase()}</span>
        </div>
        <div class="ticket-meta">${t.categoria}</div>
        <div class="ticket-desc">${t.descricao}</div>
        <div class="ticket-footer">
          <span class="badge badge-cat">${t.categoria}</span>
          <span class="badge ${statusClass(t.status)}">${t.status}</span>
          <span class="ticket-date">${data}</span>
        </div>
      </div>
    `;
  }).join('');
  /* .join(''): une todos os HTMLs em uma só string sem separador */
 
  container.innerHTML = html;
  /*
    innerHTML: substitui o conteúdo do container pelo HTML gerado.
    Toda a lista é re-renderizada a cada chamada de renderTickets().
    Simples e eficiente para o volume de dados deste projeto.
  */
}
 
 
/*
  ──────────────────────────────────────────────────────
  load()
  
  Função principal: busca os tickets e atualiza a UI.
  Chamada ao carregar a página e após criar/atualizar tickets.
  ──────────────────────────────────────────────────────
*/
async function load() {
  const tickets = await fetchTickets(); /* aguarda os dados da API */
  updateStats(tickets);   /* atualiza os cards de métricas */
  renderTickets(tickets); /* atualiza a lista de chamados */
}
 
 
/*
  ──────────────────────────────────────────────────────
  createTicket(formData)
  
  Envia um novo ticket para a API via POST.
  
  fetch com método POST envia dados para o servidor.
  O corpo da requisição (body) é o ticket em formato JSON.
  ──────────────────────────────────────────────────────
*/
async function createTicket(formData) {
  const payload = Object.fromEntries(formData);
  /*
    FormData: objeto que o navegador cria a partir de um <form>.
    Object.fromEntries(): converte FormData em objeto JavaScript simples.
    Ex: { titulo: "PC não liga", categoria: "Hardware", prioridade: "Alta", descricao: "..." }
  */
 
  const res = await fetch('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    /*
      Content-Type: avisa a API que o body está em formato JSON.
      Sem esse header, o Express não consegue parsear o body corretamente.
    */
    body: JSON.stringify(payload),
    /*
      JSON.stringify(): converte o objeto JS em string JSON.
      Ex: { titulo: "PC" } → '{"titulo":"PC"}'
      O fetch envia essa string para o servidor.
    */
  });
 
  /* Trata erro da API */
  if (!res.ok) {
    const err = await res.json(); /* pega a mensagem de erro do servidor */
    alert('Erro: ' + (err.error || 'Erro desconhecido'));
    return null;
  }
 
  return res.json(); /* retorna o ticket criado (com id e createdAt gerados pelo servidor) */
}
 
 
/* ══════════════════════════════════════════════════════
   EVENT LISTENERS — Reações a ações do usuário
   
   addEventListener: "escuta" eventos e executa uma função quando ocorrem.
   Os eventos só são registrados após o DOM estar carregado (script no final do body).
   ══════════════════════════════════════════════════════ */
 
/*
  EVENTO: submit do formulário de criação
  Disparado quando o usuário clica em "Criar chamado" ou aperta Enter.
*/
document.getElementById('create-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  /*
    preventDefault(): cancela o comportamento padrão do submit.
    Sem isso, o navegador recarregaria a página ao enviar o formulário
    (comportamento padrão de formulários HTML).
    Com isso, o controle fica 100% no nosso JavaScript.
  */
 
  const form = ev.target; /* ev.target = o elemento que disparou o evento (o <form>) */
  const btn = form.querySelector('button[type="submit"]');
  /*
    querySelector: busca o botão de submit dentro do formulário.
    Seletor CSS 'button[type="submit"]' = botão com atributo type="submit".
  */
 
  /* Feedback visual: desabilita o botão durante o envio */
  btn.disabled = true;
  btn.textContent = 'Criando...';
  /*
    Evita duplo clique acidental que criaria tickets duplicados.
    Também dá feedback ao usuário de que algo está acontecendo.
  */
 
  await createTicket(new FormData(form));
  /* new FormData(form): coleta automaticamente todos os campos do formulário */
 
  form.reset();
  /* reset(): limpa todos os campos do formulário após enviar */
 
  /* Restaura o botão ao estado original */
  btn.disabled = false;
  btn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Criar chamado
  `;
  /*
    innerHTML (diferente de textContent): permite inserir HTML, não só texto.
    Necessário aqui porque precisamos do SVG do ícone junto com o texto.
  */
 
  load(); /* recarrega a lista para mostrar o novo ticket */
});
 
 
/*
  EVENTO: clique no botão "Atualizar lista"
  Simplesmente chama load() para buscar os dados frescos da API.
*/
document.getElementById('refresh').addEventListener('click', load);
 
 
/*
  EVENTO: carregamento da página
  'load' dispara quando TUDO foi carregado (HTML, CSS, imagens, scripts).
  Diferente de 'DOMContentLoaded' que dispara quando só o HTML está pronto.
  
  Chamamos load() aqui para preencher a lista e os stats automaticamente
  assim que o usuário abre a página.
*/
window.addEventListener('load', load);