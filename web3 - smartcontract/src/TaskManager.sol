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
        uint256 stake;
        uint256 completedAt;
        uint256 dueDate;
        string title;
        string description;
        bool isCompleted;
        address owner;
    }

    Task[] public tasks;

    function createTask(string memory _title, string memory _description, uint256 _dueDate) public payable {
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

        // Emit the TaskCompleted event
        emit TaskCompleted({id: _id, createTask: task.createdAt, completedAt: task.completedAt});

        // Return the stake to the user
        (bool sent,) = msg.sender.call{value: task.stake}("");
        require(sent, "Failed to send Ether");
    }

    function getTask(uint256 _id) public view returns (Task memory) {
        return tasks[_id];
    }

    function tasksCount() public view returns (uint256) {
        return tasks.length;
    }
}
