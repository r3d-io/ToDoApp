'use strict'

var express = require('express')
var todo = require('./db/todo')
var user = require('./db/user')
var eth = require('./contractMethod')
var todoRoutes = express.Router()

todoRoutes.route('/all/:address').get(async function (req, res, next) {
  let uId = await getUserId(req.params.address)
  let userCount = await user.estimatedDocumentCount()
  req.session.userId = uId
  req.session.address = req.params.address 
  if (uId) {
    todo.find({ userId: uId }, function (err, todos) {
      if (err) {
        return next(new Error(err))
      }
      res.render("index", { task: todos });
    })
  }
  else {
    user.create({
      userId: userCount + 1,
      address: req.params.address
    },
      function (error, user) {
        if (error) {
          res.status(400).send(`Unable to create user ${error}`)
        }
        // res.status(200).json(user).next()
        res.redirect("http://localhost:4000/api/all/" + req.params.address,200)
      }
    )
  }
})

todoRoutes.route('/addtask').post(async function (req, res) {
  let listCount = await todo.estimatedDocumentCount()
  console.log(req.session.userId, req.body.title, req.body.dateTime)
  let task = await eth.createTodoItem(1, req.body.title, req.body.dateTime)
  todo.create({
    userId: req.session.userId,
    itemId: listCount + 1,
    title: req.body.title,
    date: req.body.dateTime,
    status: false,
    transactionHash: task.transactionHash
  },
    function (error, todo) {
      if (error) {
        res.status(400).send(`Unable to create todo list ${error}`)
      }
      // res.status(200).json(todo)
      res.redirect("http://localhost:4000/api/all/" + req.session.address,200)
    }
  )
})

todoRoutes.route('/removetask/:id').get(function (req, res, next) {
  var id = req.params.id
  todo.findByIdAndRemove(id, function (err, todo) {
    if (err) {
      return next(new Error('Todo was not found'))
    }
    res.json('Successfully removed')
  })
})

todoRoutes.route('/updatetask/:id').post(function (req, res, next) {
  var id = req.params.id
  todo.findById(id, function (error, todo) {
    if (error) {
      return next(new Error('Todo was not found'))
    } else {
      todo.status = !todo.status 

      todo.save({
        function(error, todo) {
          if (error) {
            res.status(400).send('Unable to update todo')
          } else {
            res.status(200).json(todo)
          }
        }
      })
    }
  })
})

function getUserId(address) {
  return new Promise(async (resolve, reject) => {
    user.find({ address: address }, function (err, user) {
      if (err)
        reject(err)
      else if (user.length !== 0)
        resolve(user[0].userId)
      else
        resolve()
    })
  })
}

module.exports = todoRoutes;