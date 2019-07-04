var mongoose = require('mongoose')

var todo = new mongoose.Schema({
  userId:{
    type: Number
  },
  itemId:{
    type: Number
  },
  title: {
    type: String
  },
  transactionHash: {
    type: String
  },
  transactionCount: {
    type: Number
  },
  date:{
    type: Date
  },
  status: {
    type: Boolean
  }
},
  {
    collection: 'todos'
  }
)

module.exports = mongoose.model('Todo', todo)
