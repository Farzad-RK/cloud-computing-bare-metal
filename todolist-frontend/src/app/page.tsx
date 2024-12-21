"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.BACKEND_URL || 'http://localhost:8080'; // Fallback for local dev

export default function Home() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/todos`, {
                title: newTodo,
                completed: false,
            });
            setTodos([...todos, response.data]);
            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/todos/${id}`, {
                completed: !completed,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/todos/${id}`);
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                    Todo List
                </h1>
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Add a new task"
                        className="flex-grow border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <button
                        onClick={addTodo}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg transform transition-transform duration-150 ease-in-out
            hover:bg-white hover:text-orange-500 hover:border hover:border-orange-500
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        Add
                    </button>
                </div>
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo._id}
                            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo._id, todo.completed)}
                                    className="w-5 h-5 text-orange-500 bg-orange-100 border-orange-400 focus:ring-2 focus:ring-orange-400
                  checked:bg-orange-500 checked:border-orange-500 hover:bg-orange-200"
                                />
                                <span
                                    className={`ml-3 ${
                                        todo.completed
                                            ? "line-through text-gray-400"
                                            : "text-gray-800"
                                    }`}
                                >
                  {todo.title}
                </span>
                            </div>
                            <button
                                onClick={() => deleteTodo(todo._id)}
                                className="text-orange-500 hover:text-orange-600 focus:outline-none"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
