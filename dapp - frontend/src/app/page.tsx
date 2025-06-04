"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { StatusCard } from "@/components/comons/statusCard";
import { WalletIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { TaskCard } from "@/components/comons/taskCard";
import { useEffect, useState } from "react";
import { Address, createWalletClient, custom } from "viem";
import { anvil } from "viem/chains";


const tasks = [
  {
    title: "Tarefa 1",
    description: "Descrição da tarefa 1",
    createdAt: "2025-01-01",
    dueDate: "2025-01-01",
    stake: 1000000000000000000
  },
]

export default function Home() {

 const [walletClient, setWalletClient] = useState<any>(null)
 const [account, setAccount] = useState<Address>()

useEffect(() => {
  const client = createWalletClient({
    chain: anvil,
    transport: custom((window as any).ethereum!)
  })

  setWalletClient(client)
},[])


 const connectWallet = async () => {
  if(!(window as any).ethereum) return
  const [address] = await walletClient.requestAddresses()
  setAccount(address)
 }

 const disconnectWallet = async () => {
  setAccount(undefined)
 }


  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto pt-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Web3 TODO List</h1>
          <h2 className="text-sm text-muted-foreground">Gerencie suas tarefas com segurança e confiança</h2>
      </div>
      {
        !account ? (
          <Button onClick={connectWallet} className="cursor-pointer">
            <WalletIcon />
            <span>
              Connect Wallet
            </span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <span>{account}</span>
            <Button onClick={disconnectWallet}>
              <XIcon />
            </Button>
          </div>
        )
      }
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <StatusCard title="Total de tarefas" value={10} />
        <StatusCard title="Total de tarefas concluídas" value={3} />
        <StatusCard title="Total de tarefas pendentes" value={7} />
        <StatusCard title="Total de wei em stake" value={1000000000000000000} />
      </div>
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Dialog>
          
          <DialogTrigger>
            <Button>
              <PlusIcon />
              <span>Nova Tarefa</span>
            </Button>
          </DialogTrigger>
          <DialogContent >
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex flex-col gap-4">
              <Label>Título</Label>
              <Input type="text" placeholder="Título da tarefa" />
              <Label>Descrição</Label>
              <Textarea placeholder="Descrição da tarefa" />
              <Label>Data de vencimento</Label>
              <Input type="datetime-local" placeholder="Data de vencimento" />
              <Label>Stake</Label>
              <Input type="number" placeholder="Stake" />
              <Button>
                <PlusIcon />
                <span>Criar Tarefa</span>
              </Button>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 mt-10">
        {
          tasks.length === 0 ? (
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
                stake={task.stake} 
                
                />
            ))
          )
        }
      </div>
      
    </div>
  );
}
