/**
 * Interface para o banco de dados
 * Define os métodos que qualquer implementação de banco deve ter
 */
class DatabaseInterface {
  /**
   * Inicializa o banco de dados
   */
  async setup() {
    throw new Error('Método setup() deve ser implementado');
  }

  /**
   * Salva uma nova task
   * @param {Object} taskData - Dados da task
   * @returns {Promise<Object>} Task salva
   */
  async saveTask(taskData) {
    throw new Error('Método saveTask() deve ser implementado');
  }

  /**
   * Busca tasks com filtros
   * @param {Object} filters - Filtros para a busca
   * @returns {Promise<Array>} Lista de tasks
   */
  async findTasks(filters = {}) {
    throw new Error('Método findTasks() deve ser implementado');
  }
}

module.exports = DatabaseInterface; 