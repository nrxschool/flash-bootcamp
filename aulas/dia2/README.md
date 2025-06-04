---
marp: true
class: invert
---

# **Dia 2: Smart Contracts e o Comprometimento Real**

- data: 03/05
- prof: Manoel Lúcio

---

## **1. Abertura**

**Hello Web3!**  
Hoje vamos iniciar nosso projeto de dApp com um Todo List com staking em ETH.

Nossa jornada começou com o frontend — e agora vamos para os smartcontracts!

---

## **2. Programação do Dia**

1. Introdução ao Solidity e Smart Contracts
2. Criação do contrato `TodoStaker.sol`
3. Deploy local com Anvil/Hardhat
4. Integração com frontend usando `viem`
5. Emissão e leitura de eventos

---

## **3. Introdução**

Vamos adicionar uma camada financeiro no nosso app com Smart Contracts:

1. Para criar um nova tarefa, temos que depositar um valor em ETH.
2. Esse valor só pode ser resgatado quando a tarefa for concluída.

---

## **4. Desafio Técnico**

Criar um contrato que:

- Permita um CRUD de tarefas.
- Para criar uma tarefa é necessário depositar algum valor (ETH).
- Ao concluir a tarefa o valor (ETH) é resgatado para a carteira origianl
- Emitir eventos `TaskCreated` e `TaskCompleted`

---

## **5. Objetivo da Aula**

- Escrever o contrato `TodoStaker.sol` em Solidity.
- Aprender conceitos: `payable`, `mapping`, `events`, `msg.sender`.
- Fazer testes em solidity.
- Fazer deploy local.
- Integrar o contrato com o frontend via `viem`

---

## **6. Código Base**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface TodoStaker {
    function createTask() payable;
    function removeTask();
    function doneTask();
    function getTask();
}
```

---

## **7. Integração com o Frontend**

### Instalação

```bash
npm install viem
```

### Exemplo de chamada

```ts
const { writeContract } = useWriteContract();

await writeContract({
  address: contractAddress,
  abi,
  functionName: "createTask",
  args: ["Estudar Web3"],
  value: parseEther("1.0"),
});
```

---

## **8. Problemas Identificados**

- Não permite a consulta por filtros.
- Não permite fácil acesso a um histórico de eventos.
- Não permite computar/agregar métricas.

---

## **9. Recapitulação**

Hoje você aprendeu:

- Como escrever, testar, fazer e interagir com smart contracts em Solidity.
- Como travar ETH com `msg.value`
- Como emitir eventos.
- Como interagir com contratos via `cast` e `viem`

---

## **10. Lição de Casa**

### Desafio de Aprendizagem

- Adicione um modificar para que apenas o dono da tarefa possa modificar ela (concluir, remover ou atualizar).

### Desafio de Carreira

- Faça um resumo da aula e post com #neaxflash

---

## **11. Próxima Aula**

**04/05 – Backend e Indexadores**

Vamos criar um indexador que escuta os eventos do contrato e fornece uma API GraphQL para alimentar o frontend.

_"Prepare seu banco de dados e venha com energia!"_
