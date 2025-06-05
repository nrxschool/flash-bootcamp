## PROMT TOP!

# criar um servidor express graphql que:
- ouça eventos da blockchain
- esses eventos são do smartcontract: 
- os eventos são esses:
- e servir via graphql para a seguinte query:
```js
query {
  tasks(
    where: { owner: "0xabc", status: "pending" | "done" }
  ) {
    id
    name
    description
    priority
    value
    createdAt
    dueDate
  }
}
```



# fluxo completo:
1. ouve o evento
2. filtra
3. normaliza os dados
4. salva no banco de dados (postgree)
5. serve via graphql


# As mutation devem ser:
- busca pelo dono da task: task.owner
- busca pelo status "pending" | "done": task.complete
- busca ordenada pelo valor de stake: task.stake
- busca pela mais urgente, ordenada pelo: task.dueDate
- Apenas implemente a mutation "busca pelo dono"
- as outras devem ser mockadas


# Contexto:
- meu contrato solidity:// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

//CRUD
//Create createTask()
//Read getTask()
//Update completeTask()

contract TaskManager {
    struct Task {
        uint256 id;
        uint256 createdAt;
        uint256 stake;
        uint256 completedAt;
        uint256 dueDate;
        string title;
        string description;
        bool isCompleted;
        address owner;
    }

    Task[] public tasks;

    function createTask(
        string memory _title,
        string memory _description,
        uint256 _dueDate
    ) public payable {
        Task memory task = Task({
            completedAt: 0,
            stake: msg.value,
            createdAt: block.timestamp,
            dueDate: _dueDate,
            title: _title,
            description: _description,
            isCompleted: false,
            owner: msg.sender,
            id: tasks.length
        });

        tasks.push(task);

        emit TaskCreated({
            id: task.id,
            createdAt: task.createdAt,
            stake: task.stake,
            completedAt: task.completedAt,
            dueDate: task.dueDate,
            description: task.description,
            isCompleted: task.isCompleted,
            owner: task.owner,
            title: task.title
        });
    }

    event TaskCreated(
        uint256 indexed id,
        uint256 indexed dueDate,
        uint256 indexed stake,
        uint256 completedAt,
        string description,
        uint256 createdAt,
        bool isCompleted,
        address owner,
        string title
    );

    event TaskCompleted(uint256 indexed id, uint256 indexed createTask, uint256 indexed completedAt);

    error Unauthorized();
    error AlreadyCompleted();

    function completeTask(uint256 _id) public {
        Task storage task = tasks[_id];

        if (task.owner != msg.sender) {
            revert Unauthorized();
        }
        if (task.isCompleted == true) {
            revert AlreadyCompleted();
        }

        task.isCompleted = true;
        task.completedAt = block.timestamp;
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        return tasks[_id];
    }
}


# REGRAS
- seja minimalista
- coloque comentários em PTBR
- instale o minimo de libs possivel
- use as libs: apollo, viem, express