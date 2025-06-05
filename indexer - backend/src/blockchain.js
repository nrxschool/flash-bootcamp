const { createPublicClient, http, parseAbiItem, formatEther } = require('viem');
const { sepolia } = require('viem/chains');
const { db } = require('./database');

// Configuração do cliente blockchain
const client = createPublicClient({
  chain: sepolia,
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
    stake: formatEther(event.args.stake.toString()),
    created_at: Number(event.args.createdAt),
    completed_at: Number(event.args.completedAt),
    due_date: Number(event.args.dueDate),
    is_completed: event.args.isCompleted,
    owner: event.args.owner
  };
}

async function fetchPastEvents() {
  // TODO: Substituir pelo endereço real do contrato
  const contractAddress = '0x034FAeae891F47a2714eb1e4BfbA7525a606DcC5';

  const last1000block = await client.getBlockNumber() - BigInt(1000);
  console.log(last1000block)

  // Busca todos os logs do evento TaskCreated desde o bloco 0 até o mais recente
  const logs = await client.getLogs({
    address: contractAddress,
    event: taskCreatedEvent,
    fromBlock: last1000block,
    toBlock: 'latest'
  });

  for (const log of logs) {
    const taskData = normalizeTaskData(log);
    await db.saveTask(taskData);
    console.log('✅ Task salva (histórico):', taskData);
  }
}

async function setupBlockchainListener() {
  try {
    await fetchPastEvents();

    // TODO: Substituir pelo endereço real do contrato
    const contractAddress = '0x034FAeae891F47a2714eb1e4BfbA7525a606DcC5'
    
    // Configura o listener de eventos
    client.watchEvent({
      address: contractAddress,
      event: taskCreatedEvent,
      onLogs: async (logs) => {
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