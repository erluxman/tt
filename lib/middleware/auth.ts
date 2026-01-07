import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '../auth/jwt';
import { UserModel } from '../models/User';
import type { User } from '../types/user';

export interface AuthenticatedRequest extends NextRequest {
  user?: Omit<User, 'password'>;
}

export async function requireAuth(
  request: NextRequest
): Promise<{ user: Omit<User, 'password'>; error?: never } | { user?: never; error: NextResponse }> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
    };
  }

  try {
    const payload = verifyToken(token);
    const user = await UserModel.findById(payload.userId);

    if (!user) {
      return {
        error: NextResponse.json({ error: 'User not found' }, { status: 401 }),
      };
    }

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  } catch {
    return {
      error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }),
    };
  }
}

