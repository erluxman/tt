'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { todos, loading: todosLoading, createTodo, updateTodo, deleteTodo } = useTodos();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Todo Application</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.name || user?.email}!</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          <TodoForm onSubmit={handleCreateTodo} loading={todosLoading} />

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
