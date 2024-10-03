// ./app/api/paste/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Initialize global.pastes
global.pastes = global.pastes || new Map<string, { title: string; content: string }>();

export async function POST(request: Request) {
  const { title, content } = await request.json();
  const id = uuidv4();

  global.pastes.set(id, { title, content });
  console.log("Stored paste:", id, title, content);

  return NextResponse.json({ id });
}
