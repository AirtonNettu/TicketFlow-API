const { getConnection } = require('../config/db');

async function migrate() {
  let db;
  try {
    db = await getConnection();
    console.log('Conectado ao banco de dados SQLite.');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        categoria TEXT NOT NULL,
        prioridade TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
    console.log('Tabela "tickets" criada ou já existente.');
  } catch (error) {
    console.error('Erro na migration:', error);
  } finally {
    if (db) await db.close();
  }
}

migrate();
