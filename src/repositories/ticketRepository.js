const { getConnection } = require('../config/db');

async function getAllTickets(filters = {}) {
  const db = await getConnection();
  let query = 'SELECT * FROM tickets WHERE 1=1';
  const params = [];

  if (filters.status) {
    query += ' AND status = ?';
    params.push(filters.status);
  }
  if (filters.categoria) {
    query += ' AND categoria = ?';
    params.push(filters.categoria);
  }
  if (filters.prioridade) {
    query += ' AND prioridade = ?';
    params.push(filters.prioridade);
  }

  // Contar total para paginação
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
  const { count } = await db.get(countQuery, params);

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const data = await db.all(query, params);

  return {
    data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit) || 1,
    },
  };
}

async function getTicketById(id) {
  const db = await getConnection();
  const ticket = await db.get('SELECT * FROM tickets WHERE id = ?', [id]);
  return ticket;
}

async function createTicket(ticket) {
  const db = await getConnection();
  await db.run(
    `INSERT INTO tickets (id, titulo, descricao, categoria, prioridade, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      ticket.id,
      ticket.titulo,
      ticket.descricao,
      ticket.categoria,
      ticket.prioridade,
      ticket.status,
      ticket.createdAt
    ]
  );
  return ticket;
}

async function updateTicket(id, ticket) {
  const db = await getConnection();
  await db.run(
    `UPDATE tickets
     SET titulo = ?, descricao = ?, categoria = ?, prioridade = ?, status = ?
     WHERE id = ?`,
    [
      ticket.titulo,
      ticket.descricao,
      ticket.categoria,
      ticket.prioridade,
      ticket.status,
      id
    ]
  );
  return ticket;
}

async function updateStatus(id, status) {
  const db = await getConnection();
  await db.run('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
}

async function deleteTicket(id) {
  const db = await getConnection();
  await db.run('DELETE FROM tickets WHERE id = ?', [id]);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateStatus,
  deleteTicket
};
