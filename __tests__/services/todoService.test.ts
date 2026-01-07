import { TodoService } from '../../lib/services/todoService';
import { InMemoryTodoRepository } from '../../lib/repositories/todoRepository';
import type { ITodoRepository } from '../../lib/repositories/todoRepository';

describe('TodoService', () => {
  let service: TodoService;
  let repository: ITodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
    service = new TodoService(repository);
  });

  describe('getAllTodos', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await service.getAllTodos();
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      await service.createTodo({ text: 'Todo 1' });
      await service.createTodo({ text: 'Todo 2' });

      const todos = await service.getAllTodos();
      expect(todos).toHaveLength(2);
    });
  });

  describe('getTodoById', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.getTodoById('')).rejects.toThrow('Invalid todo ID');
      await expect(service.getTodoById(null as unknown as string)).rejects.toThrow('Invalid todo ID');
    });

    it('should return null for non-existent todo', async () => {
      const todo = await service.getTodoById('non-existent');
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const created = await service.createTodo({ text: 'Test todo' });
      const found = await service.getTodoById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });
  });

  describe('createTodo', () => {
    it('should throw error for empty text', async () => {
      await expect(service.createTodo({ text: '' })).rejects.toThrow(
        'Todo text is required'
      );
      await expect(service.createTodo({ text: '   ' })).rejects.toThrow(
        'Todo text is required'
      );
    });

    it('should throw error for invalid text type', async () => {
      await expect(service.createTodo({ text: null as unknown as string })).rejects.toThrow();
      await expect(service.createTodo({ text: 123 as unknown as string })).rejects.toThrow();
    });

    it('should create todo with trimmed text', async () => {
      const todo = await service.createTodo({ text: '  Test todo  ' });
      expect(todo.text).toBe('Test todo');
    });

    it('should create todo with completed false by default', async () => {
      const todo = await service.createTodo({ text: 'Test' });
      expect(todo.completed).toBe(false);
    });

    it('should create a valid todo', async () => {
      const todo = await service.createTodo({ text: 'Test todo' });
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('createdAt');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });
  });

  describe('updateTodo', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.updateTodo({ id: '' })).rejects.toThrow('Todo ID is required');
    });

    it('should throw error for non-existent todo', async () => {
      await expect(
        service.updateTodo({ id: 'non-existent', text: 'Updated' })
      ).rejects.toThrow('Todo not found');
    });

    it('should throw error for empty text', async () => {
      const todo = await service.createTodo({ text: 'Original' });
      await expect(service.updateTodo({ id: todo.id, text: '' })).rejects.toThrow(
        'Todo text must be a non-empty string'
      );
      await expect(service.updateTodo({ id: todo.id, text: '   ' })).rejects.toThrow(
        'Todo text must be a non-empty string'
      );
    });

    it('should update text', async () => {
      const todo = await service.createTodo({ text: 'Original' });
      const updated = await service.updateTodo({ id: todo.id, text: 'Updated' });

      expect(updated.text).toBe('Updated');
    });

    it('should update completed status', async () => {
      const todo = await service.createTodo({ text: 'Test' });
      const updated = await service.updateTodo({ id: todo.id, completed: true });

      expect(updated.completed).toBe(true);
    });

    it('should trim text when updating', async () => {
      const todo = await service.createTodo({ text: 'Original' });
      const updated = await service.updateTodo({ id: todo.id, text: '  Updated  ' });

      expect(updated.text).toBe('Updated');
    });

    it('should update both text and completed', async () => {
      const todo = await service.createTodo({ text: 'Original' });
      const updated = await service.updateTodo({
        id: todo.id,
        text: 'Updated',
        completed: true,
      });

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(true);
    });
  });

  describe('deleteTodo', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.deleteTodo('')).rejects.toThrow('Todo ID is required');
    });

    it('should throw error for non-existent todo', async () => {
      await expect(service.deleteTodo('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should delete the todo', async () => {
      const todo = await service.createTodo({ text: 'Test' });
      await service.deleteTodo(todo.id);

      const found = await service.getTodoById(todo.id);
      expect(found).toBeNull();
    });
  });
});

