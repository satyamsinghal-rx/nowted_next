import { NextRequest, NextResponse } from 'next/server';
import { authenticate, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const {email, password} = await request.json();

    const user = await authenticate(email, password);
    if(!user){
        return NextResponse.json(
            {error: "Invalid email or password"},
            {status: 401}
        );
    }

    const token = await generateToken(user.id, user.email);

    const response = NextResponse.json({ message: 'Login successful' }, { headers: { 'X-User-Id': user.id } });

    setAuthCookie(response, token);

    return response;
}