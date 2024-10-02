import { NextResponse } from 'next/server';

if (!global.pastes) {
  global.pastes = new Map(); 
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
    
  const paste = global.pastes.get(id); // Fetch both title and content from global storage

  if (paste) {
    return NextResponse.json({ title: paste.title, content: paste.content });
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}