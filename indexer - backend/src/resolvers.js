const { db } = require('./database');

const resolvers = {
  Query: {
    tasks: async (_, { where }) => {
      try {
        const filters = {};
        
        if (where) {
          if (where.owner) {
            filters.owner = where.owner;
          }
          
          if (where.isCompleted !== undefined) {
            filters.isCompleted = where.isCompleted;
          }
        }
        
        const tasks = await db.findTasks(filters);
        
        // Transforma os dados para o formato GraphQL
        return tasks.map(task => ({
          id: task.id.toString(),
          title: task.title,
          description: task.description,
          stake: task.stake,
          createdAt: new Date(task.created_at * 1000).toISOString(),
          completedAt: task.completed_at ? new Date(task.completed_at * 1000).toISOString() : null,
          dueDate: new Date(task.due_date * 1000).toISOString(),
          isCompleted: task.is_completed,
          owner: task.owner
        }));
      } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        throw new Error('Erro ao buscar tasks');
      }
    }
  }
};

module.exports = { resolvers }; 