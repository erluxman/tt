'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([...todos, data.todo]);
        setNewTodo('');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: { text?: string; completed?: boolean }) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? data.todo : todo)));
        setEditingId(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = (id: string, completed: boolean) => {
    updateTodo(id, { completed: !completed });
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      updateTodo(id, { text: editText });
    } else {
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Todo Application
          </h1>

          {/* Create Todo Form */}
          <div className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createTodo()}
                placeholder="Add a new todo..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={createTodo}
                disabled={loading || !newTodo.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Todos List */}
          <div className="space-y-3">
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No todos yet. Create your first todo above!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />

                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') saveEdit(todo.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-3 py-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(todo.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => startEditing(todo)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
