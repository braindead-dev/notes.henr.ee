import { NextResponse } from 'next/server';

// Initialize globalThis.pastes if it doesn't exist
if (!globalThis.pastes) {
  globalThis.pastes = new Map<string, { title: string; content: string }>();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const paste = globalThis.pastes?.get(id); // Safe optional chaining

  if (paste) {
    return NextResponse.json({ title: paste.title, content: paste.content });
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
