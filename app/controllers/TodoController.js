const TodoModel = require("../models/Todo");

// Create and Save a new todo
exports.create = async (req, res) => {
  if (!req.body.title) {
    res.status(400).send({ message: "Title can not be empty!" });
    return;
  }

  const todo = new TodoModel({
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    completed: req.body.completed || false,
  });

  try {
    const data = await todo.save();
    res.status(201).send({
      message: "Todo created successfully!",
      todo: data,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating todo.",
    });
  }
};

// Retrieve all todos from the database.
exports.findAll = async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const todo = await TodoModel.findById(id);
    if (!todo) {
      res.status(404).json({ message: "Todo not found." });
      return;
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a todo by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Data to update can not be empty!" });
    return;
  }

  const id = req.params.id;

  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, req.body, {
      new: true,
      useFindAndModify: false,
    });

    if (!updatedTodo) {
      res.status(404).send({ message: "Todo not found." });
      return;
    }

    res.status(200).send({ message: "Todo updated successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.destroy = async (req, res) => {
  const id = req.params.id;

  try {
    const todo = await TodoModel.findByIdAndRemove(id);

    if (!todo) {
      res.status(404).send({ message: "Todo not found." });
      return;
    }

    res.status(200).send({ message: "Todo deleted successfully!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
