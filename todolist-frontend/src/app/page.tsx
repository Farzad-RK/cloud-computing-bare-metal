"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://todolist.local/api'; // Fallback for local dev

// Define the type for a todo item
interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([]); // Explicitly set the type for todos
    const [newTodo, setNewTodo] = useState<string>("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        try {
            const response = await axios.post<Todo>(`${API_BASE_URL}/todos`, {
                title: newTodo,
                completed: false,
            });
            setTodos([...todos, response.data]); // TypeScript now knows response.data is of type Todo
            setNewTodo("");
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        try {
            const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`, {
                completed: !completed,
            });
            setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (id: string) => {
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
