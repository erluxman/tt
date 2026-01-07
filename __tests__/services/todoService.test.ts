import { TodoService } from '../../lib/services/todoService';
import { InMemoryTodoRepository } from '../../lib/repositories/todoRepository';
import type { ITodoRepository } from '../../lib/repositories/todoRepository';

const TEST_USER_ID = 'test-user-id';

describe('TodoService', () => {
  let service: TodoService;
  let repository: ITodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
    service = new TodoService(repository);
  });

  describe('getAllTodos', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await service.getAllTodos(TEST_USER_ID);
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      await service.createTodo({ text: 'Todo 1' }, TEST_USER_ID);
      await service.createTodo({ text: 'Todo 2' }, TEST_USER_ID);

      const todos = await service.getAllTodos(TEST_USER_ID);
      expect(todos).toHaveLength(2);
    });
  });

  describe('getTodoById', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.getTodoById('', TEST_USER_ID)).rejects.toThrow('Invalid todo ID');
      await expect(service.getTodoById(null as unknown as string, TEST_USER_ID)).rejects.toThrow('Invalid todo ID');
    });

    it('should return null for non-existent todo', async () => {
      const todo = await service.getTodoById('non-existent', TEST_USER_ID);
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const created = await service.createTodo({ text: 'Test todo' }, TEST_USER_ID);
      const found = await service.getTodoById(created.id, TEST_USER_ID);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
    });
  });

  describe('createTodo', () => {
    it('should throw error for empty text', async () => {
      await expect(service.createTodo({ text: '' }, TEST_USER_ID)).rejects.toThrow(
        'Todo text is required'
      );
      await expect(service.createTodo({ text: '   ' }, TEST_USER_ID)).rejects.toThrow(
        'Todo text is required'
      );
    });

    it('should throw error for invalid text type', async () => {
      await expect(service.createTodo({ text: null as unknown as string }, TEST_USER_ID)).rejects.toThrow();
      await expect(service.createTodo({ text: 123 as unknown as string }, TEST_USER_ID)).rejects.toThrow();
    });

    it('should create todo with trimmed text', async () => {
      const todo = await service.createTodo({ text: '  Test todo  ' }, TEST_USER_ID);
      expect(todo.text).toBe('Test todo');
    });

    it('should create todo with completed false by default', async () => {
      const todo = await service.createTodo({ text: 'Test' }, TEST_USER_ID);
      expect(todo.completed).toBe(false);
    });

    it('should create a valid todo', async () => {
      const todo = await service.createTodo({ text: 'Test todo' }, TEST_USER_ID);
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('createdAt');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });
  });

  describe('updateTodo', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.updateTodo({ id: '' }, TEST_USER_ID)).rejects.toThrow('Todo ID is required');
    });

    it('should throw error for non-existent todo', async () => {
      await expect(
        service.updateTodo({ id: 'non-existent', text: 'Updated' }, TEST_USER_ID)
      ).rejects.toThrow('Todo not found');
    });

    it('should throw error for empty text', async () => {
      const todo = await service.createTodo({ text: 'Original' }, TEST_USER_ID);
      await expect(service.updateTodo({ id: todo.id, text: '' }, TEST_USER_ID)).rejects.toThrow(
        'Todo text must be a non-empty string'
      );
      await expect(service.updateTodo({ id: todo.id, text: '   ' }, TEST_USER_ID)).rejects.toThrow(
        'Todo text must be a non-empty string'
      );
    });

    it('should update text', async () => {
      const todo = await service.createTodo({ text: 'Original' }, TEST_USER_ID);
      const updated = await service.updateTodo({ id: todo.id, text: 'Updated' }, TEST_USER_ID);

      expect(updated.text).toBe('Updated');
    });

    it('should update completed status', async () => {
      const todo = await service.createTodo({ text: 'Test' }, TEST_USER_ID);
      const updated = await service.updateTodo({ id: todo.id, completed: true }, TEST_USER_ID);

      expect(updated.completed).toBe(true);
    });

    it('should trim text when updating', async () => {
      const todo = await service.createTodo({ text: 'Original' }, TEST_USER_ID);
      const updated = await service.updateTodo({ id: todo.id, text: '  Updated  ' }, TEST_USER_ID);

      expect(updated.text).toBe('Updated');
    });

    it('should update both text and completed', async () => {
      const todo = await service.createTodo({ text: 'Original' }, TEST_USER_ID);
      const updated = await service.updateTodo({
        id: todo.id,
        text: 'Updated',
        completed: true,
      }, TEST_USER_ID);

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(true);
    });
  });

  describe('deleteTodo', () => {
    it('should throw error for invalid id', async () => {
      await expect(service.deleteTodo('', TEST_USER_ID)).rejects.toThrow('Todo ID is required');
    });

    it('should throw error for non-existent todo', async () => {
      await expect(service.deleteTodo('non-existent', TEST_USER_ID)).rejects.toThrow('Todo not found');
    });

    it('should delete the todo', async () => {
      const todo = await service.createTodo({ text: 'Test' }, TEST_USER_ID);
      await service.deleteTodo(todo.id, TEST_USER_ID);

      const found = await service.getTodoById(todo.id, TEST_USER_ID);
      expect(found).toBeNull();
    });
  });
});

