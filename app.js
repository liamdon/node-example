(function() {
  var Todo, app, express, mongoose;
  express = require('express');
  mongoose = require('mongoose');
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/todone');
  Todo = mongoose.model('Todo', new mongoose.Schema({
    content: String,
    done: Boolean
  }));
  app = express.createServer();
  app.register('.coffee', require('coffeekup'));
  app.set('view engine', 'coffee');
  app.set('views', __dirname + '/views');
  app.set('view options', {
    layout: false
  });
  app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    return app.use(express.static(__dirname + '/public'));
  });
  app.get("/", function(req, res) {
    return res.render("app");
  });
  app.get("/todos", function(req, res) {
    return Todo.find(function(err, todos) {
      return res.send(todos);
    });
  });
  app.post("/todos", function(req, res) {
    var todo;
    todo = new Todo({
      content: req.body.content,
      done: req.body.done
    });
    todo.save(function(err) {
      if (!err) {
        return console.log("created");
      }
    });
    return res.send(todo);
  });
  app.put("/todos/:id", function(req, res) {
    return Todo.findById(req.params.id, function(err, todo) {
      todo.content = req.body.content;
      todo.done = req.body.done;
      return todo.save(function(err) {
        if (!err) {
          console.log("updated");
        }
        return res.send(todo);
      });
    });
  });
  app.del('/todos/:id', function(req, res) {
    return Todo.findById(req.params.id, function(err, todo) {
      return todo.remove(function(err) {
        if (!err) {
          return console.log("removed");
        }
      });
    });
  });
  app.listen(process.env.PORT || 3000);
}).call(this);
