import { InMemoryTodoRepository } from '../../lib/repositories/todoRepository';

const TEST_USER_ID = 'test-user-id';

describe('InMemoryTodoRepository', () => {
  let repository: InMemoryTodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
  });

  describe('create', () => {
    it('should create a new todo with id and createdAt', async () => {
      const todo = await repository.create({
        text: 'Test todo',
        completed: false,
      }, TEST_USER_ID);

      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('createdAt');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });

    it('should create todos with unique ids', async () => {
      const todo1 = await repository.create({ text: 'Todo 1', completed: false }, TEST_USER_ID);
      const todo2 = await repository.create({ text: 'Todo 2', completed: false }, TEST_USER_ID);

      expect(todo1.id).not.toBe(todo2.id);
      expect(todo1.text).toBe('Todo 1');
      expect(todo2.text).toBe('Todo 2');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await repository.findAll(TEST_USER_ID);
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      await repository.create({ text: 'Todo 1', completed: false }, TEST_USER_ID);
      await repository.create({ text: 'Todo 2', completed: true }, TEST_USER_ID);

      const todos = await repository.findAll(TEST_USER_ID);
      expect(todos).toHaveLength(2);
    });

    it('should return a copy of todos, not the original array', async () => {
      const created = await repository.create({ text: 'Todo 1', completed: false }, TEST_USER_ID);
      const todos1 = await repository.findAll(TEST_USER_ID);
      const todos2 = await repository.findAll(TEST_USER_ID);

      expect(todos1).toHaveLength(1);
      expect(todos1[0].id).toBe(created.id);
      todos1[0].text = 'Modified';
      expect(todos2[0].text).toBe('Todo 1');
    });
  });

  describe('findById', () => {
    it('should return null for non-existent todo', async () => {
      const todo = await repository.findById('non-existent', TEST_USER_ID);
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const created = await repository.create({ text: 'Test todo', completed: false }, TEST_USER_ID);
      const found = await repository.findById(created.id, TEST_USER_ID);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.text).toBe('Test todo');
    });

    it('should return a copy of the todo', async () => {
      const created = await repository.create({ text: 'Test todo', completed: false }, TEST_USER_ID);
      const found = await repository.findById(created.id, TEST_USER_ID);

      if (found) {
        found.text = 'Modified';
        const foundAgain = await repository.findById(created.id, TEST_USER_ID);
        expect(foundAgain?.text).toBe('Test todo');
      }
    });
  });

  describe('update', () => {
    it('should throw error for non-existent todo', async () => {
      await expect(
        repository.update('non-existent', { text: 'Updated' }, TEST_USER_ID)
      ).rejects.toThrow('Todo not found');
    });

    it('should update todo text', async () => {
      const created = await repository.create({ text: 'Original', completed: false }, TEST_USER_ID);
      const updated = await repository.update(created.id, { text: 'Updated' }, TEST_USER_ID);

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(false);
    });

    it('should update todo completed status', async () => {
      const created = await repository.create({ text: 'Test', completed: false }, TEST_USER_ID);
      const updated = await repository.update(created.id, { completed: true }, TEST_USER_ID);

      expect(updated.completed).toBe(true);
      expect(updated.text).toBe('Test');
    });

    it('should update multiple fields', async () => {
      const created = await repository.create({ text: 'Original', completed: false }, TEST_USER_ID);
      const updated = await repository.update(created.id, {
        text: 'Updated',
        completed: true,
      }, TEST_USER_ID);

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw error for non-existent todo', async () => {
      await expect(repository.delete('non-existent', TEST_USER_ID)).rejects.toThrow('Todo not found');
    });

    it('should delete the todo', async () => {
      const created = await repository.create({ text: 'Test', completed: false }, TEST_USER_ID);
      await repository.delete(created.id, TEST_USER_ID);

      const found = await repository.findById(created.id, TEST_USER_ID);
      expect(found).toBeNull();
    });

    it('should not affect other todos', async () => {
      const todo1 = await repository.create({ text: 'Todo 1', completed: false }, TEST_USER_ID);
      const todo2 = await repository.create({ text: 'Todo 2', completed: false }, TEST_USER_ID);

      await repository.delete(todo1.id, TEST_USER_ID);

      const todos = await repository.findAll(TEST_USER_ID);
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo2.id);
    });
  });
});

