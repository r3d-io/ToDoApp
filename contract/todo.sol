pragma solidity ^0.5.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint userId;
    uint itemId;
    string title;
    bool status;
  }

  mapping(uint => Task) public tasks;

  event TaskCreated(
    uint itemId,
    string title,
    bool status
  );

  event TaskCompleted(
    uint itemId,
    bool status
  );

  constructor() public {
    createTask(0,"Deploy todo contract");
  }

  function createTask(uint  _userId, string memory _title) public {
    taskCount ++;
    tasks[taskCount] = Task(_userId, taskCount, _title, false);
    emit TaskCreated(taskCount, _title, false);
  }

  function toggleCompleted(uint _id) public {
    Task memory _task = tasks[_id];
    _task.status = !_task.status;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.status);
  }

}