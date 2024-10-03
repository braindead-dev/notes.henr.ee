import { NextResponse } from 'next/server';

// Declare that globalThis.pastes is a Map if it isn't already initialized
if (!(globalThis as any).pastes) {
  (globalThis as any).pastes = new Map<string, { title: string; content: string }>();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const paste = (globalThis as any).pastes.get(id); // Use type assertion here
  
  if (paste) {
    return NextResponse.json({ title: paste.title, content: paste.content });
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
