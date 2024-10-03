import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Initialize global.pastes if it doesn't exist
if (!global.pastes) {
  global.pastes = new Map<string, { title: string; content: string }>();
}

export async function POST(request: Request) {
  const { title, content } = await request.json(); // Assuming request body contains title and content
  const id = uuidv4(); // Generate a unique ID

  // Ensure global.pastes is initialized
  if (global.pastes) {
    global.pastes.set(id, { title, content });
    console.log("Stored paste:", id, title, content); // Debugging: Check that both title and content are stored
  } else {
    // Fallback: In case global.pastes is undefined (shouldn't happen due to the earlier check)
    return NextResponse.json({ error: "Unable to store paste" }, { status: 500 });
  }

  return NextResponse.json({ id });
}
