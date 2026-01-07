import type { Todo } from '../types/todo';

export interface ITodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo>;
  update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo>;
  delete(id: string): Promise<void>;
}

// In-memory implementation (can be swapped with database implementation)
export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Todo[] = [];
  private idCounter = 0;

  async findAll(): Promise<Todo[]> {
    return this.todos.map((todo) => ({ ...todo }));
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    return todo ? { ...todo } : null;
  }

  async create(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
    this.idCounter += 1;
    const newTodo: Todo = {
      ...todo,
      id: `${Date.now()}-${this.idCounter}`,
      createdAt: new Date().toISOString(),
    };
    this.todos.push(newTodo);
    return { ...newTodo };
  }

  async update(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
    };

    return { ...this.todos[index] };
  }

  async delete(id: string): Promise<void> {
    const index = this.todos.findIndex((t) => t.id === id);
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
    repositoryInstance = new InMemoryTodoRepository();
  }
  return repositoryInstance;
}

// Export for testing - allows resetting the repository
export function resetTodoRepository(): void {
  if (repositoryInstance instanceof InMemoryTodoRepository) {
    repositoryInstance.clear();
  } else {
    repositoryInstance = null;
  }
}

