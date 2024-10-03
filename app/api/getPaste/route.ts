import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Initialize global.pastes if it doesn't exist
if (!global.pastes) {
  global.pastes = new Map<string, { title: string; content: string }>();
}

export async function POST(request: Request) {
  const { title, content } = await request.json(); // Assuming request body contains title and content
  const id = uuidv4(); // Generate a unique ID

  // Since we've already initialized global.pastes, we can assert it's not undefined
  global.pastes!.set(id, { title, content });
  console.log("Stored paste:", id, title, content); // Debugging: Check that both title and content are stored

  return NextResponse.json({ id });
}
