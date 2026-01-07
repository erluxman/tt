import { NextResponse } from 'next/server';
import { UserModel } from '../../../lib/models/User';
import { isMongoConfigured } from '../../../lib/db/mongodb';

// This endpoint creates the default test user
// Call it once after setting up MongoDB
export async function POST() {
  // Check if MongoDB is configured at runtime
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { 
        error: 'MongoDB is not configured. Please set MONGODB_URI in .env.local',
        hint: 'This endpoint requires MongoDB to be set up'
      },
      { status: 400 }
    );
  }

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

