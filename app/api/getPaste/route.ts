import { NextResponse } from 'next/server';

// Initialize globalThis.pastes if it doesn't exist
if (!globalThis.pastes) {
  globalThis.pastes = new Map<string, { title: string; content: string }>();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // Check if id is null, and handle the case appropriately
  if (!id) {
    return NextResponse.json({ error: "ID not provided" }, { status: 400 });
  }

  const paste = globalThis.pastes?.get(id); // Fetch both title and content from global storage

  if (paste) {
    return NextResponse.json({ title: paste.title, content: paste.content });
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
