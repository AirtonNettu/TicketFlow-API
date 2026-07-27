const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

// Obtem o caminho do db usando env. Se falhar usar default.
const dbPath = process.env.DATABASE_URL || './src/data/database.sqlite';

let dbInstance = null;

// Retorna uma conexao
async function getConnection() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
  }
  return dbInstance;
}

module.exports = {
  getConnection
};
