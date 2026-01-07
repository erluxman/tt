'use client';

import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

export default function Home() {
  const { todos, loading, createTodo, updateTodo, deleteTodo } = useTodos();

  const handleCreateTodo = async (text: string) => {
    await createTodo({ text });
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateTodo({ id, completed: !completed });
  };

  const handleUpdateText = async (id: string, text: string) => {
    await updateTodo({ id, text });
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            Todo Application
          </h1>

          <TodoForm onSubmit={handleCreateTodo} loading={loading} />

          <TodoList
            todos={todos}
            onToggle={handleToggleComplete}
            onUpdate={handleUpdateText}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
