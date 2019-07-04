
var Web3 = require('web3')
const fs = require('fs');
let web3 = new Web3("http://localhost:8545")
abi = JSON.parse(fs.readFileSync('contract/todo.abi').toString())
bytecode = fs.readFileSync('contract/todo.bin').toString()
deployedContract = new web3.eth.Contract(abi)

deployedContract.options.address = "0x3fc9350370823b8d59791172e3e791bcf18ed740"

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

async function updateStatus(id){
  let taskStatus = await deployedContract.methods.toggleCompleted(id).send({ from: account[1], gas:3000000 })
  return taskStatus
}

async function getTaskCount(){
  let taskCount = await deployedContract.methods.taskCount().call()
  console.log(taskCount)
  return taskCount
}

module.exports = {
  createTodoItem,
  getTaskCount,
  updateStatus,
  getTask
}
