import { NextResponse } from 'next/server';
import { clearAuthCookie, getAuthToken, verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {

    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'No active session found' }, { status: 400 });
    }


    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Logout successful' });


    clearAuthCookie(response);


    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
  }
}