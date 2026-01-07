/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../../app/api/todos/route';
import { resetTodoRepository } from '../../../lib/repositories/todoRepository';

// Mock the web APIs for Node.js environment
global.Request = class Request {
  constructor(
    public url: string,
    public init?: { method?: string; headers?: HeadersInit; body?: string }
  ) {}
} as typeof Request;

// Mock Headers for Node.js environment
(global as unknown as { Headers: typeof Headers }).Headers = class Headers {
  private headers: Map<string, string> = new Map();

  constructor(init?: HeadersInit) {
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.headers.set(key, value));
      } else if (init instanceof Headers) {
        init.forEach((value, key) => this.headers.set(key, value));
      } else {
        Object.entries(init).forEach(([key, value]) => this.headers.set(key, value));
      }
    }
  }

  get(name: string): string | null {
    return this.headers.get(name) || null;
  }

  has(name: string): boolean {
    return this.headers.has(name);
  }

  set(name: string, value: string): void {
    this.headers.set(name, value);
  }

  forEach(callback: (value: string, key: string) => void): void {
    this.headers.forEach(callback);
  }
} as unknown as typeof Headers;

describe('API Route /api/todos', () => {
  beforeEach(() => {
    resetTodoRepository();
  });

  describe('GET', () => {
    it('should return empty array when no todos exist', async () => {
      const response = await GET();
      const data = await response.json();

      expect(data.todos).toEqual([]);
    });

    it('should return all todos', async () => {
      // Create todos via POST
      const createRequest1 = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Todo 1' }),
      });
      await POST(createRequest1);

      const createRequest2 = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Todo 2' }),
      });
      await POST(createRequest2);

      const response = await GET();
      const data = await response.json();

      expect(data.todos).toHaveLength(2);
    });
  });

  describe('POST', () => {
    it('should create a new todo', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'New todo' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.todo).toHaveProperty('id');
      expect(data.todo.text).toBe('New todo');
      expect(data.todo.completed).toBe(false);
    });

    it('should return 400 for empty text', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });

    it('should return 400 for missing text', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT', () => {
    it('should update todo text', async () => {
      // Create a todo first
      const createRequest = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Original' }),
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Update the todo
      const updateRequest = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: created.todo.id, text: 'Updated' }),
      });

      const response = await PUT(updateRequest);
      const data = await response.json();

      expect(data.todo.text).toBe('Updated');
    });

    it('should update todo completed status', async () => {
      // Create a todo first
      const createRequest = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Test' }),
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Update the todo
      const updateRequest = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: created.todo.id, completed: true }),
      });

      const response = await PUT(updateRequest);
      const data = await response.json();

      expect(data.todo.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 'non-existent', text: 'Updated' }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('not found');
    });

    it('should return 400 for missing id', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Updated' }),
      });

      const response = await PUT(request);

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE', () => {
    it('should delete a todo', async () => {
      // Create a todo first
      const createRequest = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'To delete' }),
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Delete the todo
      const deleteRequest = new NextRequest(
        `http://localhost/api/todos?id=${created.todo.id}`,
        {
          method: 'DELETE',
        }
      );

      const response = await DELETE(deleteRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Todo deleted successfully');

      // Verify it's deleted
      const getResponse = await GET();
      const getData = await getResponse.json();
      expect(getData.todos).toHaveLength(0);
    });

    it('should return 400 for missing id', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain('required');
    });

    it('should return 404 for non-existent todo', async () => {
      const request = new NextRequest('http://localhost/api/todos?id=non-existent', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain('not found');
    });
  });
});

