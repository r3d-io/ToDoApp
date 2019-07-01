var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

var task = ["buy socks", "practise with nodejs"];
var complete = ["finish jquery"];

app.post('/addtask', function (req, res) {
  var newTask = req.body.newtask;
  task.push(newTask);
  res.redirect("/");
});

app.get("/", function (req, res) {
  res.render("index", { task: task, complete: complete });
});

app.post("/removetask", function (req, res) {
  var completeTask = req.body.check;
  if (typeof completeTask === "string") {
    complete.push(completeTask);
    task.splice(task.indexOf(completeTask), 1);
  } 
  else if (typeof completeTask === "object") {
    for (var i = 0; i < completeTask.length; i++) {
      complete.push(completeTask[i]);
      task.splice(task.indexOf(completeTask[i]), 1);
    }
  }
  res.redirect("/");
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

