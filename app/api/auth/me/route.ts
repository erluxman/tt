import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../../lib/middleware/auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  
  if (authResult.error) {
    return authResult.error;
  }

  return NextResponse.json({ user: authResult.user });
}

