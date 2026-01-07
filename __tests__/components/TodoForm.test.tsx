import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '../../components/TodoForm';

describe('TodoForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render input and button', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('should call onSubmit with text when form is submitted', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New todo');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('New todo');
    });
  });

  it('should call onSubmit when Enter is pressed', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    await user.type(input, 'New todo{Enter}');

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('New todo');
    });
  });

  it('should clear input after successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, 'New todo');
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should disable button when input is empty', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeDisabled();
  });

  it('should disable button when loading', () => {
    render(<TodoForm onSubmit={mockOnSubmit} loading={true} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /adding.../i });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it('should show "Adding..." when loading', () => {
    render(<TodoForm onSubmit={mockOnSubmit} loading={true} />);

    expect(screen.getByRole('button', { name: /adding.../i })).toBeInTheDocument();
  });

  it('should not submit if input is only whitespace', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<TodoForm onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a new todo...');
    const button = screen.getByRole('button', { name: /add/i });

    await user.type(input, '   ');
    await user.click(button);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});

