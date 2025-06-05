"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon, WalletIcon } from "lucide-react";
import { StatusCard } from "@/components/comons/statusCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TaskCard } from "@/components/comons/taskCard";
import { useEffect, useState } from "react";
import { Address, formatEther, getContract, parseEther } from "viem";
import { contractABI, contractAddress } from "@/lib/abi";
import { publicClient, getWalletClient } from "@/lib/client";
import { Switch } from "@/components/ui/switch";

// Tipo para representar uma tarefa
type Task = {
  stake: number;
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  isCompleted: boolean;
};

export default function Home() {
  // Estados do componente
  const [account, setAccount] = useState<Address>();
  const [contract, setContract] = useState<any>(null);
  const [useBlockchain, setUseBlockchain] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado para nova tarefa
  const [newTask, setNewTask] = useState<Task>({
    id: "0",
    title: "teste",
    description: "teste1123132",
    dueDate: "",
    createdAt: "",
    stake: 1.8,
    isCompleted: false,
  });

  // Inicializa o contrato quando o componente é montado
  useEffect(() => {
    const walletClient = getWalletClient();
    if (walletClient) {
      const contractInstance = getContract({
        address: contractAddress,
        abi: contractABI,
        client: { public: publicClient, wallet: walletClient },
      });
      setContract(contractInstance);
    }
  }, []);

  // Conecta a carteira MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      console.error("MetaMask não está instalado");
      return;
    }

    const walletClient = getWalletClient();
    if (!walletClient) return;
    try {
      const [address] = await walletClient.requestAddresses();
      setAccount(address);
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
    }
  };

  // Desconecta a carteira
  const disconnectWallet = async () => {
    setAccount(undefined);
    setTasks([]);
  };

  // Carrega tarefas da blockchain
  const loadTasksFromBlockchain = async () => {
    const loadedTasks: Task[] = [];

    try {
      // Primeiro obtém o total de tasks
      const taskCount = await contract.read.tasksCount();
      console.log(`Total de tasks: ${taskCount}`); // Adicione esta linha para verificar o número de tasks retor

      // Depois carrega cada uma
      for (let id = 0; id < taskCount; id++) {
        const task = await contract.read.getTask([id]);

        if (task.owner === account) {
          console.log(`Carregando task ${id}:`, task);
          loadedTasks.push({
            id: task.id.toString(),
            title: task.title,
            stake: Number(formatEther(task.stake)), // Convertemos de wei para ETH
            description: task.description,
            dueDate: new Date(Number(task.dueDate) * 1000)
              .toISOString()
              .slice(0, 16),
            createdAt: new Date(Number(task.createdAt) * 1000).toISOString(),
            isCompleted: task.isCompleted,
          });
        }
      }

      setTasks(loadedTasks);
      console.log(`Carregadas ${loadedTasks.length} tarefas da blockchain`);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  // Carrega tarefas do backend
  const loadTasksFromBackend = async () => {
    if (!account) return;

    try {
      const response = await fetch("https://indexer-backend.vercel.app/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              tasks(where: { owner: "${account}"}) {
                title stake description dueDate createdAt isCompleted
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.data?.tasks) {
        const loadedTasks = result.data.tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          stake: task.stake,
          dueDate: task.dueDate,
          createdAt: task.createdAt,
          isCompleted: task.isCompleted,
        }));
        setTasks(loadedTasks);
        console.log(`Carregadas ${loadedTasks.length} tarefas do backend`);
      }
    } catch (error) {
      console.error("Erro ao carregar tarefas do backend:", error);
    }
  };

  // Carrega tarefas conforme fonte selecionada
  const loadTasks = async () => {
    if (useBlockchain) {
      await loadTasksFromBlockchain();
    } else {
      await loadTasksFromBackend();
    }
  };

  // Cria uma nova tarefa
  const handleCreateTask = async () => {
    const walletClient = getWalletClient();
    if (!account || !walletClient) return;
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      console.error("Todos os campos são obrigatórios");
      return;
    }

    try {
      const dueDateTimestamp = new Date(newTask.dueDate).getTime();
      const stakeInWei = parseEther(newTask.stake.toString());

      const { request } = await publicClient.simulateContract({
        account: account,
        value: stakeInWei,
        address: contractAddress,
        abi: contractABI,
        functionName: "createTask",
        args: [newTask.title, newTask.description, dueDateTimestamp],
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      await loadTasks();

      // Reseta o formulário
      setNewTask({
        id: "",
        title: "",
        stake: 0,
        description: "",
        dueDate: "",
        createdAt: "",
        isCompleted: false,
      });
    } catch (error) {
      console.error("Erro ao criar tarefa", error);
    }
  };

  // Marca tarefa como concluída
  const handleCompleteTask = async (id: string) => {
    const walletClient = getWalletClient();
    if (!account || !walletClient || !id) return;
    try {
      const { request } = await publicClient.simulateContract({
        account: account,
        address: contractAddress,
        abi: contractABI,
        functionName: "completeTask",
        args: [BigInt(id)],
      });
      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      await loadTasks();
    } catch (error) {
      console.error("Erro ao completar tarefa", error);
    }
  };

  // Carrega tarefas quando a conta ou contrato mudam
  useEffect(() => {
    if (account && contract) loadTasks();
  }, [account, contract]);

  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto pt-10">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Web3 TODO List</h1>
          <h2 className="text-sm text-muted-foreground">
            Gerencie suas tarefas com segurança e confiança
          </h2>
        </div>

        {/* Controle de conexão */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Blockchain</span>
            <Switch
              checked={!useBlockchain}
              onCheckedChange={() => {
                setUseBlockchain(!useBlockchain);
                loadTasks();
              }}
            />
          </div>

          {!account ? (
            <Button onClick={connectWallet} className="cursor-pointer">
              <WalletIcon />
              <span>Connect Wallet</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span>{account}</span>
              <Button onClick={disconnectWallet}>
                <XIcon />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Cards de status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <StatusCard title="Total de tarefas" value={tasks.length} />
        <StatusCard
          title="Tarefas concluídas"
          value={tasks.filter((task) => task.isCompleted).length}
        />
        <StatusCard
          title="Tarefas pendentes"
          value={tasks.filter((task) => !task.isCompleted).length}
        />
      </div>

      {/* Lista de tarefas */}
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-2xl font-bold">Tarefas</h1>

        {/* Diálogo para nova tarefa */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={!account}
              variant={account ? "default" : "outline"}
              className={!account ? "opacity-50 cursor-not-allowed" : ""}
            >
              <PlusIcon />
              <span>Nova Tarefa</span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>

            <DialogDescription className="flex flex-col gap-4">
              <Label>Título</Label>
              <Input
                placeholder="Título da tarefa"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                disabled={!account}
              />

              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição da tarefa"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                disabled={!account}
              />

              <Label>Data de vencimento</Label>
              <Input
                type="datetime-local"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                disabled={!account}
              />

              <Label>Valor (ETH)</Label>
              <Input
                type="number"
                value={newTask.stake}
                onChange={(e) =>
                  setNewTask({ ...newTask, stake: Number(e.target.value) })
                }
                disabled={!account}
              />

              <Button
                onClick={handleCreateTask}
                disabled={!account}
                className={!account ? "opacity-50 cursor-not-allowed" : ""}
              >
                <PlusIcon />
                <span>Criar Tarefa</span>
              </Button>

              {!account && (
                <p className="text-sm text-red-500 text-center">
                  Conecte sua carteira para criar tarefas
                </p>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listagem de tarefas */}
      <div className="flex flex-col gap-4 mt-10">
        {tasks.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl font-bold">Nenhuma tarefa encontrada</h1>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
                     id={task.id}
              key={task.title}
              title={task.title}
              description={task.description}
              createdAt={task.createdAt}
              dueDate={task.dueDate}
              completed={task.isCompleted}
              stake={task.stake}
              handleCompleteTask={handleCompleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
