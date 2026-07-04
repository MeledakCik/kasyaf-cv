import { NextRequest, NextResponse } from 'next/server';
import { verifyInternalToken, verifySignedData } from '@/lib/auth';

export async function requireInternalAuth(request: NextRequest) {
  const token = request.headers.get('x-internal-auth');
  const tokenPayload = await verifyInternalToken(token, request.nextUrl.pathname);
  if (!tokenPayload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = request.cookies.get('session_id')?.value;
  const sessionData = await verifySignedData(sessionId);
  if (!sessionData) {
    return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
  }

  return null;
}