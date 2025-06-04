"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { StatusCard } from "@/components/comons/statusCard";
import { WalletIcon } from "lucide-react";
import Image from "next/image";
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
import {
  Address,
  createWalletClient,
  custom,
  etherUnits,
  formatEther,
  getContract,
  parseEther,
} from "viem";
import { anvil } from "viem/chains";
import { contractABI, contractAddress } from "@/lib/abi";
import { publicClient } from "@/lib/client";

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
  const [walletClient, setWalletClient] = useState<any>(null);
  const [account, setAccount] = useState<Address>();
  const [contract, setContract] = useState<any>(null);
  const [taskCount, setTaskCount] = useState<number>(0);

  //variaveis de estado para as tarefas
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: "0",
    title: "teste",
    description: "teste1123132",
    dueDate: "",
    createdAt: "",
    stake: 0,
    isCompleted: false,
  });

  //Inicializar o contrato com o endereco e ABI fornecidos
  useEffect(() => {
    if (walletClient) {
      const contractInstance = getContract({
        address: contractAddress,
        abi: contractABI,
        client: { public: publicClient, wallet: walletClient },
      });
      setContract(contractInstance);
    }
  }, [walletClient]);

  useEffect(() => {
    const client = createWalletClient({
      chain: anvil,
      transport: custom((window as any).ethereum!),
    });

    setWalletClient(client);
  }, []);

  //funcao para carregar tarefas da blockchain
  const loadTasks = async () => {
    try {
      const loadedTasks: Task[] = [];
      let id = 0;

      // Tentar carregar tarefas até encontrar uma que não existe
      while (true) {
        try {
          const task = await contract.read.getTask(id);
          console.log("Tarefa encontrada:", task);

          // Verificar se a tarefa pertence ao usuário conectado
          if (task.owner.toLowerCase() === account.toLowerCase()) {
            loadedTasks.push({
              id: task.id.toString(),
              title: task.title,
              stake: Number(task.stake),
              description: task.description,
              dueDate: new Date(Number(task.dueDate) * 1000)
                .toISOString()
                .slice(0, 16),
              createdAt: new Date(Number(task.createdAt) * 1000).toISOString(),
              isCompleted: task.isCompleted,
            });
          }
          id++;
        } catch (error) {
          // Quando não conseguir mais buscar tarefas, sair do loop
          break;
        }
      }

      setTasks(loadedTasks);
      setTaskCount(id);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  const connectWallet = async () => {
    if (!(window as any).ethereum) return;
    const [address] = await walletClient.requestAddresses();
    setAccount(address);
  };

  const disconnectWallet = async () => {
    setAccount(undefined);
    setTasks([]); // Limpar tarefas ao desconectar
  };

  //funcao para criar uma tarefa
  const handleCreateTask = async () => {
    if (!account || !walletClient) return;

    // Validar campos obrigatórios
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      console.error("Todos os campos são obrigatórios");
      return;
    }

    try {
      const dueDateTimestamp = new Date(newTask.dueDate).getTime();

      const { request } = await publicClient.simulateContract({
        account: account,
        // 1e18
        // 1 wei == 0.000000000000000001 ether (1e-18)
        // 1000000000000000000 wei == 1 ether (1e18)
        // 100 ==> 100 * 1e18 | 100 * 1e18 ==> 100
        value: parseEther(newTask.stake.toString()),
        address: contractAddress,
        abi: contractABI,
        functionName: "createTask",
        args: [newTask.title, newTask.description, dueDateTimestamp],
      });

      const hash = await walletClient.writeContract(request);

      console.log("Tarefa criada com sucesso", hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Receipt", receipt);

      // Recarregar tarefas após criar uma nova
      await loadTasks();

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

  //funcao para completar uma tarefa
  const handleCompleteTask = async (id: string) => {
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
      console.log("Tarefa completada com sucesso", hash);
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Receipt", receipt);

      // Recarregar tarefas após completar
      await loadTasks();
    } catch (error) {
      console.error("Erro ao completar tarefa", error);
    }
  };

  //Carregar tarefas quando conectar carteira
  useEffect(() => {

    if (account && contract) {
      loadTasks();
    }
  }, [account, contract]);



  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto pt-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Web3 TODO List</h1>
          <h2 className="text-sm text-muted-foreground">
            Gerencie suas tarefas com segurança e confiança
          </h2>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <StatusCard title="Total de tarefas" value={tasks.length} />
        <StatusCard
          title="Total de tarefas concluídas"
          value={tasks.filter((task) => task.isCompleted).length}
        />
        <StatusCard
          title="Total de tarefas pendentes"
          value={tasks.filter((task) => !task.isCompleted).length}
        />
      </div>
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-2xl font-bold">Tarefas</h1>
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
                type="text"
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
                placeholder="Data de vencimento"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
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

      <div className="flex flex-col gap-4 mt-10">
        {tasks.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <h1 className="text-2xl font-bold">Nenhuma tarefa encontrada</h1>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
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
