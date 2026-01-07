'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoInput, UpdateTodoInput } from '../lib/types/todo';
import { useAuth } from './useAuth';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (input: CreateTodoInput) => Promise<void>;
  updateTodo: (input: UpdateTodoInput) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const getAuthHeaders = useCallback(() => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const fetchTodos = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/todos', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  const createTodo = useCallback(async (input: CreateTodoInput) => {
    if (!token) throw new Error('Authentication required');
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create todo');
      }

      const data = await response.json();
      setTodos((prev) => [...prev, data.todo]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error creating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  const updateTodo = useCallback(async (input: UpdateTodoInput) => {
    if (!token) throw new Error('Authentication required');
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }

      const data = await response.json();
      setTodos((prev) => prev.map((todo) => (todo.id === input.id ? data.todo : todo)));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error updating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  const deleteTodo = useCallback(async (id: string) => {
    if (!token) throw new Error('Authentication required');
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete todo');
      }

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error deleting todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  useEffect(() => {
    if (token) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [token, fetchTodos]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
}

