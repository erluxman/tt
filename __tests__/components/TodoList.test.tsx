import { render, screen } from '@testing-library/react';
import TodoList from '../../components/TodoList';
import type { Todo } from '../../lib/types/todo';

describe('TodoList', () => {
  const mockOnToggle = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
    mockOnUpdate.mockClear();
    mockOnDelete.mockClear();
  });

  it('should show empty message when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(
      screen.getByText('No todos yet. Create your first todo above!')
    ).toBeInTheDocument();
  });

  it('should render all todos', () => {
    const todos: Todo[] = [
      {
        id: '1',
        text: 'Todo 1',
        completed: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        text: 'Todo 2',
        completed: true,
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });
});

