// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {TaskManager} from "../src/TaskManager.sol";

contract TaskManagerTest is Test {
    TaskManager public taskManager;

    function setUp() public {
        taskManager = new TaskManager();
    }

    function testCreateTask() public {
        address owner = address(0xff);
        vm.label(owner, "owner");

        vm.prank(owner);
        vm.expectEmit();
        emit TaskManager.TaskCreated(0, "Test Task", "This is a test task", 1717334400, block.timestamp, 0, false, owner);
        taskManager.createTask("Test Task", "This is a test task", 1717334400);

        TaskManager.Task memory task = taskManager.getTask(0);  
        assertEq(task.title, "Test Task");
        assertEq(task.description, "This is a test task");
        assertEq(task.dueDate, 1717334400);
        assertEq(task.createdAt, block.timestamp);
        assertEq(task.completedAt, 0);
        assertEq(task.isCompleted, false);
        assertEq(task.owner, owner);
        assertEq(task.id, 0);
    }

    function testCompleteTask() public {
        taskManager.createTask("Test Task", "This is a test task", block.timestamp + 100);
        taskManager.completeTask(0);
        assertEq(taskManager.getTask(0).isCompleted, true);

    }

    function testCompleteTaskRevertIfAlreadyCompleted() public {
        taskManager.createTask("Test Task", "This is a test task", block.timestamp);
        taskManager.completeTask(0);
        vm.expectRevert(TaskManager.AlreadyCompleted.selector);
        taskManager.completeTask(0);
    }


}