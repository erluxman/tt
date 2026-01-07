/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../../app/api/todos/route';
import { resetTodoRepository } from '../../../lib/repositories/todoRepository';
import { requireAuth } from '../../../lib/middleware/auth';

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

// Mock authentication middleware
jest.mock('../../../lib/middleware/auth', () => ({
  requireAuth: jest.fn(),
}));

describe('API Route /api/todos', () => {
  const mockUser = {
    _id: 'test-user-123',
    email: 'test@test.com',
    name: 'Test User',
    provider: 'credentials' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    resetTodoRepository();
    // Mock requireAuth to return the mock user
    (requireAuth as jest.Mock).mockResolvedValue({
      user: mockUser,
    });
  });

  const createAuthenticatedRequest = (url: string, options: {
    method?: string;
    body?: unknown;
  } = {}) => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Bearer test-token');

    return new NextRequest(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  };

  const createUnauthenticatedRequest = (url: string, options: {
    method?: string;
    body?: unknown;
  } = {}) => {
    return new NextRequest(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  };

  describe('GET', () => {
    it('should return empty array when no todos exist', async () => {
      const request = createAuthenticatedRequest('http://localhost/api/todos');
      const response = await GET(request);
      const data = await response.json();

      expect(data.todos).toEqual([]);
    });

    it('should return all todos', async () => {
      // Create todos via POST
      const createRequest1 = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'Todo 1' },
      });
      await POST(createRequest1);

      const createRequest2 = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'Todo 2' },
      });
      await POST(createRequest2);

      const request = createAuthenticatedRequest('http://localhost/api/todos');
      const response = await GET(request);
      const data = await response.json();

      expect(data.todos).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce({
        error: { status: 401, json: async () => ({ error: 'Authentication required' }) },
      });
      const request = createUnauthenticatedRequest('http://localhost/api/todos');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST', () => {
    it('should create a new todo', async () => {
      const request = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'New todo' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.todo).toHaveProperty('id');
      expect(data.todo.text).toBe('New todo');
      expect(data.todo.completed).toBe(false);
    });

    it('should return 400 for empty text', async () => {
      const request = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: '' },
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce({
        error: { status: 401, json: async () => ({ error: 'Authentication required' }) },
      });
      const request = createUnauthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'Test' },
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT', () => {
    it('should update todo text', async () => {
      // Create a todo first
      const createRequest = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'Original' },
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Update the todo
      const updateRequest = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: { id: created.todo.id, text: 'Updated' },
      });

      const response = await PUT(updateRequest);
      const data = await response.json();

      expect(data.todo.text).toBe('Updated');
    });

    it('should update todo completed status', async () => {
      // Create a todo first
      const createRequest = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'Test' },
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Update the todo
      const updateRequest = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: { id: created.todo.id, completed: true },
      });

      const response = await PUT(updateRequest);
      const data = await response.json();

      expect(data.todo.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const request = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: { id: 'non-existent', text: 'Updated' },
      });

      const response = await PUT(request);

      expect(response.status).toBe(404);
    });

    it('should return 401 without authentication', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce({
        error: { status: 401, json: async () => ({ error: 'Authentication required' }) },
      });
      const request = createUnauthenticatedRequest('http://localhost/api/todos', {
        method: 'PUT',
        body: { id: '123', text: 'Updated' },
      });

      const response = await PUT(request);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE', () => {
    it('should delete a todo', async () => {
      // Create a todo first
      const createRequest = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'POST',
        body: { text: 'To delete' },
      });
      const createResponse = await POST(createRequest);
      const created = await createResponse.json();

      // Delete the todo
      const deleteRequest = createAuthenticatedRequest(
        `http://localhost/api/todos?id=${created.todo.id}`,
        { method: 'DELETE' }
      );

      const response = await DELETE(deleteRequest);

      expect(response.status).toBe(200);

      // Verify it's deleted
      const getRequest = createAuthenticatedRequest('http://localhost/api/todos');
      const getResponse = await GET(getRequest);
      const getData = await getResponse.json();
      expect(getData.todos).toHaveLength(0);
    });

    it('should return 400 for missing id', async () => {
      const request = createAuthenticatedRequest('http://localhost/api/todos', {
        method: 'DELETE',
      });

      const response = await DELETE(request);

      expect(response.status).toBe(400);
    });

    it('should return 401 without authentication', async () => {
      (requireAuth as jest.Mock).mockResolvedValueOnce({
        error: { status: 401, json: async () => ({ error: 'Authentication required' }) },
      });
      const request = createUnauthenticatedRequest('http://localhost/api/todos?id=123', {
        method: 'DELETE',
      });

      const response = await DELETE(request);

      expect(response.status).toBe(401);
    });
  });
});
