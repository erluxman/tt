import type { Todo, CreateTodoInput, UpdateTodoInput } from '../types/todo';
import type { ITodoRepository } from '../repositories/todoRepository';

export class TodoService {
  constructor(private repository: ITodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid todo ID');
    }
    return this.repository.findById(id);
  }

  async createTodo(input: CreateTodoInput): Promise<Todo> {
    if (!input.text || typeof input.text !== 'string' || input.text.trim() === '') {
      throw new Error('Todo text is required and must be a non-empty string');
    }

    return this.repository.create({
      text: input.text.trim(),
      completed: false,
    });
  }

  async updateTodo(input: UpdateTodoInput): Promise<Todo> {
    if (!input.id || typeof input.id !== 'string') {
      throw new Error('Todo ID is required');
    }

    const existingTodo = await this.repository.findById(input.id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    const updates: Partial<Omit<Todo, 'id' | 'createdAt'>> = {};

    if (input.text !== undefined) {
      if (typeof input.text !== 'string' || input.text.trim() === '') {
        throw new Error('Todo text must be a non-empty string');
      }
      updates.text = input.text.trim();
    }

    if (input.completed !== undefined) {
      updates.completed = Boolean(input.completed);
    }

    return this.repository.update(input.id, updates);
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      throw new Error('Todo ID is required');
    }

    const existingTodo = await this.repository.findById(id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    await this.repository.delete(id);
  }
}

