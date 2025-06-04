const { createPublicClient, http, parseAbiItem } = require('viem');
const { anvil } = require('viem/chains');
const { db } = require('./database');

// Configuração do cliente blockchain
const client = createPublicClient({
  chain: anvil,
  transport: http()
});

// ABI do evento TaskCreated
const taskCreatedEvent = parseAbiItem('event TaskCreated(uint256 indexed id, uint256 indexed dueDate, uint256 indexed stake, uint256 completedAt, string description, uint256 createdAt, bool isCompleted, address owner, string title)');
// const taskCompleteEvent ...

// Função para normalizar os dados do evento
function normalizeTaskData(event) {
  return {
    id: Number(event.args.id),
    title: event.args.title,
    description: event.args.description,
    stake: event.args.stake.toString(),
    created_at: Number(event.args.createdAt),
    completed_at: Number(event.args.completedAt),
    due_date: Number(event.args.dueDate),
    is_completed: event.args.isCompleted,
    owner: event.args.owner
  };
}

async function setupBlockchainListener() {
  try {
    // TODO: Substituir pelo endereço real do contrato
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    
    // Configura o listener de eventos
    client.watchEvent({
      address: contractAddress,
      event: taskCreatedEvent,
      onLogs: async (logs) => {
        console.log(logs)
        for (const log of logs) {
          const taskData = normalizeTaskData(log);
          await db.saveTask(taskData);
          console.log('✅ Task salva:', taskData);
        }
      }
    });
  } catch (error) {
    console.error('❌ Erro ao configurar listener:', error);
    throw error;
  }
}

module.exports = {
  setupBlockchainListener
}; 