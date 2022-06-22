// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract Freelancer {
  enum Statuses {
    CREATED,
    APPLIED,
    INPROGRESS,
    COMPLETED,
    PAID,
    CLAIMED
  }
  struct Task {
    string detail;
    address payable creator;
    address payable freelancer;
    Statuses status;
    uint256 amount;
    uint256 updatedAt;
  }

  Task[] public tasks;
  mapping(address => uint256) public userBalance;

  function getTaskStatus(uint256 _index) external view returns (Statuses) {
    return tasks[_index].status;
  }

  function getAllTasks() external view returns (Task[] memory) {
    return tasks;
  }

  function getTask(uint256 _index) external view returns (Task memory) {
    return tasks[_index];
  }

  function getTotalNum() external view returns (uint256) {
    return tasks.length;
  }

  function createTask(string memory _detail)
    external
    payable
    returns (uint256)
  {
    require(
      msg.value != 0,
      'You need to deposit some ETH to create a Task. Once Task is not completed, it will be returned to you'
    );
    tasks.push(
      Task(
        _detail,
        payable(msg.sender),
        payable(address(0)),
        Statuses.CREATED,
        msg.value,
        block.timestamp
      )
    );
    userBalance[msg.sender] += msg.value;
    return tasks.length;
  }

  function applyTask(uint256 _index) external {
    tasks[_index].freelancer = payable(msg.sender);
    tasks[_index].status = Statuses.APPLIED;
    tasks[_index].updatedAt = block.timestamp;
  }

  function startTask(uint256 _index) external {
    require(
      msg.sender == tasks[_index].creator,
      'You are not a creator of this Task'
    );
    tasks[_index].status = Statuses.INPROGRESS;
    tasks[_index].updatedAt = block.timestamp;
  }

  function completeTask(uint256 _index) external {
    require(
      msg.sender == tasks[_index].freelancer,
      'You are not a freelancer of this Task'
    );
    tasks[_index].status = Statuses.COMPLETED;
    tasks[_index].updatedAt = block.timestamp;
  }

  function payTask(uint256 _index) external {
    require(
      msg.sender == tasks[_index].creator,
      'You are not a creator of this Task'
    );
    require(
      userBalance[tasks[_index].creator] >= tasks[_index].amount,
      'You have insuffient funds to Pay'
    );
    tasks[_index].status = Statuses.PAID;
    tasks[_index].updatedAt = block.timestamp;
    tasks[_index].freelancer.transfer(tasks[_index].amount);
    userBalance[tasks[_index].creator] -= tasks[_index].amount;
  }

  function claimTask(uint256 _index) external {
    require(
      msg.sender == tasks[_index].creator,
      'You are not a creator of this Task'
    );
    require(
      userBalance[tasks[_index].creator] > tasks[_index].amount,
      'You have insuffient funds to Claim'
    );
    tasks[_index].status = Statuses.CLAIMED;
    tasks[_index].updatedAt = block.timestamp;
    tasks[_index].creator.transfer(tasks[_index].amount);
    userBalance[tasks[_index].creator] -= tasks[_index].amount;
  }
}
