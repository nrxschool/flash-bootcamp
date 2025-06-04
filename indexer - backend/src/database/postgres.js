const { Pool } = require('pg');
const DatabaseInterface = require('./interface');

class PostgresDatabase extends DatabaseInterface {
  constructor() {
    super();
    // Só cria a conexão se DB_TYPE for postgres
    if (process.env.DB_TYPE === 'postgres') {
      this.pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'task_indexer',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
      });
    }
  }

  async setup() {
    if (process.env.DB_TYPE !== 'postgres') {
      console.log('⚠️ PostgreSQL não está configurado como banco de dados');
      return;
    }

    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id BIGINT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          stake NUMERIC NOT NULL,
          created_at BIGINT NOT NULL,
          completed_at BIGINT,
          due_date BIGINT NOT NULL,
          is_completed BOOLEAN NOT NULL DEFAULT false,
          owner VARCHAR(42) NOT NULL
        );
      `);
      console.log('✅ Banco de dados PostgreSQL configurado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao configurar banco de dados:', error);
      throw error;
    }
  }

  async saveTask(taskData) {
    if (process.env.DB_TYPE !== 'postgres') {
      throw new Error('PostgreSQL não está configurado como banco de dados');
    }

    try {
      const query = `
        INSERT INTO tasks (
          id, title, description, stake, created_at, 
          completed_at, due_date, is_completed, owner
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          stake = EXCLUDED.stake,
          created_at = EXCLUDED.created_at,
          completed_at = EXCLUDED.completed_at,
          due_date = EXCLUDED.due_date,
          is_completed = EXCLUDED.is_completed,
          owner = EXCLUDED.owner
        RETURNING *;
      `;
      
      const values = [
        taskData.id,
        taskData.title,
        taskData.description,
        taskData.stake,
        taskData.created_at,
        taskData.completed_at,
        taskData.due_date,
        taskData.is_completed,
        taskData.owner
      ];
      
      const result = await this.pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('❌ Erro ao salvar task:', error);
      throw error;
    }
  }

  async findTasks(filters = {}) {
    if (process.env.DB_TYPE !== 'postgres') {
      throw new Error('PostgreSQL não está configurado como banco de dados');
    }

    try {
      let query = 'SELECT * FROM tasks';
      const params = [];
      
      if (filters.owner || filters.isCompleted !== undefined) {
        const conditions = [];
        
        if (filters.owner) {
          conditions.push('owner = $1');
          params.push(filters.owner);
        }
        
        if (filters.isCompleted !== undefined) {
          conditions.push('is_completed = $' + (params.length + 1));
          params.push(filters.isCompleted);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('❌ Erro ao buscar tasks:', error);
      throw error;
    }
  }
}

module.exports = PostgresDatabase; 