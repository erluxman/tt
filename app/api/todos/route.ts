import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '../../../lib/services/todoService';
import { getTodoRepository } from '../../../lib/repositories/todoRepository';

// Initialize service with repository
const todoService = new TodoService(getTodoRepository());

export async function GET() {
  try {
    const todos = await todoService.getAllTodos();
    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const todo = await todoService.createTodo({ text: body.text });
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request body';
    const status = errorMessage.includes('required') ? 400 : 400;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, completed } = body;
    const todo = await todoService.updateTodo({ id, text, completed });
    return NextResponse.json({ todo });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request body';
    const status = errorMessage.includes('not found') ? 404 : 400;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    await todoService.deleteTodo(id);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid request';
    const status = errorMessage.includes('not found') ? 404 : 400;
    return NextResponse.json(
      { error: errorMessage },
      { status }
    );
  }
}
