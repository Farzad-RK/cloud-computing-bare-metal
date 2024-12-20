const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(
    "mongodb://admin:password@${process.env.MONGODB_CLUSTER_IP}:27017/todolist?authSource=admin",
    { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB!"));

// Todo Schema & Model
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// CRUD Routes
app.get("/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/todos", async (req, res) => {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
});

app.put("/todos/:id", async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res.json(updatedTodo);
});

app.delete("/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

// Start Server
app.listen(port, () => console.log(`TodoList service running on port ${port}!`));
