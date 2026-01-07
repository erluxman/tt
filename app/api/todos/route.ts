import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (in production, use a database)
let todos: Array<{ id: string; text: string; completed: boolean; createdAt: string }> = [];

export async function GET() {
  return NextResponse.json({ todos });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      );
    }

    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return NextResponse.json({ todo: newTodo }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, completed } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    if (text !== undefined) {
      if (typeof text !== 'string' || text.trim() === '') {
        return NextResponse.json(
          { error: 'Todo text must be a non-empty string' },
          { status: 400 }
        );
      }
      todos[todoIndex].text = text.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = Boolean(completed);
    }

    return NextResponse.json({ todo: todos[todoIndex] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
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

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    todos.splice(todoIndex, 1);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}

