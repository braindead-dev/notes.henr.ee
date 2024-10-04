// app/api/getPaste/route.ts
import { NextResponse } from 'next/server';

// Ensure global.pastes is initialized
declare global {
  var pastes: Map<string, { title: string; content: string }>;
}

if (!global.pastes) {
  global.pastes = new Map<string, { title: string; content: string }>();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter.' }, { status: 400 });
    }

    const paste = global.pastes.get(id);

    if (!paste) {
      return NextResponse.json({ error: 'Paste not found.' }, { status: 404 });
    }

    return NextResponse.json(paste);
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
