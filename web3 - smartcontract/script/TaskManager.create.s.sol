// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TaskManager} from "../src/TaskManager.sol";

contract TaskManagerCreateScript is Script {
    TaskManager public taskManager;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80);

        taskManager = new TaskManager();
        console.log("TaskManager deployed at", address(taskManager));

        // taskManager.createTask{value: 1 ether}("Buy milk", "Buy milk from the store", block.timestamp + 1000);
        // taskManager.createTask{value: 1.5 ether}("Buy eggs", "Buy eggs from the store", block.timestamp + 1000);
        // taskManager.createTask{value: 3.98 ether}("Buy bread", "Buy bread from the store", block.timestamp + 1000);

        vm.stopBroadcast();
    }
}
