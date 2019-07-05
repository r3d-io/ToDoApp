'use strict'

var express = require('express')
var todo = require('./db/todo')
var eth = require('./contractMethod')
var utils = require('./utils')
var todoRoutes = express.Router()
require('dotenv').config()

todoRoutes.route('/all/:address').get(async function (req, res, next) {
  let uId = await utils.getUserId(req.params.address)
  todo.find({ userId: uId }, function (err, todos) {
    if (err) {
      return next(new Error(err))
    }
    res.render("index", { task: todos, address: req.params.address});
  })
})

todoRoutes.route('/eth/all/:address').get(async function (req, res, next) {
  let uId = await utils.getUserId(req.params.address)
  todo.find({ userId: uId }, function (err, todos) {
    todos.forEach(item => {
      eth.getTask(item.transactionCount)
    });
    res.status(200).json(todos)
  })
})


todoRoutes.route('/addtask').post(async function (req, res) {
  let listCount = await todo.estimatedDocumentCount()
  console.log(req.session.userId, req.body.title, req.body.dateTime)
  let taskCount = await eth.getTaskCount()
  let task = await eth.createTodoItem(1, req.body.title, req.body.dateTime)
  if (req.session.userId)
    todo.create({
      userId: req.session.userId,
      itemId: listCount + 1,
      title: req.body.title,
      date: req.body.dateTime,
      status: false,
      transactionHash: task.transactionHash,
      transactionCount: taskCount
    },
      function (error, todo) {
        if (error) {
          res.status(400).send(`Unable to create todo list ${error}`)
        }
        // res.status(200).json(todo)
        res.redirect(process.env.BASEPATH + "api/all/" + req.session.address, 200)
      }
    )
  else  
    res.status(400).send(`Unable to create todo list`)
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

todoRoutes.route('/updatetask').post(function (req, res, next) {
  console.log(req.body)
  var ids = req.body.check
  ids.forEach(id => {

    todo.findById(id, function (error, todo) {
      if (error) {
        return next(new Error('Todo was not found'))
      } else {
        todo.status = !todo.status
        eth.updateStatus(todo.transactionCount)
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
  });
})

module.exports = todoRoutes;
