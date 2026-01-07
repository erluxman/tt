import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '../../../../lib/models/User';
import { generateToken } from '../../../../lib/auth/jwt';
import type { CreateUserInput } from '../../../../lib/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserInput = await request.json();
    const { email, password, name } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 }
      );
    }

    // Create user
    const user = await UserModel.create({ email, password, name });

    // Generate token
    const token = generateToken({
      userId: user._id!,
      email: user.email,
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    const status = errorMessage.includes('already exists') ? 409 : 400;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}

