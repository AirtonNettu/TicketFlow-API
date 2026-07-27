const { getConnection } = require('../config/db');
const fs = require('fs').promises;
const path = require('path');

async function seed() {
  let db;
  try {
    db = await getConnection();
    console.log('Conectado ao banco de dados SQLite para seed.');

    const dataPath = path.join(__dirname, '..', 'data', 'chamados.json');
    const dataFile = await fs.readFile(dataPath, 'utf8');
    const chamados = JSON.parse(dataFile);

    for (const chamado of chamados) {
      await db.run(
        `INSERT OR IGNORE INTO tickets (id, titulo, descricao, categoria, prioridade, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          chamado.id,
          chamado.titulo,
          chamado.descricao,
          chamado.categoria,
          chamado.prioridade,
          chamado.status,
          chamado.createdAt
        ]
      );
    }
    console.log('Seed de dados finalizada com sucesso!');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Arquivo chamados.json não encontrado. Seed ignorado.');
    } else {
      console.error('Erro no seed:', error);
    }
  } finally {
    if (db) await db.close();
  }
}

seed();
