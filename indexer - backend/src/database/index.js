require('dotenv').config();
const MemoryDatabase = require('./memory');
const PostgresDatabase = require('./postgres');

// Escolhe a implementação do banco de dados baseado na variável de ambiente
console.log('Tipo de banco de dados:', process.env.DB_TYPE || 'memory (padrão)');
const db = process.env.DB_TYPE === 'postgres' 
  ? new PostgresDatabase()
  : new MemoryDatabase();

module.exports = {
  db,
  setupDatabase: () => db.setup()
}; 