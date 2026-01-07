import { InMemoryTodoRepository } from '../../lib/repositories/todoRepository';

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
      });

      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('createdAt');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
    });

    it('should create todos with unique ids', async () => {
      const todo1 = await repository.create({ text: 'Todo 1', completed: false });
      const todo2 = await repository.create({ text: 'Todo 2', completed: false });

      expect(todo1.id).not.toBe(todo2.id);
      expect(todo1.text).toBe('Todo 1');
      expect(todo2.text).toBe('Todo 2');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no todos exist', async () => {
      const todos = await repository.findAll();
      expect(todos).toEqual([]);
    });

    it('should return all todos', async () => {
      await repository.create({ text: 'Todo 1', completed: false });
      await repository.create({ text: 'Todo 2', completed: true });

      const todos = await repository.findAll();
      expect(todos).toHaveLength(2);
    });

    it('should return a copy of todos, not the original array', async () => {
      const created = await repository.create({ text: 'Todo 1', completed: false });
      const todos1 = await repository.findAll();
      const todos2 = await repository.findAll();

      expect(todos1).toHaveLength(1);
      expect(todos1[0].id).toBe(created.id);
      todos1[0].text = 'Modified';
      expect(todos2[0].text).toBe('Todo 1');
    });
  });

  describe('findById', () => {
    it('should return null for non-existent todo', async () => {
      const todo = await repository.findById('non-existent');
      expect(todo).toBeNull();
    });

    it('should return the correct todo', async () => {
      const created = await repository.create({ text: 'Test todo', completed: false });
      const found = await repository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.text).toBe('Test todo');
    });

    it('should return a copy of the todo', async () => {
      const created = await repository.create({ text: 'Test todo', completed: false });
      const found = await repository.findById(created.id);

      if (found) {
        found.text = 'Modified';
        const foundAgain = await repository.findById(created.id);
        expect(foundAgain?.text).toBe('Test todo');
      }
    });
  });

  describe('update', () => {
    it('should throw error for non-existent todo', async () => {
      await expect(
        repository.update('non-existent', { text: 'Updated' })
      ).rejects.toThrow('Todo not found');
    });

    it('should update todo text', async () => {
      const created = await repository.create({ text: 'Original', completed: false });
      const updated = await repository.update(created.id, { text: 'Updated' });

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(false);
    });

    it('should update todo completed status', async () => {
      const created = await repository.create({ text: 'Test', completed: false });
      const updated = await repository.update(created.id, { completed: true });

      expect(updated.completed).toBe(true);
      expect(updated.text).toBe('Test');
    });

    it('should update multiple fields', async () => {
      const created = await repository.create({ text: 'Original', completed: false });
      const updated = await repository.update(created.id, {
        text: 'Updated',
        completed: true,
      });

      expect(updated.text).toBe('Updated');
      expect(updated.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw error for non-existent todo', async () => {
      await expect(repository.delete('non-existent')).rejects.toThrow('Todo not found');
    });

    it('should delete the todo', async () => {
      const created = await repository.create({ text: 'Test', completed: false });
      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });

    it('should not affect other todos', async () => {
      const todo1 = await repository.create({ text: 'Todo 1', completed: false });
      const todo2 = await repository.create({ text: 'Todo 2', completed: false });

      await repository.delete(todo1.id);

      const todos = await repository.findAll();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo2.id);
    });
  });
});

