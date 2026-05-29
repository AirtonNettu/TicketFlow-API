async function fetchTickets() {
  const res = await fetch('/tickets');
  if (!res.ok) return [];
  return res.json();
}

function renderTickets(list) {
  const container = document.getElementById('tickets');
  if (!list.length) {
    container.innerHTML = '<p>Nenhum chamado registrado.</p>';
    return;
  }

  const html = list.map(t => `
    <div class="ticket">
      <div class="head"><strong>${t.titulo}</strong> <span class="badge">${t.prioridade}</span></div>
      <div class="meta">${t.categoria} • ${new Date(t.createdAt).toLocaleString()}</div>
      <p>${t.descricao}</p>
      <div class="status">Status: <strong>${t.status}</strong></div>
    </div>
  `).join('');

  container.innerHTML = html;
}

async function load() {
  const tickets = await fetchTickets();
  renderTickets(tickets);
}

async function createTicket(formData) {
  const payload = Object.fromEntries(formData);
  const res = await fetch('/tickets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    alert('Erro: ' + (err.error || 'unknown'));
    return null;
  }

  return res.json();
}

document.getElementById('create-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const form = ev.target;
  const data = new FormData(form);
  await createTicket(data);
  form.reset();
  load();
});

document.getElementById('refresh').addEventListener('click', load);

window.addEventListener('load', load);
