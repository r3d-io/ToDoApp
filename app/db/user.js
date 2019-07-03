var mongoose = require('mongoose')

var user = new mongoose.Schema({
  userId:{
    type: Number
  },
  address:{
    type: String
  }
},
  {
    collection: 'users'
  }
)

module.exports = mongoose.model('User', user)
