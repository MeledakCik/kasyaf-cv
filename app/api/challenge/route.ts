import { NextResponse } from 'next/server';
import { generateChallenge } from '@/lib/pow-challenge';

export async function GET() {
  const { challenge, seed, difficulty } = generateChallenge();
  return NextResponse.json({ challenge, seed, difficulty });
}