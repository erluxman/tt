import type { Todo } from '../types/todo';

export interface ITodoRepository {
  findAll(userId: string): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  create(todo: Omit<Todo, 'id' | 'createdAt'>, userId: string): Promise<Todo>;
  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>, userId: string): Promise<Todo>;
  delete(id: string, userId: string): Promise<void>;
}

// In-memory implementation (can be swapped with database implementation)
// Note: This is kept for testing purposes. In production, use MongoTodoRepository
export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Array<Todo & { userId: string }> = [];
  private idCounter = 0;

  async findAll(userId: string): Promise<Todo[]> {
    return this.todos
      .filter((todo) => todo.userId === userId)
      .map((todo) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId: _userId, ...todoWithoutUserId } = todo;
        return todoWithoutUserId;
      });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id && t.userId === userId);
    if (!todo) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, ...todoWithoutUserId } = todo;
    return todoWithoutUserId;
  }

  async create(todo: Omit<Todo, 'id' | 'createdAt'>, userId: string): Promise<Todo> {
    this.idCounter += 1;
    const newTodo: Todo & { userId: string } = {
      ...todo,
      id: `${Date.now()}-${this.idCounter}`,
      createdAt: new Date().toISOString(),
      userId,
    };
    this.todos.push(newTodo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, ...todoWithoutUserId } = newTodo;
    return todoWithoutUserId;
  }

  async update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>, userId: string): Promise<Todo> {
    const index = this.todos.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId: _userId, ...todoWithoutUserId } = this.todos[index];
    return todoWithoutUserId;
  }

  async delete(id: string, userId: string): Promise<void> {
    const index = this.todos.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    this.todos.splice(index, 1);
  }

  // Method for testing - clears all todos and resets counter
  clear(): void {
    this.todos = [];
    this.idCounter = 0;
  }
}

// Singleton instance (in production, use dependency injection)
let repositoryInstance: ITodoRepository | null = null;

export function getTodoRepository(): ITodoRepository {
  if (!repositoryInstance) {
    // Use MongoDB repository if MONGODB_URI is set, otherwise use in-memory
    if (process.env.MONGODB_URI) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { MongoTodoRepository } = require('./mongoTodoRepository');
      repositoryInstance = new MongoTodoRepository();
    } else {
      repositoryInstance = new InMemoryTodoRepository();
    }
  }
  return repositoryInstance as ITodoRepository;
}

// Export for testing - allows resetting the repository
export function resetTodoRepository(): void {
  if (repositoryInstance instanceof InMemoryTodoRepository) {
    repositoryInstance.clear();
  } else {
    repositoryInstance = null;
  }
}

