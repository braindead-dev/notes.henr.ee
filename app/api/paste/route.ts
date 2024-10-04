import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

if (!global.pastes) {
  global.pastes = new Map();
}

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json(); // Accept both title and content

    // Validate incoming data
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'Invalid title. Title cannot be empty.' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json({ error: 'Invalid content. Content cannot be empty.' }, { status: 400 });
    }
    if (title.length > 100) {
      return NextResponse.json({ error: 'Title is too long. Maximum length is 100 characters.' }, { status: 400 });
    }

    const id = uuidv4();
    global.pastes.set(id, { title, content });
    console.log("Stored paste:", id, title, content);

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Error storing paste:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
