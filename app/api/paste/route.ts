import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

if (!global.pastes) {
  global.pastes = new Map();
}

export async function POST(request: Request) {
  const { title, content } = await request.json(); // Accept both title and content
  const id = uuidv4();

  // Store both title and content globally
  global.pastes.set(id, { title, content });
  console.log("Stored paste:", id, title, content); // Debugging: Check that both title and content are stored

  return NextResponse.json({ id });
}