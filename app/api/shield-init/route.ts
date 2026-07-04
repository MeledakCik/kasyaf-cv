import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
export async function POST(request: Request) {
  const SECRET_KEY = process.env.COOKIE_SECRET;
  
  if (!SECRET_KEY) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { fingerprint, dpr } = body;

    if (!fingerprint) {
      return NextResponse.json({ error: 'Invalid footprint' }, { status: 400 });
    }
    const rawSessionId = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const signature = createHmac('sha256', SECRET_KEY)
      .update(rawSessionId)
      .digest('hex');
    
    const signedSessionId = `${rawSessionId}.${signature}`;
    const timestamp = Date.now().toString();
    const datr = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const mid = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const csrftoken = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const response = NextResponse.json({ success: true });
    
    const cookieOptions = { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict' as const, 
      maxAge: 86400 
    };

    response.cookies.set('session_id', signedSessionId, cookieOptions);
    response.cookies.set('__cik_fp', fingerprint, cookieOptions);
    response.cookies.set('__cik_ts', timestamp, cookieOptions);
    response.cookies.set('__cik_clearance', 'true', cookieOptions);
    response.cookies.set('datr', datr, cookieOptions);
    response.cookies.set('mid', mid, cookieOptions);
    response.cookies.set('dpr', (dpr || 1).toString(), cookieOptions);
    response.cookies.set('csrftoken', csrftoken, cookieOptions);

    return response;

  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize security' }, { status: 500 });
  }
}