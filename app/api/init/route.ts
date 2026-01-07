import { NextResponse } from 'next/server';
import { UserModel } from '../../../lib/models/User';

// This endpoint creates the default test user
// Call it once after setting up MongoDB
export async function POST() {
  try {
    await UserModel.createDefaultUser();
    return NextResponse.json({ 
      message: 'Default user created successfully',
      credentials: {
        email: 'test@test.com',
        password: 'test'
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create default user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

