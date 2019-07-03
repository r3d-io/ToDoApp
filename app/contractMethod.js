
var Web3 = require('web3')
const fs = require('fs');
let web3 = new Web3("http://localhost:8545")
abi = JSON.parse(fs.readFileSync('contract/todo.abi').toString())
bytecode = fs.readFileSync('contract/todo.bin').toString()
deployedContract = new web3.eth.Contract(abi)

deployedContract.options.address = "0xe2a6a13ea5fb87330966bfc82b2e93679a2c286f"

async function createTodoItem(id, title) {
  account = await web3.eth.getAccounts();
  balance = web3.eth.getBalance(account[1])
  let taskStatus = await deployedContract.methods.createTask(id, title).send({ from: account[1], gas:3000000 })
  return taskStatus
}

async function getTask(taskId){
  let taskCount = await deployedContract.methods.taskCount().call()
  taskId = taskId || taskCount 
  let task = await deployedContract.methods.tasks(taskId).call()
  return task  
}

module.exports = {
  createTodoItem
}
