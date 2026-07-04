import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const internalSecret = request.headers.get('x-internal-auth');
  if (!internalSecret || internalSecret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json(
      { error: 'Forbidden: Access denied' }, 
      { status: 403 }
    );
  }
  const data = {
    message: "Data rahasia berhasil diakses",
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(data);
}