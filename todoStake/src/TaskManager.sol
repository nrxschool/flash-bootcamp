// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


//CRUD
//Create createTask()
//Read getTask()
//Update completeTask()

contract TaskManager {
    struct Task {
        uint256 id;
        uint256 createdAt;
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
        uint256 _dueDate,
        uint256 _createdAt
    ) public {
        Task memory task = Task({
            completedAt: 0,
            createdAt: block.timestamp,
            dueDate: _dueDate,
            title: _title,
            description: _description,
            isCompleted: false,
            owner: msg.sender,
            id: tasks.length
        });

        tasks.push(task);

        emit TaskCreated(
            task.id,
            task.title,
            task.description,
            task.dueDate,
            task.createdAt,
            task.completedAt,
            task.isCompleted,
            task.owner
        );
    }

    event TaskCreated(
        uint256 id,
        string title,
        string description,
        uint256 dueDate,
        uint256 createdAt,
        uint256 completedAt,
        bool isCompleted,
        address owner
    );

    error Unauthorized();
    error AlreadyCompleted();

    function completeTask(uint256 _id) public {
        Task storage task = tasks[_id];
        
        if(task.owner != msg.sender) {
            revert Unauthorized();
        }
        if(task.isCompleted == true) {
            revert AlreadyCompleted();
    }

    task.isCompleted = true;
    task.completedAt = block.timestamp;
    
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        return tasks[_id];
    }
}
