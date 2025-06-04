const DatabaseInterface = require('./interface');

class MemoryDatabase extends DatabaseInterface {
  constructor() {
    super();
    this.tasks = new Map();
  }

  async setup() {
    // Adiciona alguns dados de exemplo
    const sampleTasks = [
      {
        id: 1,
        title: "Implementar autenticação",
        description: "Adicionar sistema de login com JWT",
        stake: "1000000000000000000", // 1 ETH
        created_at: Math.floor(Date.now() / 1000),
        completed_at: null,
        due_date: Math.floor(Date.now() / 1000) + 86400, // 1 dia no futuro
        is_completed: false,
        owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      },
      {
        id: 2,
        title: "Criar testes unitários",
        description: "Implementar testes para as funções principais",
        stake: "500000000000000000", // 0.5 ETH
        created_at: Math.floor(Date.now() / 1000),
        completed_at: null,
        due_date: Math.floor(Date.now() / 1000) + 172800, // 2 dias no futuro
        is_completed: false,
        owner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
      },
      {
        id: 3,
        title: "Documentar API",
        description: "Criar documentação da API GraphQL",
        stake: "2000000000000000000", // 2 ETH
        created_at: Math.floor(Date.now() / 1000),
        completed_at: Math.floor(Date.now() / 1000),
        due_date: Math.floor(Date.now() / 1000) - 86400, // 1 dia no passado
        is_completed: true,
        owner: "0x456"
      }
    ];

    // Adiciona as tasks de exemplo ao banco
    for (const task of sampleTasks) {
      this.tasks.set(task.id.toString(), task);
    }

    console.log('✅ Banco de dados em memória inicializado com dados de exemplo');
  }

  async saveTask(taskData) {
    const task = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      stake: taskData.stake,
      created_at: taskData.created_at,
      completed_at: taskData.completed_at,
      due_date: taskData.due_date,
      is_completed: taskData.is_completed,
      owner: taskData.owner
    };

    this.tasks.set(task.id.toString(), task);
    return task;
  }

  async findTasks(filters = {}) {
    let tasks = Array.from(this.tasks.values());

    if (filters.owner) {
      tasks = tasks.filter(task => task.owner === filters.owner);
    }

    if (filters.isCompleted !== undefined) {
      tasks = tasks.filter(task => task.is_completed === filters.isCompleted);
    }

    return tasks;
  }
}

module.exports = MemoryDatabase; 