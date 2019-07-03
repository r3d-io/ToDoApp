'use strict'

var express = require('express')
var todo = require('./todo')
var todoRoutes = express.Router()
// var app = express()
// var cookieParser = require('cookie-parser');

todoRoutes.route('/all').get(function (req, res, next) {
  todo.find(function (err, todos) {
    if (err) {
      return next(new Error(err))
    }
    //  .log(todos)
    res.render("index", { task: todos });
  })
})

todoRoutes.route('/addtask').post(function (req, res) {
  let sess = req.session;
  sess.listItemId ? sess.listItemId++ : sess.listItemId = 1
  todo.create({
    userId: 1,
    itemId: sess.listItemId + 1,
    title: req.body.title,
    date: req.body.dateTime,
    done: false
  },
    function (error, todo) {
      if (error) {
        res.status(400).send(`Unable to create todo list ${error}`)
      }
      res.status(200).json(todo)
    }
  )
})

todoRoutes.route('/removetask/:id').get(function (req, res, next){
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
      todo.name = req.body.name
      todo.done = req.body.done

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

module.exports = todoRoutes;